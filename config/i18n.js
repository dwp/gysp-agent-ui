module.exports = {
  ns: {
    namespaces: [
      'app',
      'add',
      'award-detail',
      'robot',
      'contact-details',
      'claim-information',
      'death-dap',
      'death-payment',
      'find-claim',
      'find-someone',
      'remove-contact-details',
      'enter-amounts',
      'address',
      'payment',
      'account',
      'payment-frequency',
      'payment-detail',
      'payment-status',
      'personal',
      'date-of-death',
      'reissue-payment',
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
