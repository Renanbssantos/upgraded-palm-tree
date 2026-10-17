import { NgModule } from '@angular/core';
import { translationChunksConfig, translationsDe, translationsEn } from '@spartacus/assets';
import {
  FeaturesConfig,
  I18nConfig,
  OccConfig,
  provideConfig,
  provideConfigFactory,
  SiteContextConfig,
} from '@spartacus/core';
import {
  defaultCmsContentProviders,
  layoutConfigFactory,
  mediaConfig,
} from '@spartacus/storefront';

@NgModule({
  declarations: [],
  imports: [],
  providers: [
    provideConfigFactory(layoutConfigFactory),
    provideConfig(mediaConfig),
    ...defaultCmsContentProviders,
    provideConfig(<OccConfig>{
      backend: {
        occ: {
          baseUrl: 'http://localhost:9002',
        },
      },
    }),
    provideConfig(<SiteContextConfig>{
      context: {
        currency: ['USD'],
        // Phase 4, Step 3: German is offered by the base site; the first entry is the default.
        // Exercise solution: ['de', 'en'] makes German the default.
        language: ['en', 'de'],
        baseSite: ['electronics-spa'],
        // Phase 5, Step 8 (SSR check): with SSR, a language switch reloads the page
        // (feature toggle reloadOnLanguageChange) and the server only knows the language
        // if it is in the URL: /electronics-spa/de/USD/...
        urlParameters: ['baseSite', 'language', 'currency'],
      },
    }),
    provideConfig(<I18nConfig>{
      i18n: {
        resources: { en: translationsEn, de: translationsDe },
        chunks: translationChunksConfig,
        fallbackLang: 'en',
      },
    }),
    provideConfig(<FeaturesConfig>{
      features: {
        level: '221121.20',
      },
    }),
  ],
})
export class SpartacusConfigurationModule {}
