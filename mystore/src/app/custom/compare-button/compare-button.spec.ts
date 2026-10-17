import { TestBed } from '@angular/core/testing';
import { MockTranslatePipe, Product } from '@spartacus/core';
import { CurrentProductService } from '@spartacus/storefront';
import { of } from 'rxjs';
import { ProductComparisonService } from '../product-comparison/product-comparison.service';
import { CompareButton } from './compare-button';

function render(product: Product) {
  TestBed.configureTestingModule({
    imports: [CompareButton],
    providers: [{ provide: CurrentProductService, useValue: { getProduct: () => of(product) } }],
  });
  TestBed.overrideComponent(CompareButton, { set: { imports: [MockTranslatePipe] } });
  const fixture = TestBed.createComponent(CompareButton);
  fixture.detectChanges();
  const button = () => fixture.nativeElement.querySelector('button') as HTMLButtonElement;
  return { fixture, button, service: TestBed.inject(ProductComparisonService) };
}

describe('CompareButton', () => {
  beforeEach(() => localStorage.clear());

  it('toggles between add and remove', () => {
    const { fixture, button, service } = render({ code: 'A' });
    expect(button().textContent?.trim()).toBe('compare.add');

    button().click();
    fixture.detectChanges();

    expect(service.has('A')).toBe(true);
    expect(button().textContent?.trim()).toBe('compare.remove');
  });

  it('is disabled, with the reason, when the list is full (stretch goal)', () => {
    localStorage.setItem('compare', '["B","C","D","E"]');
    const { fixture, button } = render({ code: 'A' });

    expect(button().disabled).toBe(true);
    expect(button().getAttribute('aria-describedby')).toBe('compare-limit');
    expect(fixture.nativeElement.querySelector('#compare-limit')?.textContent).toBe('compare.limit max:4');
  });

  it('stays enabled for a product already in a full list, so it can be removed', () => {
    localStorage.setItem('compare', '["A","C","D","E"]');
    expect(render({ code: 'A' }).button().disabled).toBe(false);
  });
});
