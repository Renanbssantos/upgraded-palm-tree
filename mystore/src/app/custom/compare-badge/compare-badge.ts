import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nModule } from '@spartacus/core';
import { ProductComparisonService } from '../product-comparison/product-comparison.service';

// Phase 5, Step 6: "Compare (N)" link in the header, on every page.
// Stretch goal: the wrapper is an aria-live region that is always in the page,
// so screen readers announce the new count when an item enters or leaves the list.
@Component({
  selector: 'app-compare-badge',
  imports: [RouterLink, I18nModule],
  template: `
    <span class="compare-badge" aria-live="polite">
      @if (comparison.count() > 0) {
        <!-- only shows when there are items -->
        <a routerLink="/compare">{{ 'compare.badge' | cxTranslate: { count: comparison.count() } }}</a>
      }
    </span>
  `,
})
export class CompareBadge {
  comparison = inject(ProductComparisonService);
}
