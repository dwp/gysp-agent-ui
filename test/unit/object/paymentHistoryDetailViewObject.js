const assert = require('assert');
const moment = require('moment');

const object = require('../../../lib/objects/paymentHistoryDetailViewObject');

const creditDate5DaysAgo = moment().subtract(5, 'd');
const creditDate15DaysAgo = moment().subtract(15, 'd');

const id = 1;

const paymentDetailBase = {
  accountName: 'Mr R H Smith',
  accountNumber: '98765432',
  sortCode: '400500',
  referenceNumber: null,
  totalAmount: 100,
  startDate: '2019-07-30T00:00:00.000+0000',
  endDate: '2019-08-27T00:00:00.000+0000',
};

const paidStatusBefore14Days = Object.assign(JSON.parse(JSON.stringify(paymentDetailBase)), { status: 'PAID', creditDate: creditDate5DaysAgo });
const paidStatusAfter14Days = Object.assign(JSON.parse(JSON.stringify(paymentDetailBase)), { status: 'PAID', creditDate: creditDate15DaysAgo });
const sentStatus = Object.assign(JSON.parse(JSON.stringify(paymentDetailBase)), { status: 'SENT', creditDate: creditDate15DaysAgo });
const recallingStatus = Object.assign(JSON.parse(JSON.stringify(paymentDetailBase)), { status: 'RECALLING', creditDate: creditDate15DaysAgo });

const formattedBase = {
  accountHolder: 'Mr R H Smith',
  accountNumber: '98765432',
  detailsSummaryRows: [{
    key: { classes: 'govuk-!-width-one-third', text: 'payment-detail:summary-keys.total' },
    value: { classes: 'govuk-!-font-weight-bold', text: '£100.00' },
  }, {
    key: { classes: 'govuk-!-width-one-third govuk-!-font-weight-regular', text: 'payment-detail:summary-keys.period' },
    value: { html: '30/07/2019 to<br />27/08/2019' },
  }, {
    key: { classes: 'govuk-!-width-one-third govuk-!-font-weight-regular', text: 'payment-detail:summary-keys.status' },
    value: { text: 'Paid' },
  }],
  id: 1,
  sortCode: '40 05 00',
};

const paidStatusBefore14DaysFormatted = Object.assign(JSON.parse(JSON.stringify(formattedBase)), { status: 'Paid' });
paidStatusBefore14DaysFormatted.detailsSummaryRows[2].actions = {
  items: [{
    href: '/changes-and-enquiries/payment-history/1/status-update',
    text: 'payment-detail:summary-keys.statusLink.returned.text',
  }],
};

const paidStatusAfter14DaysFormatted = Object.assign(JSON.parse(JSON.stringify(formattedBase)), { status: 'Paid' });

const sentStatusFormatted = Object.assign(JSON.parse(JSON.stringify(formattedBase)), { status: 'Sent' });
sentStatusFormatted.detailsSummaryRows[2].value.text = 'Sent';
sentStatusFormatted.detailsSummaryRows[2].actions = {
  items: [{
    href: '/changes-and-enquiries/payment-history/1/status-update',
    text: 'payment-detail:summary-keys.statusLink.recall.text',
  }],
};

const recallingStatusFormatted = Object.assign(JSON.parse(JSON.stringify(formattedBase)), { status: 'Recalling' });
recallingStatusFormatted.detailsSummaryRows[2].value.text = 'Recalling';
recallingStatusFormatted.detailsSummaryRows[2].actions = {
  items: [{
    href: '/changes-and-enquiries/payment-history/1/status-update',
    text: 'payment-detail:summary-keys.statusLink.recalling.text',
  }],
};

describe('frequency schedule object formatter', () => {
  it('should return valid json when object is called with PAID status and link before 14 days after credit day', (done) => {
    const json = object.formatter(paidStatusBefore14Days, id);
    assert.deepEqual(json, paidStatusBefore14DaysFormatted);
    done();
  });
  it('should return valid json when object is called with PAID status and link after 14 days after credit day', (done) => {
    const json = object.formatter(paidStatusAfter14Days, id);
    assert.deepEqual(json, paidStatusAfter14DaysFormatted);
    done();
  });
  it('should return valid json when object is called with SENT status', (done) => {
    const json = object.formatter(sentStatus, id);
    assert.deepEqual(json, sentStatusFormatted);
    done();
  });
  it('should return valid json when object is called with RECALLING status', (done) => {
    const json = object.formatter(recallingStatus, id);
    assert.deepEqual(json, recallingStatusFormatted);
    done();
  });
});
