const assert = require('assert');
const moment = require('moment');

const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../config/i18next');

const object = require('../../../lib/objects/paymentHistoryDetailViewObject');

const creditDate5DaysAgo = `${moment().subtract(5, 'd').format('YYYY-MM-DD')}T00:00:00.000+0000`;
const creditDate15DaysAgo = `${moment().subtract(15, 'd').format('YYYY-MM-DD')}T00:00:00.000+0000`;

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
const returnedStatus = Object.assign(JSON.parse(JSON.stringify(paymentDetailBase)), { status: 'RETURNED', creditDate: creditDate15DaysAgo });
const recalledStatus = Object.assign(JSON.parse(JSON.stringify(paymentDetailBase)), { status: 'RECALLED', creditDate: creditDate15DaysAgo });

const formattedBase = {
  accountHolder: 'Mr R H Smith',
  accountNumber: '98765432',
  detailsSummaryRows: [{
    key: { classes: 'govuk-!-width-one-third', text: 'Total' },
    value: { classes: 'govuk-!-font-weight-bold', text: '£100.00' },
  }, {
    key: { classes: 'govuk-!-width-one-third govuk-!-font-weight-regular', text: 'Period' },
    value: { html: '30/07/2019 to<br />27/08/2019', classes: 'payment-detail__period' },
  }, {
    key: { classes: 'govuk-!-width-one-third govuk-!-font-weight-regular', text: 'Status' },
    value: { text: 'Paid' },
  }],
  id: 1,
  sortCode: '40 05 00',
};

const paidStatusBefore14DaysFormatted = Object.assign(JSON.parse(JSON.stringify(formattedBase)), { status: 'Paid' });
paidStatusBefore14DaysFormatted.detailsSummaryRows[2].actions = {
  items: [{
    href: '/changes-and-enquiries/payment-history/1/status-update',
    text: 'Mark as returned',
  }],
};

const paidStatusAfter14DaysFormatted = Object.assign(JSON.parse(JSON.stringify(formattedBase)), { status: 'Paid' });

const sentStatusFormatted = Object.assign(JSON.parse(JSON.stringify(formattedBase)), { status: 'Sent' });
sentStatusFormatted.detailsSummaryRows[2].value.text = 'Sent';
sentStatusFormatted.detailsSummaryRows[2].actions = {
  items: [{
    href: '/changes-and-enquiries/payment-history/1/status-update',
    text: 'Recall payment',
  }],
};

const recallingStatusFormatted = Object.assign(JSON.parse(JSON.stringify(formattedBase)), { status: 'Recalling' });
recallingStatusFormatted.detailsSummaryRows[2].value.text = 'Recalling';
recallingStatusFormatted.detailsSummaryRows[2].actions = {
  items: [{
    href: '/changes-and-enquiries/payment-history/1/status-update',
    text: 'Update',
  }],
};

const returnedStatusFormatted = Object.assign(JSON.parse(JSON.stringify(formattedBase)), { status: 'Returned' });
returnedStatusFormatted.detailsSummaryRows[2].value.text = 'Returned';
returnedStatusFormatted.detailsSummaryRows[2].actions = {
  items: [{
    href: '/changes-and-enquiries/payment-history/1/reissue',
    text: 'Reissue payment',
  }],
};

const recalledStatusFormatted = Object.assign(JSON.parse(JSON.stringify(formattedBase)), { status: 'Recalled' });
recalledStatusFormatted.detailsSummaryRows[2].value.text = 'Recalled';
recalledStatusFormatted.detailsSummaryRows[2].actions = {
  items: [{
    href: '/changes-and-enquiries/payment-history/1/reissue',
    text: 'Reissue payment',
  }],
};

const recalledStatusDeadFormatted = Object.assign(JSON.parse(JSON.stringify(formattedBase)), { status: 'Recalled' });
recalledStatusDeadFormatted.detailsSummaryRows[2].value.text = 'Recalled';

const returnedStatusDeadFormatted = Object.assign(JSON.parse(JSON.stringify(formattedBase)), { status: 'Returned' });
returnedStatusDeadFormatted.detailsSummaryRows[2].value.text = 'Returned';

describe('frequency schedule object formatter', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

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

  it('should return valid json when object is called with RETURNED status', (done) => {
    const json = object.formatter(returnedStatus, id);
    assert.deepEqual(json, returnedStatusFormatted);
    done();
  });

  it('should return valid json when object is called with RECALLED status and award status is DEAD', (done) => {
    const json = object.formatter(recalledStatus, id, 'DEAD');
    assert.deepEqual(json, recalledStatusDeadFormatted);
    done();
  });

  it('should return valid json when object is called with RECALLED status and award status is DEADNOTVERIFIED', (done) => {
    const json = object.formatter(recalledStatus, id, 'DEADNOTVERIFIED');
    assert.deepEqual(json, recalledStatusDeadFormatted);
    done();
  });

  it('should return valid json when object is called with RETURNED status and award status is DEAD', (done) => {
    const json = object.formatter(returnedStatus, id, 'DEAD');
    assert.deepEqual(json, returnedStatusDeadFormatted);
    done();
  });

  it('should return valid json when object is called with RETURNED status and award status is DEADNOTVERIFIED', (done) => {
    const json = object.formatter(returnedStatus, id, 'DEADNOTVERIFIED');
    assert.deepEqual(json, returnedStatusDeadFormatted);
    done();
  });
});
