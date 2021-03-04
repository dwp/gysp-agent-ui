const { assert } = require('chai');
const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../../../../config/i18next');

const srbOverpaymentTable = require('../../../../../../lib/objects/view/table-objects/srbOverpaymentTable');

const awardObject = {
  overpaymentPeriods: [{
    totalAmount: -108.34,
    fromDate: 1599350400000,
    toDate: 1601942400000,
    oldAmount: 173.9,
  }, {
    totalAmount: -50.34,
    fromDate: 1609778225000,
    toDate: 1612456625000,
    oldAmount: 43.9,
  }],
  totalOverpayment: -108.34,
};


// Formatted object
const tableObject = {
  header: 'Overpayment details',
  head: [{
    text: 'Period',
    classes: 'govuk-!-width-one-half',
  }, {
    text: 'Incorrect weekly amount',
    classes: 'govuk-!-width-one-quarter',
  }, {
    text: 'Correct weekly amount',
    classes: 'govuk-!-width-one-quarter',
  }],
  rows: [
    [{ text: '6 Sep 2020 to 6 Oct 2020' }, { text: '£173.90' }, { text: '£108.34' }],
    [{ text: '4 Jan 2021 to 4 Feb 2021' }, { text: '£43.90' }, { text: '£50.34' }],
  ],
};

describe('overpaymentTable ', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

  it('should return formatted table object', () => {
    const summary = srbOverpaymentTable(awardObject);
    assert.deepEqual(summary, tableObject);
  });
});
