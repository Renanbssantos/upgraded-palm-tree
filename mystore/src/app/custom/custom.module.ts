import { NgModule } from '@angular/core';
import { CmsConfig, provideConfig } from '@spartacus/core';
import { LayoutConfig } from '@spartacus/storefront';
import { CustomProductSummary } from './custom-product-summary/custom-product-summary';

// Every storefront customization of Phase 4 lives here (imported by AppModule).
@NgModule({
  providers: [
    // Step 5: "wherever the CMS asks for ProductSummaryComponent, use CustomProductSummary"
    provideConfig(<CmsConfig>{
      cmsComponents: {
        ProductSummaryComponent: { component: CustomProductSummary },
      },
    }),

    // Step 7: slot order per screen size for the product page template
    provideConfig(<LayoutConfig>{
      layoutSlots: {
        ProductDetailsPageTemplate: {
          // default (applies to every size without its own rule)
          slots: ['Summary', 'Tabs', 'UpSelling', 'CrossSelling', 'PlaceholderContentSlot'],
          // on large screens, recommendations move up right after the summary
          lg: { slots: ['Summary', 'UpSelling', 'CrossSelling', 'Tabs', 'PlaceholderContentSlot'] },
          // exercise: hide CrossSelling on phones only (xs and sm)...
          xs: { slots: ['Summary', 'Tabs', 'UpSelling', 'PlaceholderContentSlot'] },
          // ...but a breakpoint without its own rule takes the closest SMALLER one (not the default),
          // so tablets (md) need their own rule or they inherit the xs list
          md: { slots: ['Summary', 'Tabs', 'UpSelling', 'CrossSelling', 'PlaceholderContentSlot'] },
        },
      },
    }),
  ],
})
export class CustomModule {}
