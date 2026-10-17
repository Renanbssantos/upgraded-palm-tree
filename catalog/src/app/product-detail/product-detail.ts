import { Component, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-detail',
  template: `<h2>{{ product()?.title }}</h2><p>{{ product()?.description }}</p>`,
})
export class ProductDetail {
  private service = inject(ProductService);
  id = input.required<string>();   // automatically receives :id from the URL
  product = toSignal(toObservable(this.id).pipe(switchMap((id) => this.service.byId(id))));
}
