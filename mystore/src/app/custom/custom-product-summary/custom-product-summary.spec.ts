import { TestBed } from '@angular/core/testing';
import { MockTranslatePipe, Product } from '@spartacus/core';
import { CurrentProductService } from '@spartacus/storefront';
import { of } from 'rxjs';
import { CustomProductSummary } from './custom-product-summary';

function render(product: Product) {
  TestBed.configureTestingModule({
    imports: [CustomProductSummary],
    providers: [{ provide: CurrentProductService, useValue: { getProduct: () => of(product) } }],
  });
  // MockTranslatePipe prints "key param:value" instead of the real text
  TestBed.overrideComponent(CustomProductSummary, { set: { imports: [MockTranslatePipe] } });
  const fixture = TestBed.createComponent(CustomProductSummary);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('CustomProductSummary', () => {
  it('shows name, price, the free-shipping badge above 200 and the warranty', () => {
    const el = render({ name: 'PowerShot A480', price: { value: 264.69, formattedValue: '$264.69' }, warrantyYears: 2 });

    expect(el.querySelector('h2')?.textContent).toBe('PowerShot A480');
    expect(el.querySelector('.price')?.textContent).toBe('$264.69');
    expect(el.querySelector('.badge-free-shipping')?.textContent).toBe('shipping.badge');
    expect(el.querySelector('.warranty')?.textContent).toBe('product.warranty years:2');
  });

  it('has no badge at 200 or below and no warranty line without the field', () => {
    const el = render({ name: 'Photosmart', price: { value: 114.12, formattedValue: '$114.12' } });

    expect(el.querySelector('.badge-free-shipping')).toBeNull();
    expect(el.querySelector('.warranty')).toBeNull();
  });
});
