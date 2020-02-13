module.exports = {
  formatter(frequency, nino) {
    return {
      paymentFrequency: frequency,
      nino,
      eventCategory: 'PAYMENT',
      eventType: 'CHANGE',
      eventName: 'payment:timeline.payment_frequency.changed',
    };
  },
};
