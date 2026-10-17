import { Component, computed, signal } from '@angular/core';
import { ProductCard } from '../product-card/product-card';

@Component({
  selector: 'app-product-list',
  imports: [ProductCard],
  templateUrl: './product-list.html',
})
export class ProductList {
  // test data until Step 6 brings real products from the API
  products = signal([
    { id: 1, title: 'Phone', price: 300, stock: 3 },
    { id: 2, title: 'Laptop', price: 1500, stock: 0 },
    { id: 3, title: 'Tablet', price: 500, stock: 12 },
  ]);
  term = signal('');
  filtered = computed(() =>
    this.products().filter((p) => p.title.toLowerCase().includes(this.term().toLowerCase())),
  );
}
