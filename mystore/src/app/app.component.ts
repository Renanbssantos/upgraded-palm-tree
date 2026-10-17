import { Component, signal } from '@angular/core';
import { I18nModule } from '@spartacus/core';
import { OutletPosition, OutletRefDirective, StorefrontComponent } from '@spartacus/storefront';
import { CartBadge } from './custom/cart-badge/cart-badge';

@Component({
  selector: 'app-root',
  imports: [StorefrontComponent, OutletRefDirective, I18nModule, CartBadge],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class App {
  protected readonly title = signal('mystore');
  // with strictTemplates, cxOutletPos takes the enum, not the plain string "after"
  protected readonly OutletPosition = OutletPosition;
}
