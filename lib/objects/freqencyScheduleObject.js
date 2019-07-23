module.exports = {
  formatter(details, frequency, nino) {
    const schedule = JSON.parse(JSON.stringify(details));
    delete schedule.bankDetails;
    schedule.paymentFrequency = frequency;
    schedule.nino = nino;
    schedule.eventCategory = 'PAYMENT';
    schedule.eventType = 'CHANGE';
    schedule.eventName = 'payment:timeline.payment_frequency.changed';
    return schedule;
  },
};
