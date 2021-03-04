const { assert } = require('chai');
const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../../../../config/i18next');

const srbOverpaymentSummary = require('../../../../../../lib/objects/view/summary-objects/srbOverpaymentSummary');

const srbObject = {
  overpaymentPeriods: [{
    totalAmount: -108.34,
    fromDate: 1599350400000,
    toDate: 1601942400000,
    oldAmount: 173.9,
  }],
  totalOverpayment: -108.34,
};


// Formatted object
const summaryObject = {
  header: 'Overpayment details',
  classes: null,
  rows: [{
    key: { text: 'Period' },
    value: { text: '6 Sep 2020 to 6 Oct 2020' },
  }, {
    key: { text: 'Incorrect weekly amount' },
    value: { text: '£173.90' },
  }, {
    key: { text: 'Correct weekly amount' },
    value: { text: '£108.34' },
  }, {
    key: { text: 'Total overpayment' },
    value: { text: '£108.34' },
  }],
};

describe('srbOverpaymentSummary ', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

  it('should return formatted summary object', () => {
    const summary = srbOverpaymentSummary(srbObject);
    assert.deepEqual(summary, summaryObject);
  });
});
