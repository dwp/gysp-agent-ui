module.exports = {
  formatter(details, frequency, nino) {
    const schedule = JSON.parse(JSON.stringify(details));
    delete schedule.bankDetails;
    schedule.paymentFrequency = frequency;
    schedule.nino = nino;
    return schedule;
  },
};
