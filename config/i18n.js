module.exports = {
  ns: {
    namespaces: [
      'app',
      'add',
      'robot',
      'contact-details',
      'claim-information',
      'find-claim',
      'find-someone',
      'remove-contact-details',
      'enter-amounts',
      'address',
      'payment',
      'account',
      'payment-frequency',
      'payment-detail',
      'personal',
      'date-of-death',
      'verify-date-of-death',
      'verified-date-of-death',
    ],
    defaultNs: 'app',
  },
  supportedLngs: ['en'],
  preload: ['en'],
  fallbackLng: 'en',
  useCookie: false,
  debug: false,
  currentLang: 'en',
  sendMissingTo: 'fallback',
  detectLngFromPath: 0,
  ignoreRoutes: ['public/'],
};
