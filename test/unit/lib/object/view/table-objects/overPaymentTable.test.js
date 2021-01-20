const { assert } = require('chai');
const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../../../../config/i18next');

const overpaymentTable = require('../../../../../../lib/objects/view/table-objects/overpaymentTable');

const awardObject = {
  awardAmounts: [{
    totalAmount: 110.0,
    fromDate: 1551830400000,
    toDate: 1561830400000,
  }],
  deathDetail: {
    amountDetails: {
      startDate: 1547251200000,
      endDate: 1549843200000,
      amount: -16.45,
    },
    awardAmountPeriods: [{
      fromDate: 1547251200000,
      toDate: 1549843200000,
      totalAmount: 125.01,
    }, {
      fromDate: 1578700800000,
      toDate: 1581379200000,
      totalAmount: 111.78,
    }],
  },
};


// Formatted object
const tableObject = {
  header: 'Overpayment details',
  classes: null,
  head: [{ text: 'Period' }, { text: 'Weekly amount' }],
  rows: [
    [{ text: '12 Jan 2019 to 11 Feb 2019' }, { text: '£125.01' }],
    [{ text: '11 Jan 2020 to 11 Feb 2020' }, { text: '£111.78' }],
  ],
};

describe('overpaymentTable ', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

  it('should return formatted table object', () => {
    const summary = overpaymentTable(awardObject);
    assert.deepEqual(summary, tableObject);
  });
});
