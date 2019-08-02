const assert = require('assert');

const recentPaymentsTableObject = require('../../../lib/objects/recentPaymentsTableObject');

const sentStatus = 'Sent';
const paidStatus = 'Paid';

const recentPayments = {
  recentPayments: [
    {
      startDate: '2018-12-01', endDate: '2019-01-01', creditDate: '2019-01-01', paymentAmount: '200.20', status: 'SENT',
    },
    {
      startDate: '2019-01-01', endDate: '2019-02-01', creditDate: '2019-02-01', paymentAmount: '300.20', status: 'PAID',
    },
    {
      startDate: '2019-02-01', endDate: '2019-03-01', creditDate: '2019-03-01', paymentAmount: '400.20', status: 'PAID',
    },
  ],
};

const recentPaymentsResponseObject = {
  caption: 'Payment history',
  head: [
    { text: 'From' },
    { text: 'To' },
    { text: 'Payment date' },
    { text: 'Amount' },
    { text: 'Status' },
  ],
  rows: [
    [
      { text: '01/12/2018', classes: 'gysp-table__cell--first' },
      { text: '01/01/2019', classes: 'gysp-table__cell--first' },
      { text: '01/01/2019', classes: 'gysp-table__cell--first' },
      { text: '£200.20', classes: 'gysp-table__cell--first' },
      { text: sentStatus, classes: 'gysp-table__cell--first' },
    ],
    [
      { text: '01/01/2019' },
      { text: '01/02/2019' },
      { text: '01/02/2019' },
      { text: '£300.20' },
      { text: paidStatus },
    ],
    [
      { text: '01/02/2019' },
      { text: '01/03/2019' },
      { text: '01/03/2019' },
      { text: '£400.20' },
      { text: paidStatus },
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
