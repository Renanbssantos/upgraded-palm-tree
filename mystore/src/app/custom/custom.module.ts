import { NgModule } from '@angular/core';
import { CmsConfig, provideConfig } from '@spartacus/core';
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
  ],
})
export class CustomModule {}
