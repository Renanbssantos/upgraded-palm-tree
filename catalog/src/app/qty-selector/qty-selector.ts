import { Component, ElementRef, input, model, output, viewChild } from '@angular/core';

@Component({
  selector: 'app-qty-selector',
  template: `
    <button (click)="decrement()">-</button>
    <input #qtyInput [value]="qty()" readonly />   <!-- #qtyInput names the element -->
    <button (click)="increment()">+</button>
  `,
})
export class QtySelector {
  qty = model(1);
  max = input(10);
  limitReached = output<number>();
  inputEl = viewChild<ElementRef<HTMLInputElement>>('qtyInput');

  increment() {
    if (this.qty() >= this.max()) {
      this.inputEl()?.nativeElement.focus();
      this.limitReached.emit(this.max());
      return;
    }
    this.qty.update((q) => q + 1);
  }
  decrement() { this.qty.update((q) => Math.max(1, q - 1)); }
}
