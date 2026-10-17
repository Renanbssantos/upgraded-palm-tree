import { Component, computed, effect, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { addItem, removeItem } from '../state/cart.actions';
import { selectTotal } from '../state/cart.selectors';

@Component({
  selector: 'app-cart',
  template: `<button (click)="add('A', 10)">Add A</button> <button (click)="remove('A')">Remove A</button> <button (click)="clear()">Clear</button> <p>Total: {{ total() }}</p><p>Store total: {{ storeTotal() }}</p><p>Count: {{ itemCount() }}</p><button (click)="increment('A')">+A</button>`,
})
export class Cart {
  private store = inject(Store);
  storeTotal = this.store.selectSignal(selectTotal);

  items = signal<{ code: string; qty: number; price: number }[]>([]);
  total = computed(() => this.items().reduce((sum, i) => sum + i.qty * i.price, 0));
  itemCount = computed(() => this.items().reduce((n, i) => n + i.qty, 0));

  constructor() {
    effect(() => console.log('Cart total:', this.total()));
  }
  add(code: string, price: number) {
    this.items.update((list) => [...list, { code, qty: 1, price }]);
    this.store.dispatch(addItem({ code, price }));
  }
  remove(code: string) { this.store.dispatch(removeItem({ code })); }
  clear() { this.items.set([]); }
  increment(code: string) {
    this.items.update((list) => list.map((i) => (i.code === code ? { ...i, qty: i.qty + 1 } : i)));
  }
}
