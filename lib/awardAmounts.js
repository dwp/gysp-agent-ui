const generalHelper = require('./helpers/general');

module.exports = {
  formatter(details) {
    const amounts = details.currentAmounts;
    return {
      totalAmount: generalHelper.floatDecimal(amounts.totalAmount),
      weeklyStatePensionAmount: generalHelper.floatDecimal(amounts.weeklyStatePensionAmount),
      weeklyProtectedPaymentAmount: generalHelper.floatDecimal(amounts.weeklyProtectedPaymentAmount),
      weeklyExtraStatePensionAmount: generalHelper.floatDecimal(amounts.weeklyExtraStatePensionAmount),
      weeklyInheritedExtraStatePensionAmount: generalHelper.floatDecimal(amounts.weeklyInheritedExtraStatePensionAmount),
    };
  },
};
