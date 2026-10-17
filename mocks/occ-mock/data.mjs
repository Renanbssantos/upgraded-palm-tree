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

const banner = (uid, title) => ({
  uid,
  typeCode: 'SimpleResponsiveBannerComponent',
  name: title,
  container: 'false',
  urlLink: '/p/300938',
  media: { code: `${uid}-media`, mime: 'image/jpeg', url: `/medias/${uid}.jpg`, altText: title },
});

// Content catalog: the homepage is a template with slots, each slot holding components.
export const cmsPages = {
  homepage: {
    uid: 'homepage',
    name: 'Homepage',
    title: 'Homepage',
    template: 'LandingPage2Template',
    typeCode: 'ContentPage',
    contentSlots: {
      contentSlot: [
        slot('Section1', [banner('ElectronicsHompageSplashBannerComponent', 'Welcome to Electronics')]),
        slot('Section2A', [banner('ElectronicsHomepageBannerComponent2A', 'Cameras on sale')]),
        slot('Section2B', [banner('ElectronicsHomepageBannerComponent2B', 'Camcorders on sale')]),
        slot('Section3', [
          { uid: 'ElectronicsHomepageProductCarousel', typeCode: 'ProductCarouselComponent', name: 'Best sellers', productCodes: '300938 1934793' },
        ]),
      ],
    },
  },
};

function slot(position, components) {
  return { slotId: `${position}Slot`, position, name: `${position} slot`, slotShared: false, components: { component: components } };
}
