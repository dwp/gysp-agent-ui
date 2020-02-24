module.exports = {
  validFirstPaymentNotSent() {
    return JSON.parse(JSON.stringify(this.validBase()));
  },
  validFirstPaymentSent() {
    const json = JSON.parse(JSON.stringify(this.validBase()));
    json.firstAmount = null;
    json.firstCreditDate = null;
    return json;
  },
  validFirstAndNextPaymentNull() {
    return {
      firstAmount: null,
      firstCreditDate: null,
      nextAmount: null,
      nextCreditDate: null,
    };
  },
  validBase() {
    return {
      firstAmount: '203.57',
      firstCreditDate: '2019-04-11T12:49:37.815Z',
      nextAmount: '101.83',
      nextCreditDate: '2019-04-19T12:49:37.815Z',
    };
  },
};
