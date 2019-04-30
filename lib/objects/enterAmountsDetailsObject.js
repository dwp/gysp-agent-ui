const i18n = require('i18next');

i18n.init({ sendMissingTo: 'fallback' });

module.exports = {
  formatter(details, inviteKey) {
    return {
      inviteKey,
      ninoSuffix: details.suffix,
      protectedPaymentAmount: parseFloat(details.protectedPayment),
      statePensionAmount: parseFloat(details.nsp),
    };
  },
};
