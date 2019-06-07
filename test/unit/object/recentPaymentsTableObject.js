const assert = require('assert');

const recentPaymentsTableObject = require('../../../lib/objects/recentPaymentsTableObject');

const sentStatusHtml = '<span class="govuk-!-font-size-16 govuk-!-font-weight-bold gysp-secondary-text-colour gysp-status gysp-status--active">Sent</span>';
const paidStatusHtml = '<span class="govuk-!-font-size-16 govuk-!-font-weight-bold gysp-secondary-text-colour gysp-status gysp-status--active">Paid</span>';

const recentPayments = [
  { creditDate: '2019-01-01', paymentAmount: '200.20', status: 'SENT' },
  { creditDate: '2019-02-01', paymentAmount: '300.20', status: 'PAID' },
  { creditDate: '2019-03-01', paymentAmount: '400.20', status: 'PAID' },
];

const recentPaymentsResponseObject = {
  caption: 'Recent payments',
  rows: [
    [
      { text: '1 January 2019', classes: 'gysp-table__cell--first' },
      { text: '£200.20', classes: 'gysp-table__cell--first' },
      { html: sentStatusHtml, classes: 'gysp-table__cell--first' },
    ],
    [
      { text: '1 February 2019' },
      { text: '£300.20' },
      { html: paidStatusHtml },
    ],
    [
      { text: '1 March 2019' },
      { text: '£400.20' },
      { html: paidStatusHtml },
    ],
  ],
};

describe('recentPaymentsTable object', () => {
  describe('formatter', () => {
    it('should return formatted object for recent payment table', (done) => {
      const json = recentPaymentsTableObject.formatter(recentPayments);
      assert.equal(JSON.stringify(json), JSON.stringify(recentPaymentsResponseObject));
      done();
    });
  });
});
