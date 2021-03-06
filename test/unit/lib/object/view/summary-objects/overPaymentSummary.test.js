const { assert } = require('chai');
const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../../../../config/i18next');

const overpaymentSummary = require('../../../../../../lib/objects/view/summary-objects/overpaymentSummary');

const awardObjectBase = (amount) => ({
  awardAmounts: [{
    totalAmount: 110.0,
    fromDate: 1551830400000, // 06/03/2019
    toDate: 1561830400000, // 29/06/2019
    inPayment: false,
  }, {
    totalAmount: 120.0,
    fromDate: 1579272908000, // 17/01/2021
    toDate: 1581951308000, // 17/02/2021
    inPayment: true,
  }],
  deathDetail: {
    amountDetails: {
      startDate: 1547251200000,
      endDate: 1549843200000,
      amount,
    },
  },
});


// Formatted object
const summaryObject = {
  header: 'Overpayment details',
  classes: null,
  rows: [{
    key: { text: 'Period' },
    value: { text: '12 Jan 2019 to 11 Feb 2019' },
  }, {
    key: { text: 'Weekly amount' },
    value: { text: '£120.00' },
  }, {
    key: { text: 'Total overpayment' },
    value: { text: '£16.45' },
  }],
};

describe('overpaymentSummary ', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

  it('should return formatted summary object with positive number', () => {
    const summary = overpaymentSummary(awardObjectBase(16.45));
    assert.deepEqual(summary, summaryObject);
  });

  it('should return formatted summary object with negative number', () => {
    const summary = overpaymentSummary(awardObjectBase(-16.45));
    assert.deepEqual(summary, summaryObject);
  });
});
