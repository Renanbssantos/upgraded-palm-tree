import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Cart } from './cart/cart';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Cart],
  templateUrl: './app.html',
})
export class App {}
