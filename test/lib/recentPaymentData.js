module.exports = {
  validPaidAndSent() {
    return JSON.parse(JSON.stringify(this.validBase()));
  },
  validAllPaid() {
    const json = JSON.parse(JSON.stringify(this.validBase()));
    json.recentPayments[0].status = 'PAID';
    return json;
  },
  validBase() {
    return {
      recentPayments: [
        {
          creditDate: '2019-04-11T12:49:37.815Z',
          paymentAmount: '203.57',
          status: 'SENT',
        }, {
          creditDate: '2019-03-11T12:49:37.815Z',
          paymentAmount: '203.57',
          status: 'PAID',
        },
      ],
    };
  },
};
