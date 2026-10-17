import { Component, signal } from '@angular/core';
import { StorefrontComponent } from '@spartacus/storefront';
import { CartBadge } from './custom/cart-badge/cart-badge';

@Component({
  selector: 'app-root',
  imports: [StorefrontComponent, CartBadge],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class App {
  protected readonly title = signal('mystore');
}
