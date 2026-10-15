import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product } from './product.model';

describe('ProductService', () => {
  it('fetches products', () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    const service = TestBed.inject(ProductService);
    const http = TestBed.inject(HttpTestingController);

    let result: Product[] = [];
    service.list().subscribe((r) => (result = r.products));
    http.expectOne('https://dummyjson.com/products').flush({ products: [{ id: 1, title: 'TV' }] });

    expect(result.length).toBe(1);
  });
});
