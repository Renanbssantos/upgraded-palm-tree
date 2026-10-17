import { Component } from '@angular/core';
import { ProductCard } from './product-card/product-card';

@Component({
  selector: 'app-root',
  imports: [ProductCard],
  templateUrl: './app.html',
})
export class App {}
