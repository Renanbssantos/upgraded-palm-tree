import { TestBed } from '@angular/core/testing';
import { provideStore } from '@ngrx/store';
import { Cart } from './cart';
import { cartReducer } from '../state/cart.reducer';
import { addItem, removeItem } from '../state/cart.actions';

describe('Cart', () => {
  it('sums the total', () => {
    TestBed.configureTestingModule({ providers: [provideStore({ cart: cartReducer })] });
    const cart = TestBed.runInInjectionContext(() => new Cart());
    cart.add('A', 10);
    cart.add('B', 5);
    expect(cart.total()).toBe(15);
  });

  it('removeItem drops the item', () => {
    const state = cartReducer(cartReducer(undefined, addItem({ code: 'A', price: 10 })), removeItem({ code: 'A' }));
    expect(state.items.length).toBe(0);
  });
});
