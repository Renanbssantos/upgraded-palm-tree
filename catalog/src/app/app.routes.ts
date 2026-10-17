import { Routes } from '@angular/router';
import { ProductList } from './product-list/product-list';
import { ProductDetail } from './product-detail/product-detail';
import { Search } from './search/search';
import { Experiment } from './experiment/experiment';

export const routes: Routes = [
  { path: '', component: ProductList },
  { path: 'product/:id', component: ProductDetail },
  { path: 'search', component: Search },
  { path: 'experiment', component: Experiment },
  { path: '**', redirectTo: '' },
];
