import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from './product.model';

@Injectable({ providedIn: 'root' })        // 'root' = a single instance for the whole app
export class ProductService {
  private http = inject(HttpClient);       // asks Angular for HttpClient
  list() {
    // GET on the public test API; <...> declares the expected response shape
    return this.http.get<{ products: Product[] }>('https://dummyjson.com/products');
  }
  byId(id: string) {
    return this.http.get<Product>(`https://dummyjson.com/products/${id}`);
  }
}
