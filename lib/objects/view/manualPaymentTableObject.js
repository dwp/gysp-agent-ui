const generalHelper = require('../../../lib/helpers/general');

module.exports = {
  formatter(apiResponse) {
    if (!apiResponse
      || !apiResponse.protectedPaymentAmount
      || !apiResponse.cpsStatePensionAmount
      || !apiResponse.totalAmount
    ) {
      return false;
    }

    return {
      protectedPaymentAmount: generalHelper.formatCurrency(apiResponse.protectedPaymentAmount),
      cpsStatePensionAmount: generalHelper.formatCurrency(apiResponse.cpsStatePensionAmount),
      totalAmount: generalHelper.formatCurrency(apiResponse.totalAmount),
    };
  },
};
