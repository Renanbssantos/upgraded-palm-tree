import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CartState } from './cart.reducer';
export const selectCart = createFeatureSelector<CartState>('cart');
export const selectTotal = createSelector(selectCart, (s) =>
  s.items.reduce((t, i) => t + i.price * i.qty, 0),
);
