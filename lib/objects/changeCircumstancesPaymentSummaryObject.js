const i18n = require('i18next');
const dateHelper = require('../dateHelper');

i18n.init({ sendMissingTo: 'fallback' });

function firstOrLastPayment(firstPaymentPaid) {
  if (firstPaymentPaid) {
    return i18n.t('payment:payment_table.last_payment');
  }
  return i18n.t('payment:payment_table.first_payment');
}

module.exports = {
  formatter(details) {
    if (details === undefined || details === null) {
      return false;
    }
    return {
      paymentOne: {
        label: firstOrLastPayment(details.firstPaymentPaid),
        creditDate: dateHelper.longDate(details.firstLastCreditDate),
        amount: `£${details.firstLastAmount}`,
      },
      paymentTwo: {
        label: i18n.t('payment:payment_table.next_payment'),
        creditDate: dateHelper.longDate(details.nextCreditDate),
        amount: `£${details.nextAmount}`,
      },
    };
  },
};
