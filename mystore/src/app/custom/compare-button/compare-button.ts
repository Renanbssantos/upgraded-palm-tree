import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { I18nModule } from '@spartacus/core';
import { CurrentProductService } from '@spartacus/storefront';
import { COMPARISON_MAX, ProductComparisonService } from '../product-comparison/product-comparison.service';

// Phase 5, Step 4: "Compare" button on the PDP, placed after "Add to cart" through an outlet.
@Component({
  selector: 'app-compare-button',
  imports: [I18nModule], // for the cxTranslate pipe
  template: `
    @if (product(); as p) {
      @let blocked = !comparison.has(p.code!) && comparison.isFull();
      <!-- disabled when the list is full and this product is not in it -->
      <button
        type="button"
        class="btn btn-block btn-secondary compare-button"
        [disabled]="blocked"
        [attr.aria-describedby]="blocked ? 'compare-limit' : null"
        (click)="comparison.toggle(p.code!)"
      >
        {{ (comparison.has(p.code!) ? 'compare.remove' : 'compare.add') | cxTranslate }}
      </button>
      <!-- stretch goal: the reason, below the disabled button -->
      @if (blocked) {
        <p id="compare-limit" class="compare-limit">{{ 'compare.limit' | cxTranslate: { max: max } }}</p>
      }
    }
  `,
})
export class CompareButton {
  comparison = inject(ProductComparisonService); // public: used in the template
  product = toSignal(inject(CurrentProductService).getProduct()); // product on the PDP
  protected readonly max = COMPARISON_MAX;
}
