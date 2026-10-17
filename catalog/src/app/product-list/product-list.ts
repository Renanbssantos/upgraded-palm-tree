import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ProductCard } from '../product-card/product-card';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-list',
  imports: [ProductCard],
  templateUrl: './product-list.html',
})
export class ProductList {
  private service = inject(ProductService);
  products = toSignal(this.service.list().pipe(map((r) => r.products)), { initialValue: [] });
  term = signal('');
  filtered = computed(() =>
    this.products().filter((p) => p.title.toLowerCase().includes(this.term().toLowerCase())),
  );
}
