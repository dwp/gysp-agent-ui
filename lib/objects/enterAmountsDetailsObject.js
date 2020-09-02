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
