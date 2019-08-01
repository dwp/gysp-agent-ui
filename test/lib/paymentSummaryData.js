module.exports = {
  validFirstPaymentPaid() {
    return JSON.parse(JSON.stringify(this.validBase()));
  },
  validFirstPaymentNotPaid() {
    const json = JSON.parse(JSON.stringify(this.validBase()));
    json.firstPaymentPaid = false;
    return json;
  },
  validFirstPaymentPaidWithoutNextAmount() {
    const json = JSON.parse(JSON.stringify(this.validBase()));
    json.nextAmount = null;
    json.nextCreditDate = null;
    return json;
  },
  validBase() {
    return {
      firstLastAmount: '203.57',
      firstLastCreditDate: '2019-04-11T12:49:37.815Z',
      firstPaymentPaid: true,
      nextAmount: '101.83',
      nextCreditDate: '2019-04-19T12:49:37.815Z',
    };
  },
};
