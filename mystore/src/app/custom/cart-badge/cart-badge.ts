import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActiveCartFacade } from '@spartacus/cart/base/root'; // facades live in the "/root" packages
import { map } from 'rxjs';

// Phase 4, Step 4 (facade + signals), with the exercise: the formatted total.
@Component({
  selector: 'app-cart-badge',
  template: `<span class="cart-badge">{{ totalItems() }} items · {{ total() }}</span>`,
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
