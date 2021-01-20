const { assert } = require('chai');
const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../../../../config/i18next');

const overpaymentTotalSummary = require('../../../../../../lib/objects/view/summary-objects/overpaymentTotalSummary');

const awardObjectBase = (amount) => ({
  awardAmounts: [{
    totalAmount: 110.0,
    fromDate: 1551830400000,
    toDate: 1561830400000,
  }],
  deathDetail: {
    amountDetails: {
      startDate: 1547251200000,
      endDate: 1549843200000,
      amount,
    },
    awardAmountPeriods: [{
      startDate: 1547251200000,
      endDate: 1549843200000,
      totalAmount: 125.01,
    }, {
      startDate: 1578700800000,
      endDate: 1581379200000,
      totalAmount: 111.78,
    }],
  },
});


// Formatted object
const summaryObject = {
  classes: null,
  rows: [{
    key: { text: 'Total overpayment' },
    value: { text: '£16.45' },
  }],
};

describe('overpaymentTotalSummary ', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

  it('should return formatted summary object with positive number', () => {
    const summary = overpaymentTotalSummary(awardObjectBase(16.45));
    assert.deepEqual(summary, summaryObject);
  });

  it('should return formatted summary object with negative number', () => {
    const summary = overpaymentTotalSummary(awardObjectBase(-16.45));
    assert.deepEqual(summary, summaryObject);
  });
});
