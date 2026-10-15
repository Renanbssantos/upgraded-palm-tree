import { Component, input } from '@angular/core';
@Component({ selector: 'app-product-reviews', template: `<p id="reviews">Reviews for {{ productId() }}</p>` })
export class ProductReviews { productId = input<string>(''); }
