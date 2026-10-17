import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Cart } from './cart/cart';
import { LastVisit } from './last-visit/last-visit';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Cart, LastVisit],
  templateUrl: './app.html',
})
export class App {}
