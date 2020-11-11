const assert = require('assert');

const recentPaymentsTableObject = require('../../../../lib/objects/recentPaymentsTableObject');

const sentStatus = 'Sent';
const paidStatus = 'Paid';

const recentPayments = {
  recentPayments: [
    {
      id: 1, startDate: '2018-12-01', endDate: '2019-01-01', creditDate: '2019-01-01', paymentAmount: '200.20', status: 'SENT',
    },
    {
      id: 2, startDate: '2019-01-01', endDate: '2019-02-01', creditDate: '2019-02-01', paymentAmount: '300.20', status: 'PAID',
    },
    {
      id: 3, startDate: '2019-02-01', endDate: '2019-03-01', creditDate: '2019-03-01', paymentAmount: '400.20', status: 'PAID',
    },
  ],
};

const recentPaymentsResponseObject = {
  caption: 'Payment history',
  head: [
    { text: 'Payment date' },
    { text: 'Amount' },
    { text: 'Status' },
  ],
  rows: [
    [
      { text: 'Tuesday 1 Jan 2019' },
      { text: '£200.20' },
      { text: sentStatus },
      { html: '<a href="/changes-and-enquiries/payment-history/1" class="govuk-link">Details</a>' },
    ],
    [
      { text: 'Friday 1 Feb 2019' },
      { text: '£300.20' },
      { text: paidStatus },
      { html: '<a href="/changes-and-enquiries/payment-history/2" class="govuk-link">Details</a>' },
    ],
    [
      { text: 'Friday 1 Mar 2019' },
      { text: '£400.20' },
      { text: paidStatus },
      { html: '<a href="/changes-and-enquiries/payment-history/3" class="govuk-link">Details</a>' },
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
