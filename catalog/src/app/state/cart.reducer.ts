import { createReducer, on } from '@ngrx/store';
import { addItem, removeItem } from './cart.actions';

export interface CartState { items: { code: string; price: number; qty: number }[] }
const initialState: CartState = { items: [] };

export const cartReducer = createReducer(
  initialState,
  on(addItem, (state, { code, price }) => ({
    ...state,
    items: [...state.items, { code, price, qty: 1 }],
  })),
  on(removeItem, (state, { code }) => ({ ...state, items: state.items.filter((i) => i.code !== code) })),
);
