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
        creditDate: dateHelper.longDate(details.firstCreditDate),
        amount: generalHelper.formatCurrency(details.firstAmount),
      };
    }

    if (details.nextAmount !== null) {
      object.paymentTwo = {
        creditDate: dateHelper.longDate(details.nextCreditDate),
        amount: generalHelper.formatCurrency(details.nextAmount),
      };
    }
    return object;
  },
};
