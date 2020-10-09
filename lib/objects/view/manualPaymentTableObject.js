const generalHelper = require('../../../lib/helpers/general');

module.exports = {
  formatter(apiResponse) {
    if (!apiResponse
      || !apiResponse.protectedPaymentAmount
      || !apiResponse.statePensionAmount
      || !apiResponse.totalAmount
    ) {
      return false;
    }

    return {
      protectedPaymentAmount: generalHelper.formatCurrency(apiResponse.protectedPaymentAmount),
      statePensionAmount: generalHelper.formatCurrency(apiResponse.statePensionAmount),
      totalAmount: generalHelper.formatCurrency(apiResponse.totalAmount),
    };
  },
};
