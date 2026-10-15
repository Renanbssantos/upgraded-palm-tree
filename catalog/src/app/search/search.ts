import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, debounceTime, distinctUntilChanged, filter, map, of, switchMap } from 'rxjs';
import { Product } from '../product.model';

@Component({
  selector: 'app-search',
  template: `<input (input)="term.set($any($event.target).value)" placeholder="Search" /> @for (p of results(); track p.id) { <p>{{ p.title }}</p> }`,
})
export class Search {
  private http = inject(HttpClient);
  term = signal('');

  results = toSignal(
    toObservable(this.term).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter((q) => q.length >= 2),
      switchMap((q) =>
        this.http.get<{ products: Product[] }>(`https://dummyjson.com/products/search?q=${q}`),
      ),
      map((r) => r.products),
      catchError(() => of([])),
    ),
    { initialValue: [] as Product[] },
  );
}
