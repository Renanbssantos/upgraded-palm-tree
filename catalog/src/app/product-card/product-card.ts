import { Component, computed, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-card',        // the tag used to place the component: <app-product-card>
  imports: [CurrencyPipe],             // standalone: declare here everything the template uses
  template: `
    <h3>{{ name() }}</h3>              <!-- reads the "name" signal (note the parentheses) -->
    <p>{{ price() | currency: 'USD' }}</p>   <!-- the pipe formats as currency -->
    @if (isExpensive()) { <span>Premium</span> }
    <p>Final: {{ finalPrice() | currency: 'USD' }}</p>
  `,
})
export class ProductCard {
  name = input.required<string>();     // data from the parent component; required
  price = input<number>(0);            // data from the parent; defaults to 0
  isExpensive = computed(() => this.price() > 1000); // recalculates when price changes
  // exercise solution
  discount = input(0);
  finalPrice = computed(() => this.price() * (1 - this.discount() / 100));
}
