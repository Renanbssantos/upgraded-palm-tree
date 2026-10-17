import { TestBed } from '@angular/core/testing';
import { QtySelector } from './qty-selector';

describe('QtySelector', () => {
  it('stops at max', () => {
    const fixture = TestBed.createComponent(QtySelector);
    fixture.componentRef.setInput('max', 2);
    const c = fixture.componentInstance;
    c.increment(); c.increment(); c.increment();
    expect(c.qty()).toBe(2);
  });
});
