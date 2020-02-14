function formatAmount(amount) {
  if (amount !== undefined && amount !== null) {
    return parseFloat(amount);
  }
  return null;
}

module.exports = {
  putObject(inviteKey, details) {
    return {
      inviteKey,
      entitlementDate: details.entitlementDate,
      spAmount: formatAmount(details.newStatePensionAmount),
      protectedAmount: formatAmount(details.protectedPaymentAmount),
      extraSpAmount: 0,
      inheritedExtraSpAmount: 0,
    };
  },
};
