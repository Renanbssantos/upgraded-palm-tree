import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { I18nModule } from '@spartacus/core';
import { CurrentProductService } from '@spartacus/storefront';

// Phase 4, Step 5: replaces the CMS component ProductSummaryComponent (mapping in custom.module.ts).
// Exercises: "Free shipping" badge above 200 (Step 5), translated (Step 9),
// and the custom attribute warrantyYears read through a normalizer (Step 10).
@Component({
  selector: 'app-custom-product-summary',
  imports: [I18nModule],
  template: `
    @if (product(); as p) {
      <!-- only renders once the product has arrived -->
      <h2>{{ p.name }}</h2>
      <p class="price">{{ p.price?.formattedValue }}</p>
      @if (freeShipping()) {
        <span class="badge-free-shipping">{{ 'shipping.badge' | cxTranslate }}</span>
      }
      <p [innerHTML]="p.summary"></p>
      <!-- summary comes with HTML from the backend -->
      @if (p.warrantyYears) {
        <p class="warranty">{{ 'product.warranty' | cxTranslate: { years: p.warrantyYears } }}</p>
      }
    }
  `,
})
export class CustomProductSummary {
  // CurrentProductService knows which product is in the PDP URL
  product = toSignal(inject(CurrentProductService).getProduct());

  freeShipping = computed(() => (this.product()?.price?.value ?? 0) > 200);
}
