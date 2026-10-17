import { Component, input, linkedSignal, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Product } from '../product.model';
import { QtySelector } from '../qty-selector/qty-selector';

@Component({
  selector: 'app-product-detail',
  imports: [QtySelector],
  templateUrl: './product-detail.html',
})
export class ProductDetail {
  id = input.required<string>();
  product = httpResource<Product>(() => `https://dummyjson.com/products/${this.id()}`);
  selectedImage = linkedSignal(() => this.product.value()?.images?.[0]);
  quantity = signal(1);
  limit = signal<number | null>(null);
}
