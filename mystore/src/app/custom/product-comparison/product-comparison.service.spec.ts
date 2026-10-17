import { TestBed } from '@angular/core/testing';
import { ProductComparisonService } from './product-comparison.service';

describe('ProductComparisonService', () => {
  // localStorage survives between tests: clear it so one test doesn't "leak" into another
  beforeEach(() => localStorage.clear());

  it('caps the list at 4 products', () => {
    const service = TestBed.inject(ProductComparisonService); // arrange
    ['A', 'B', 'C', 'D', 'E'].forEach((c) => service.toggle(c)); // act: tries 5
    expect(service.count()).toBe(4); // assert
    expect(service.isFull()).toBe(true);
    expect(service.has('E')).toBe(false);
  });

  it('removes a product already in the list', () => {
    const service = TestBed.inject(ProductComparisonService);
    service.toggle('A');
    service.toggle('A');
    expect(service.count()).toBe(0);
  });

  it('remembers the last product added and clears everything (stretch goal)', () => {
    const service = TestBed.inject(ProductComparisonService);
    service.toggle('A');
    service.toggle('B');
    expect(service.lastAdded()).toBe('B');
    service.clear();
    expect(service.codes()).toEqual([]);
    expect(service.lastAdded()).toBeNull();
  });

  it('saves the list in the browser', () => {
    const service = TestBed.inject(ProductComparisonService);
    service.toggle('A');
    TestBed.tick(); // runs pending effects
    expect(localStorage.getItem('compare')).toBe('["A"]');
  });

  it('loads the saved list and ignores corrupted data', () => {
    localStorage.setItem('compare', '["X","Y"]');
    expect(TestBed.inject(ProductComparisonService).codes()).toEqual(['X', 'Y']);

    TestBed.resetTestingModule();
    localStorage.setItem('compare', '{not json');
    expect(TestBed.inject(ProductComparisonService).codes()).toEqual([]);
  });
});
