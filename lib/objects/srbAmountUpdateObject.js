const dateHelper = require('../dateHelper');

function formatAmount(amount) {
  if (amount !== undefined && amount !== null) {
    return parseFloat(amount);
  }
  return null;
}

function formatEntitlementDate(entitlementDate, awardDate) {
  if (awardDate !== undefined) {
    return dateHelper.dateComponentsToUtcDate(awardDate.dateYear, awardDate.dateMonth, awardDate.dateDay);
  }
  return entitlementDate;
}

module.exports = {
  putObject(inviteKey, details, awardDate) {
    return {
      inviteKey,
      entitlementDate: formatEntitlementDate(details.entitlementDate, awardDate),
      spAmount: formatAmount(details.newStatePensionAmount),
      protectedAmount: formatAmount(details.protectedPaymentAmount),
      extraSpAmount: 0,
      inheritedExtraSpAmount: 0,
    };
  },
};
