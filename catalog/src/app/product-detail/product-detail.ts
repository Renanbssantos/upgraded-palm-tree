import { Component, input, linkedSignal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Product } from '../product.model';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.html',
})
export class ProductDetail {
  id = input.required<string>();
  product = httpResource<Product>(() => `https://dummyjson.com/products/${this.id()}`);
  selectedImage = linkedSignal(() => this.product.value()?.images?.[0]);
}
