module.exports = {
  ns: {
    namespaces: [
      'app',
      'add',
      'award-detail',
      'award-list',
      'robot',
      'contact-details-overview',
      'contact-details',
      'claim-information',
      'death-check-details',
      'death-check-payee-details',
      'death-check-payee-dap',
      'death-dap',
      'death-payment',
      'death-pay-arrears',
      'death-process-arrears',
      'death-record',
      'find-claim',
      'find-someone',
      'marital-detail',
      'marital-details',
      'marital-date',
      'marital-partner',
      'marital-status',
      'remove-contact-details',
      'enter-amounts',
      'address',
      'payment',
      'payee-account',
      'account',
      'payment-frequency',
      'payment-detail',
      'payment-status',
      'personal',
      'date-of-death',
      'reissue-payment',
      'review-award-date',
      'tasks',
      'task-complete',
      'task-detail',
      'task',
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
