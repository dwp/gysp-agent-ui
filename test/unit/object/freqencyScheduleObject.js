const { assert } = require('chai');

const object = require('../../../lib/objects/paymentHistoryDetailViewObject');

const id = 123;

const detail = {
  status: 'SENT',
  accountName: 'Mr R H Smith',
  accountNumber: '98765432',
  sortCode: '400500',
  totalAmount: 100,
  startDate: '2019-07-30T00:00:00.000+0000',
  endDate: '2019-08-27T00:00:00.000+0000',
  creditDate: '2019-08-27T06:00:00',
};

const detailFormatted = {
  status: 'Sent',
  accountHolder: 'Mr R H Smith',
  accountNumber: '98765432',
  sortCode: '40 05 00',
  detailsSummaryRows: [
    {
      key: { classes: 'govuk-!-width-one-third', text: 'payment-detail:summary-keys.total' },
      value: { classes: 'govuk-!-font-weight-bold', text: '£100.00' },
    },
    {
      key: { classes: 'govuk-!-width-one-third', text: 'payment-detail:summary-keys.period' },
      value: { html: '30/07/2019 to<br />27/08/2019' },
    },
    {
      key: { classes: 'govuk-!-width-one-third', text: 'payment-detail:summary-keys.status' },
      value: { text: 'Sent' },
    },
  ],
  id: 123,
};

describe('payment history detail object formatter', () => {
  it('should return false when detail is undefined', () => {
    assert.isFalse(object.formatter(undefined));
  });
  it('should return valid json when object is called with unformatted object', () => {
    assert.deepEqual(object.formatter(detail, id), detailFormatted);
  });
});
