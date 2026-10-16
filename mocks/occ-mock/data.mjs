// Seed data for the mock SAP Commerce backend. Names follow the electronics-spa
// sample store used in the training plan (base site, catalogs, CMS template and slots).

export const baseSites = [
  {
    uid: 'electronics-spa',
    name: 'Electronics Site',
    channel: 'B2C',
    defaultLanguage: { isocode: 'en' },
    defaultCurrency: { isocode: 'USD' },
    stores: [
      {
        name: 'electronics-spa',
        currencies: [
          { isocode: 'USD', name: 'US Dollar', symbol: '$' },
          { isocode: 'JPY', name: 'Japanese Yen', symbol: '¥' },
        ],
        languages: [
          { isocode: 'en', name: 'English' },
          { isocode: 'de', name: 'German' },
        ],
        defaultCurrency: { isocode: 'USD' },
        defaultLanguage: { isocode: 'en' },
      },
    ],
    urlPatterns: ['(?i)^https?://[^/]+(/[^?]*)?(\\?.*)?$'],
  },
];

export const customers = [
  { uid: 'customer@example.com', password: 'Test1234!', name: 'Test Customer', firstName: 'Test', lastName: 'Customer' },
];

// OAuth clients known to the mock authorization server.
export const clients = {
  mobile_android: { secret: 'secret', grants: ['password', 'refresh_token'] },
  mobile_android_public: { secret: null, grants: ['password', 'refresh_token', 'authorization_code'] },
  client_credentials_client: { secret: 'secret', grants: ['client_credentials'] },
};

const image = (code, w) => ({
  imageType: 'PRIMARY',
  format: w > 100 ? 'product' : 'thumbnail',
  url: `/medias/${code}-${w}.jpg`,
  altText: code,
});

const product = (code, name, price, extra = {}) => ({
  code,
  name,
  url: `/p/${code}`,
  summary: `${name} summary`,
  description: `${name} full description`,
  manufacturer: extra.manufacturer ?? 'Acme',
  price: { currencyIso: 'USD', value: price, formattedValue: `$${price.toFixed(2)}`, priceType: 'BUY' },
  stock: { stockLevelStatus: extra.stock === 0 ? 'outOfStock' : 'inStock', stockLevel: extra.stock ?? 25 },
  images: [image(code, 300), image(code, 96)],
  categories: [{ code: extra.category ?? 'cameras', name: extra.category ?? 'cameras' }],
  averageRating: extra.rating ?? 4.2,
  numberOfReviews: 12,
  classifications: [
    {
      code: 'specs',
      name: 'Technical details',
      features: [{ code: 'weight', name: 'Weight', featureValues: [{ value: extra.weight ?? '450 g' }] }],
    },
  ],
});

export const products = [
  product('300938', 'Photosmart E317 Digital Camera', 114.12, { manufacturer: 'HP', weight: '120 g' }),
  product('1934793', 'PowerShot A480', 264.69, { manufacturer: 'Canon', rating: 4.6 }),
  product('872912', 'EOS 450D Body', 549.0, { manufacturer: 'Canon', weight: '475 g' }),
  product('779841', 'Camcorder HDR-CX105E', 799.5, { manufacturer: 'Sony', category: 'camcorders', stock: 0 }),
];

// ---- Content catalog -------------------------------------------------------
// Components live in a registry (uid -> component). Pages reference them by uid,
// slot by slot. Slot positions and typeCodes follow the storefront's default
// layout (core-libs/storefront/recipes/config/layout-config.ts) and CMS mappings.

const media = (name, alt) => ({ code: name, mime: 'image/svg+xml', url: `/medias/${name}.svg`, altText: alt });
const responsiveMedia = (name, alt) =>
  Object.fromEntries(['widescreen', 'desktop', 'tablet', 'mobile'].map((f) => [f, { ...media(`${name}-${f}`, alt), format: f }]));
const link = (uid, linkName, url) => ({ uid, typeCode: 'CMSLinkComponent', name: linkName, linkName, url, container: 'false' });
const navNode = (uid, title, children) => ({
  uid,
  title,
  children: children.map(([childUid, childTitle, linkUids]) => ({
    uid: childUid,
    title: childTitle,
    entries: linkUids.map((itemId) => ({ itemId, itemSuperType: 'AbstractCMSComponent', itemType: 'CMSLinkComponent' })),
  })),
});

const componentList = [
  // header
  { uid: 'SiteLogoComponent', typeCode: 'SimpleBannerComponent', name: 'Site Logo', urlLink: '/', media: media('logo', 'Electronics') },
  {
    uid: 'SearchBox', typeCode: 'SearchBoxComponent', name: 'Search Box',
    displayProducts: 'true', displayProductImages: 'true', displaySuggestions: 'true',
    maxProducts: '5', maxSuggestions: '5', minCharactersBeforeRequest: '3', waitTimeBeforeRequest: '500',
  },
  { uid: 'MiniCart', typeCode: 'MiniCartComponent', name: 'Mini Cart' },
  { uid: 'LoginComponent', typeCode: 'LoginComponent', name: 'Login Component' },
  { uid: 'LanguageComponent', typeCode: 'CMSSiteContextComponent', name: 'Language', context: 'LANGUAGE' },
  { uid: 'CurrencyComponent', typeCode: 'CMSSiteContextComponent', name: 'Currency', context: 'CURRENCY' },
  {
    uid: 'ElectronicsCategoryNavComponent', typeCode: 'CategoryNavigationComponent', name: 'Category Navigation',
    wrapAfter: '10',
    navigationNode: navNode('ElectronicsCategoryNavNode', 'Categories', [
      ['CamerasNavNode', 'Cameras', ['CamerasCategoryLink']],
      ['CamcordersNavNode', 'Camcorders', ['CamcordersCategoryLink']],
    ]),
  },
  link('CamerasCategoryLink', 'Cameras', '/search/camera'),
  link('CamcordersCategoryLink', 'Camcorders', '/search/camcorder'),
  // footer
  {
    uid: 'FooterNavigationComponent', typeCode: 'FooterNavigationComponent', name: 'Footer Navigation',
    notice: 'Copyright © 2026 Training mock store. Not affiliated with SAP.',
    navigationNode: navNode('FooterNavNode', 'Footer', [['AboutNavNode', 'About', ['AboutLink', 'ContactLink']]]),
  },
  link('AboutLink', 'About this mock', '/'),
  link('ContactLink', 'Contact', '/'),
  // homepage content
  { uid: 'ElectronicsHompageSplashBannerComponent', typeCode: 'SimpleResponsiveBannerComponent', name: 'Welcome to Electronics', urlLink: '/product/300938', media: responsiveMedia('splash', 'Welcome to Electronics') },
  { uid: 'ElectronicsHomepageBannerComponent2A', typeCode: 'SimpleResponsiveBannerComponent', name: 'Cameras on sale', urlLink: '/search/camera', media: responsiveMedia('cameras', 'Cameras on sale') },
  { uid: 'ElectronicsHomepageBannerComponent2B', typeCode: 'SimpleResponsiveBannerComponent', name: 'Camcorders on sale', urlLink: '/search/camcorder', media: responsiveMedia('camcorders', 'Camcorders on sale') },
  { uid: 'ElectronicsHomepageProductCarousel', typeCode: 'ProductCarouselComponent', name: 'Best sellers', title: 'Best sellers', productCodes: '300938 1934793 872912 779841', popup: 'false' },
  // product details page (the product itself comes from the URL, not from the CMS)
  { uid: 'ProductImagesComponent', typeCode: 'ProductImagesComponent', name: 'Product Images' },
  { uid: 'ProductIntroComponent', typeCode: 'ProductIntroComponent', name: 'Product Intro' },
  { uid: 'ProductSummaryComponent', typeCode: 'ProductSummaryComponent', name: 'Product Summary' },
  { uid: 'AddToCart', typeCode: 'ProductAddToCartComponent', name: 'Add To Cart' },
  {
    uid: 'TabPanelContainer', typeCode: 'CMSTabParagraphContainer', name: 'Tab container',
    components: 'ProductDetailsTabComponent ProductSpecsTabComponent ProductReviewsTabComponent',
  },
  // CMSFlexComponent: the storefront maps it by "flexType" instead of typeCode
  { uid: 'ProductDetailsTabComponent', typeCode: 'CMSFlexComponent', flexType: 'ProductDetailsTabComponent', name: 'Product Details' },
  { uid: 'ProductSpecsTabComponent', typeCode: 'CMSFlexComponent', flexType: 'ProductSpecsTabComponent', name: 'Specs' },
  { uid: 'ProductReviewsTabComponent', typeCode: 'CMSFlexComponent', flexType: 'ProductReviewsTabComponent', name: 'Reviews' },
  // search results page
  { uid: 'ProductRefinementComponent', typeCode: 'ProductRefinementComponent', name: 'Refinements' },
  { uid: 'SearchResultsListComponent', typeCode: 'SearchResultsListComponent', name: 'Search Results' },
  // not-found page
  { uid: 'NotFoundParagraph', typeCode: 'CMSParagraphComponent', name: 'Not found', content: '<h2>Page not found</h2><p>This page does not exist in the mock content catalog.</p>' },
];

export const cmsComponents = Object.fromEntries(
  componentList.map((c) => [c.uid, { container: 'false', modifiedtime: '2026-10-01T00:00:00+0000', ...c }]),
);

// Template-level slots shared by every page (header and footer).
export const sharedSlots = {
  SiteLogo: ['SiteLogoComponent'],
  SearchBox: ['SearchBox'],
  MiniCart: ['MiniCart'],
  SiteLogin: ['LoginComponent'],
  SiteContext: ['LanguageComponent', 'CurrencyComponent'],
  NavigationBar: ['ElectronicsCategoryNavComponent'],
  Footer: ['FooterNavigationComponent'],
};

// Pages, by uid. "label" is what the storefront sends as pageLabelOrId.
export const cmsPages = {
  homepage: {
    uid: 'homepage', label: 'homepage', name: 'Homepage', title: 'Homepage',
    typeCode: 'ContentPage', template: 'LandingPage2Template',
    slots: {
      Section1: ['ElectronicsHompageSplashBannerComponent'],
      Section2A: ['ElectronicsHomepageBannerComponent2A'],
      Section2B: ['ElectronicsHomepageBannerComponent2B'],
      Section3: ['ElectronicsHomepageProductCarousel'],
    },
  },
  productDetails: {
    uid: 'productDetails', name: 'Product Details', title: 'Product Details',
    typeCode: 'ProductPage', template: 'ProductDetailsPageTemplate',
    slots: {
      Summary: ['ProductImagesComponent', 'ProductIntroComponent', 'ProductSummaryComponent', 'AddToCart'],
      Tabs: ['TabPanelContainer'],
    },
  },
  search: {
    uid: 'search', label: 'search', name: 'Search Results Page', title: 'Search Results',
    typeCode: 'ContentPage', template: 'SearchResultsListPageTemplate',
    slots: { ProductLeftRefinements: ['ProductRefinementComponent'], SearchResultsListSlot: ['SearchResultsListComponent'] },
  },
  notFound: {
    uid: 'notFound', label: '/not-found', name: 'Not Found Page', title: 'Not Found',
    typeCode: 'ContentPage', template: 'ErrorPageTemplate',
    slots: { MiddleContent: ['NotFoundParagraph'] },
  },
};
