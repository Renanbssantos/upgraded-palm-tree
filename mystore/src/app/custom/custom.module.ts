import { NgModule } from '@angular/core';
import { CmsConfig, I18nConfig, OccConfig, PRODUCT_NORMALIZER, provideConfig } from '@spartacus/core';
import { LayoutConfig } from '@spartacus/storefront';
import { CustomProductSummary } from './custom-product-summary/custom-product-summary';
import { ProductComparison } from './product-comparison/product-comparison';
import { WarrantyNormalizer } from './warranty.normalizer';

// Every storefront customization of Phase 4 lives here (imported by AppModule).
@NgModule({
  providers: [
    // Step 5: "wherever the CMS asks for ProductSummaryComponent, use CustomProductSummary"
    provideConfig(<CmsConfig>{
      cmsComponents: {
        ProductSummaryComponent: { component: CustomProductSummary },
        // Phase 5, Step 5: links the CMSFlexComponent's flexType to the comparison page
        ProductComparisonComponent: { component: ProductComparison },
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

    // Step 9: our texts, per language → chunk → keys (exercise keys included)
    provideConfig(<I18nConfig>{
      i18n: {
        resources: {
          en: {
            custom: {
              shipping: { freeAbove: 'Free shipping over {{ value }}', badge: 'Free shipping' },
              // i18next picks _one / _other from the "count" parameter
              cartBadge: { items_one: '{{ count }} item', items_other: '{{ count }} items' },
              product: { warranty: 'Warranty: {{ years }} years' },
            },
            // Phase 5: the comparison tool
            compare: {
              compare: {
                add: 'Compare',
                remove: 'Remove from comparison',
                limit: 'Limit of {{ max }} products: remove one to add this product.',
                empty: 'No products to compare yet. Use the "Compare" button on a product page.',
                badge: 'Compare ({{ count }})',
                title: 'Product comparison',
                product: 'Product',
                price: 'Price',
                rating: 'Rating',
                removeShort: 'Remove',
                removeProduct: 'Remove {{ name }} from comparison',
                clear: 'Clear comparison',
              },
            },
          },
          de: {
            custom: {
              shipping: { freeAbove: 'Kostenloser Versand ab {{ value }}', badge: 'Kostenloser Versand' },
              cartBadge: { items_one: '{{ count }} Artikel', items_other: '{{ count }} Artikel' },
              product: { warranty: 'Garantie: {{ years }} Jahre' },
            },
            compare: {
              compare: {
                add: 'Vergleichen',
                remove: 'Aus dem Vergleich entfernen',
                limit: 'Maximal {{ max }} Produkte: Entfernen Sie eines, um dieses hinzuzufügen.',
                empty: 'Noch keine Produkte zum Vergleichen. Nutzen Sie „Vergleichen“ auf einer Produktseite.',
                badge: 'Vergleich ({{ count }})',
                title: 'Produktvergleich',
                product: 'Produkt',
                price: 'Preis',
                rating: 'Bewertung',
                removeShort: 'Entfernen',
                removeProduct: '{{ name }} aus dem Vergleich entfernen',
                clear: 'Vergleich leeren',
              },
            },
          },
        },
        // tells which chunk holds each top-level key
        chunks: { custom: ['shipping', 'cartBadge', 'product'], compare: ['compare'] },
      },
    }),

    // Step 10: add our normalizer to the queue (multi: true keeps the default ones)...
    { provide: PRODUCT_NORMALIZER, useExisting: WarrantyNormalizer, multi: true },
    // ...and request the field: the storefront's default "details" scope + warrantyYears at the end
    provideConfig(<OccConfig>{
      backend: {
        occ: {
          endpoints: {
            product: {
              details:
                'products/${productCode}?fields=averageRating,stock(DEFAULT),description,availableForPickup,code,url,price(DEFAULT),numberOfReviews,manufacturer,categories(FULL),priceRange,multidimensional,tags,images(FULL),warrantyYears',
            },
          },
        },
      },
    }),
  ],
})
export class CustomModule {}
