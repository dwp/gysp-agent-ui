module.exports = {
  validSchedule(frequency) {
    return { ...this.validBase(frequency) };
  },
  validScheduleWithReferenceNumber() {
    return { ...this.validBase(), ...this.referenceNumber() };
  },
  referenceNumber() {
    return {
      referenceNumber: '1234',
    };
  },
  validBase(frequency) {
    let currentFrequency = frequency;
    if (frequency === undefined) {
      currentFrequency = 4;
    }
    return {
      accountName: 'Account name',
      accountNumber: '12345678',
      frequency: currentFrequency,
      frequencyPeriod: 'W',
      sortCode: '112233',
    };
  },
};
