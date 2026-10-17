import { Component, computed, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { I18nModule, Product, ProductScope, ProductService } from '@spartacus/core';
import { combineLatest, map, of, switchMap } from 'rxjs';
import { ProductComparisonService } from './product-comparison.service';

interface AttributeRow {
  name: string;
  values: string[]; // one per product, "—" when the product does not have it
}

// Phase 5, Step 5: the /compare page, mapped to the CMS flexType "ProductComparisonComponent".
@Component({
  selector: 'app-product-comparison',
  imports: [I18nModule],
  template: `
    @if (products().length === 0) {
      <p class="comparison-empty">{{ 'compare.empty' | cxTranslate }}</p>
    } @else {
      <div class="comparison-wrapper">
        <table class="comparison">
          <caption class="cx-visually-hidden">{{ 'compare.title' | cxTranslate }}</caption>
          <tr>
            <th scope="row">{{ 'compare.product' | cxTranslate }}</th>
            @for (p of products(); track p.code) {
              <th scope="col">
                {{ p.name }}
                <button
                  type="button"
                  class="btn btn-link comparison-remove"
                  [attr.aria-label]="'compare.removeProduct' | cxTranslate: { name: p.name }"
                  (click)="comparison.toggle(p.code!)"
                >
                  {{ 'compare.removeShort' | cxTranslate }}
                </button>
              </th>
            }
          </tr>
          <tr>
            <th scope="row">{{ 'compare.price' | cxTranslate }}</th>
            @for (p of products(); track p.code) {
              <td>{{ p.price?.formattedValue }}</td>
            }
          </tr>
          <tr>
            <th scope="row">{{ 'compare.rating' | cxTranslate }}</th>
            @for (p of products(); track p.code) {
              <td>{{ p.averageRating ?? '—' }}</td>
            }
          </tr>
          <!-- stretch goal: one row per technical attribute, aligned across products -->
          @for (row of attributes(); track row.name) {
            <tr>
              <th scope="row">{{ row.name }}</th>
              @for (value of row.values; track $index) {
                <td>{{ value }}</td>
              }
            </tr>
          }
        </table>
      </div>
      <button type="button" class="btn btn-secondary comparison-clear" (click)="comparison.clear()">
        {{ 'compare.clear' | cxTranslate }}
      </button>
    }
  `,
})
export class ProductComparison {
  protected comparison = inject(ProductComparisonService);
  private productService = inject(ProductService); // product facade

  products = toSignal(
    toObservable(this.comparison.codes).pipe(
      // signal → belt
      switchMap((codes) =>
        codes.length
          ? combineLatest(
              // waits for every product; facades never complete, so not forkJoin
              codes.map((c) => this.productService.get(c, [ProductScope.DETAILS, ProductScope.ATTRIBUTES])),
            )
          : of([]), // empty list: nothing to fetch
      ),
      map((list) => list.filter((p): p is Product => !!p)), // drops the ones not loaded (or not existing)
    ),
    { initialValue: [] as Product[] },
  );

  // every feature name found in any product, in order of appearance, with each product's value
  attributes = computed<AttributeRow[]>(() => {
    const products = this.products();
    const valuesByProduct = products.map((p) => {
      const byName = new Map<string, string>();
      for (const c of p.classifications ?? [])
        for (const f of c.features ?? [])
          if (f.name) byName.set(f.name, (f.featureValues ?? []).map((v) => v.value).join(', '));
      return byName;
    });
    const names = [...new Set(valuesByProduct.flatMap((m) => [...m.keys()]))];
    return names.map((name) => ({ name, values: valuesByProduct.map((m) => m.get(name) || '—') }));
  });
}
