import { TestBed } from '@angular/core/testing';
import { MockTranslatePipe, Product, ProductService } from '@spartacus/core';
import { of } from 'rxjs';
import { ProductComparison } from './product-comparison';
import { ProductComparisonService } from './product-comparison.service';

const spec = (name: string, value: string) => ({ name, featureValues: [{ value }] });
const products: Record<string, Product> = {
  A: { code: 'A', name: 'Phone', price: { formattedValue: '$300' }, averageRating: 4.5, classifications: [{ features: [spec('Weight', '150 g'), spec('Zoom', '2x')] }] },
  B: { code: 'B', name: 'Tablet', price: { formattedValue: '$500' }, classifications: [{ features: [spec('Weight', '480 g'), spec('Display', '11 in')] }] },
};

function render(codes: string[]) {
  localStorage.setItem('compare', JSON.stringify(codes));
  TestBed.configureTestingModule({
    imports: [ProductComparison],
    // the facade replaced by a stunt double: no store, no OCC; 'GONE' never loads
    providers: [{ provide: ProductService, useValue: { get: (code: string) => of(products[code]) } }],
  });
  TestBed.overrideComponent(ProductComparison, { set: { imports: [MockTranslatePipe] } });
  const fixture = TestBed.createComponent(ProductComparison);
  fixture.detectChanges();
  const el = fixture.nativeElement as HTMLElement;
  const row = (header: string) =>
    [...el.querySelectorAll('tr')]
      .find((tr) => tr.querySelector('th[scope=row]')?.textContent?.trim() === header)
      ?.querySelectorAll('td');
  return { fixture, el, row };
}

describe('ProductComparison', () => {
  beforeEach(() => localStorage.clear());

  it('shows the empty message when the list is empty', () => {
    const { el } = render([]);
    expect(el.querySelector('.comparison-empty')?.textContent).toBe('compare.empty');
    expect(el.querySelector('table')).toBeNull();
  });

  it('shows one column per product with price and rating, skipping products that do not load', () => {
    const { el, row } = render(['A', 'GONE', 'B']);
    expect(el.querySelectorAll('th[scope=col]').length).toBe(2);
    expect([...row('compare.price')!].map((td) => td.textContent)).toEqual(['$300', '$500']);
    expect([...row('compare.rating')!].map((td) => td.textContent)).toEqual(['4.5', '—']);
  });

  it('aligns the technical attributes and fills the gaps with a dash (stretch goal)', () => {
    const { row } = render(['A', 'B']);
    expect([...row('Weight')!].map((td) => td.textContent)).toEqual(['150 g', '480 g']);
    expect([...row('Zoom')!].map((td) => td.textContent)).toEqual(['2x', '—']);
    expect([...row('Display')!].map((td) => td.textContent)).toEqual(['—', '11 in']);
  });

  it('removes a product from the list', () => {
    const { el, fixture } = render(['A', 'B']);
    (el.querySelector('.comparison-remove') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(TestBed.inject(ProductComparisonService).codes()).toEqual(['B']);
    expect(el.querySelectorAll('th[scope=col]').length).toBe(1);
  });
});
