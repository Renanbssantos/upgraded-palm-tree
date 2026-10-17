import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CurrentProductService } from '@spartacus/storefront';

// Phase 4, Step 5: replaces the CMS component ProductSummaryComponent (mapping in custom.module.ts).
// Exercise: "Free shipping" badge above 200.
@Component({
  selector: 'app-custom-product-summary',
  template: `
    @if (product(); as p) {
      <!-- only renders once the product has arrived -->
      <h2>{{ p.name }}</h2>
      <p class="price">{{ p.price?.formattedValue }}</p>
      @if (freeShipping()) {
        <span class="badge-free-shipping">Free shipping</span>
      }
      <p [innerHTML]="p.summary"></p>
      <!-- summary comes with HTML from the backend -->
    }
  `,
})
export class CustomProductSummary {
  // CurrentProductService knows which product is in the PDP URL
  product = toSignal(inject(CurrentProductService).getProduct());

  freeShipping = computed(() => (this.product()?.price?.value ?? 0) > 200);
}
