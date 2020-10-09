module.exports = {
  formatter(apiResponse) {
    const { cpsStatePensionAmount, ...manualPaymentObjectProperties } = { ...apiResponse };

    const json = {
      ...manualPaymentObjectProperties,
      eventCategory: 'PAYMENT',
      eventName: 'payment:timeline.manual_payment.added',
      eventType: 'ADD',
    };

    return json;
  },
};
