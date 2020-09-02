const i18n = require('i18next');
const dateHelper = require('../dateHelper');
const generalHelper = require('../helpers/general');

module.exports = {
  formatter(details) {
    if (details === undefined || details === null) {
      return false;
    }

    const object = { };

    if (details.firstAmount !== null) {
      object.paymentOne = {
        label: i18n.t('payment:payment_table.first_payment'),
        creditDate: dateHelper.longDate(details.firstCreditDate),
        amount: generalHelper.formatCurrency(details.firstAmount),
      };
    }

    if (details.nextAmount !== null) {
      object.paymentTwo = {
        label: i18n.t('payment:payment_table.next_payment'),
        creditDate: dateHelper.longDate(details.nextCreditDate),
        amount: generalHelper.formatCurrency(details.nextAmount),
      };
    }
    return object;
  },
};
