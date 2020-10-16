const generalHelper = require('../../../lib/helpers/general');

module.exports = {
  formatter(apiResponse) {
    if (!apiResponse
      || typeof apiResponse.protectedPaymentAmount !== 'number'
      || typeof apiResponse.cpsStatePensionAmount !== 'number'
      || typeof apiResponse.totalAmount !== 'number'
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
