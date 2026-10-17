import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActiveCartFacade } from '@spartacus/cart/base/root'; // facades live in the "/root" packages
import { I18nModule } from '@spartacus/core';
import { map } from 'rxjs';

// Phase 4, Step 4 (facade + signals), with the Step 4 and Step 9 exercises:
// formatted total, and the item count text coming from i18n.
// Placed next to the mini cart through an outlet (Step 6, see app.component.html).
@Component({
  selector: 'app-cart-badge',
  imports: [I18nModule],
  template: `
    <span class="cart-badge" aria-live="polite">
      {{ 'cartBadge.items' | cxTranslate: { count: totalItems() } }}
      @if (total()) {
        <span class="cart-badge__total">· {{ total() }}</span>
      }
    </span>
  `,
})
export class CartBadge {
  private activeCart = inject(ActiveCartFacade); // asks Angular for the facade (DI)

  totalItems = toSignal(
    this.activeCart.getActive().pipe(map((cart) => cart.totalItems ?? 0)), // Observable<Cart> -> number
    { initialValue: 0 },
  );

  total = toSignal(
    this.activeCart.getActive().pipe(map((cart) => cart.totalPrice?.formattedValue ?? '')),
    { initialValue: '' },
  );
}
