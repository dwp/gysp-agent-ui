module.exports = {
  formatter(details, frequency, nino) {
    const schedule = JSON.parse(JSON.stringify(details));
    schedule.paymentFrequency = frequency;
    schedule.nino = nino;
    return schedule;
  },
};
