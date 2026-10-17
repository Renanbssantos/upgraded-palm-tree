import { Routes } from '@angular/router';
import { ProductList } from './product-list/product-list';
import { ProductDetail } from './product-detail/product-detail';
import { Search } from './search/search';

export const routes: Routes = [
  { path: '', component: ProductList },
  { path: 'product/:id', component: ProductDetail },
  { path: 'search', component: Search },
  { path: '**', redirectTo: '' },
];
