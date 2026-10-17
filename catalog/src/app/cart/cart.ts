import { Component, computed, effect, signal } from '@angular/core';

@Component({
  selector: 'app-cart',
  template: `<button (click)="add('A', 10)">Add A</button> <button (click)="clear()">Clear</button> <p>Total: {{ total() }}</p><p>Count: {{ itemCount() }}</p><button (click)="increment('A')">+A</button>`,
})
export class Cart {
  items = signal<{ code: string; qty: number; price: number }[]>([]);
  total = computed(() => this.items().reduce((sum, i) => sum + i.qty * i.price, 0));
  // exercise solution
  itemCount = computed(() => this.items().reduce((n, i) => n + i.qty, 0));

  constructor() {
    effect(() => console.log('Cart total:', this.total()));
  }
  add(code: string, price: number) {
    this.items.update((list) => [...list, { code, qty: 1, price }]);
  }
  clear() { this.items.set([]); }
  increment(code: string) {
    this.items.update((list) => list.map((i) => (i.code === code ? { ...i, qty: i.qty + 1 } : i)));
  }
}
