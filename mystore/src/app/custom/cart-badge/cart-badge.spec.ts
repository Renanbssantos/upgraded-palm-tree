import { TestBed } from '@angular/core/testing';
import { ActiveCartFacade, Cart } from '@spartacus/cart/base/root';
import { MockTranslatePipe } from '@spartacus/core';
import { of } from 'rxjs';
import { CartBadge } from './cart-badge';

function render(cart: Cart) {
  TestBed.configureTestingModule({
    imports: [CartBadge],
    // the facade is the only dependency: a fake one is enough (no store, no OCC)
    providers: [{ provide: ActiveCartFacade, useValue: { getActive: () => of(cart) } }],
  });
  TestBed.overrideComponent(CartBadge, { set: { imports: [MockTranslatePipe] } });
  const fixture = TestBed.createComponent(CartBadge);
  fixture.detectChanges();
  return (fixture.nativeElement as HTMLElement).textContent?.replace(/\s+/g, ' ').trim();
}

describe('CartBadge', () => {
  it('shows the item count and the formatted total of the active cart', () => {
    expect(render({ totalItems: 2, totalPrice: { formattedValue: '$813.69' } })).toBe('cartBadge.items count:2 · $813.69');
  });

  it('shows 0 and no total for an empty cart', () => {
    expect(render({})).toBe('cartBadge.items count:0');
  });
});
