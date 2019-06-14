const { assert } = require('chai');
const nock = require('nock');

nock.disableNetConnect();

const changeCircumstancesPaymentController = require('../../../app/routes/changes-enquiries/payment/functions');

const responseHelper = require('../../lib/responseHelper');
const claimData = require('../../lib/claimData');
const paymentSummaryData = require('../../lib/paymentSummaryData');
const recentPaymentData = require('../../lib/recentPaymentData');

const paymentViewDataWithReference = {
  accountHolder: 'Joe Bloggs',
  accountNumber: '12345678',
  sortCode: '11 22 33',
  referenceNumber: '231231232',
  frequency: '4',
  frequencyPeriod: 'weeks',
};

const paymentSummaryViewDataFirstPaymentPaid = {
  paymentOne: {
    label: 'payment:payment_table.last_payment',
    creditDate: '11 April 2019',
    amount: '£203.57',
  },
  paymentTwo: {
    label: 'payment:payment_table.next_payment',
    creditDate: '19 April 2019',
    amount: '£101.83',
  },
};

const paymentSummaryViewDataFirstPaymentNotPaid = {
  paymentOne: {
    label: 'payment:payment_table.first_payment',
    creditDate: '11 April 2019',
    amount: '£203.57',
  },
  paymentTwo: {
    label: 'payment:payment_table.next_payment',
    creditDate: '19 April 2019',
    amount: '£101.83',
  },
};

const recentPaymentTableViewDataSentAndPaid = {
  caption: 'Recent payments',
  rows: [
    [{ text: '11 April 2019', classes: 'gysp-table__cell--first' }, { text: '£203.57', classes: 'gysp-table__cell--first' }, { html: '<span class="govuk-!-font-size-16 govuk-!-font-weight-bold gysp-secondary-text-colour gysp-status gysp-status--active">Sent</span>', classes: 'gysp-table__cell--first' }],
    [{ text: '11 March 2019' }, { text: '£203.57' }, { html: '<span class="govuk-!-font-size-16 govuk-!-font-weight-bold gysp-secondary-text-colour gysp-status gysp-status--active">Paid</span>' }],
  ],
};

const recentPaymentTableViewDataAllPaid = {
  caption: 'Recent payments',
  rows: [
    [{ text: '11 April 2019', classes: 'gysp-table__cell--first' }, { text: '£203.57', classes: 'gysp-table__cell--first' }, { html: '<span class="govuk-!-font-size-16 govuk-!-font-weight-bold gysp-secondary-text-colour gysp-status gysp-status--active">Paid</span>', classes: 'gysp-table__cell--first' }],
    [{ text: '11 March 2019' }, { text: '£203.57' }, { html: '<span class="govuk-!-font-size-16 govuk-!-font-weight-bold gysp-secondary-text-colour gysp-status gysp-status--active">Paid</span>' }],
  ],
};

let testPromise;
let genericResponse = {};
const emptyRequest = { session: {}, body: {} };
const paymentRequest = { session: { searchedNino: 'AA370773A', awardDetails: claimData.validClaim() }, body: {} };

const changeCircumstancesPaymentDetailsUri = '/api/award';
const paymentSummaryUri = '/api/payment/paymentsummary';
const recentPaymentsUri = '/api/payment/recentpayments';

describe('Change circumstances payment controller ', () => {
  beforeEach(() => {
    genericResponse = responseHelper.genericResponse();
    genericResponse.locals = {
      traceID: '',
      logMessage: '',
      agentGateway: 'http://test-url/',
      logger: {
        error(traceID, errorTxt) {
          genericResponse.locals.traceID = traceID;
          genericResponse.locals.logMessage = errorTxt;
        },
      },
    };

    testPromise = new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 100);
    });
  });

  describe(' getPaymentOverview function (GET /changes-enquiries/payment)', () => {
    it('should display a somethings gone wrong page when search nino is not in request', (done) => {
      changeCircumstancesPaymentController.getPaymentOverview(emptyRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/error');
      done();
    });

    it('should return view name and view data when nino exists in session and exists on API first payment paid with recent payments sent and paid', () => {
      nock('http://test-url/').get(`${changeCircumstancesPaymentDetailsUri}/${paymentRequest.session.searchedNino}`).reply(200, claimData.validClaim());
      nock('http://test-url/').get(`${paymentSummaryUri}/${paymentRequest.session.searchedNino}`).reply(200, paymentSummaryData.validFirstPaymentPaid());
      nock('http://test-url/').get(`${recentPaymentsUri}/${paymentRequest.session.searchedNino}`).reply(200, recentPaymentData.validPaidAndSent());
      changeCircumstancesPaymentController.getPaymentOverview(paymentRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/payment/index');
        assert.equal(JSON.stringify(genericResponse.data.details), JSON.stringify(paymentViewDataWithReference));
        assert.equal(JSON.stringify(genericResponse.data.paymentSummary), JSON.stringify(paymentSummaryViewDataFirstPaymentPaid));
        assert.equal(JSON.stringify(genericResponse.data.recentPaymentsTable), JSON.stringify(recentPaymentTableViewDataSentAndPaid));
      });
    });

    it('should return view name and view data when nino exists in session and exists on API first payment not paid with recent payments all paid', () => {
      nock('http://test-url/').get(`${changeCircumstancesPaymentDetailsUri}/${paymentRequest.session.searchedNino}`).reply(200, claimData.validClaim());
      nock('http://test-url/').get(`${paymentSummaryUri}/${paymentRequest.session.searchedNino}`).reply(200, paymentSummaryData.validFirstPaymentNotPaid());
      nock('http://test-url/').get(`${recentPaymentsUri}/${paymentRequest.session.searchedNino}`).reply(200, recentPaymentData.validAllPaid());
      changeCircumstancesPaymentController.getPaymentOverview(paymentRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/payment/index');
        assert.equal(JSON.stringify(genericResponse.data.details), JSON.stringify(paymentViewDataWithReference));
        assert.equal(JSON.stringify(genericResponse.data.paymentSummary), JSON.stringify(paymentSummaryViewDataFirstPaymentNotPaid));
        assert.equal(JSON.stringify(genericResponse.data.recentPaymentsTable), JSON.stringify(recentPaymentTableViewDataAllPaid));
      });
    });

    it('should return error view name when all API\'s returns a 404 response', () => {
      nock('http://test-url/').get(`${changeCircumstancesPaymentDetailsUri}/${paymentRequest.session.searchedNino}`).reply(404, {});
      nock('http://test-url/').get(`${paymentSummaryUri}/${paymentRequest.session.searchedNino}`).reply(404, {});
      nock('http://test-url/').get(`${recentPaymentsUri}/${paymentRequest.session.searchedNino}`).reply(404, {});
      changeCircumstancesPaymentController.getPaymentOverview(paymentRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/error');
      });
    });

    it('should return error view name when payment details API returns 200 response but payment summary returns a 404 response', () => {
      nock('http://test-url/').get(`${changeCircumstancesPaymentDetailsUri}/${paymentRequest.session.searchedNino}`).reply(200, claimData.validClaim());
      nock('http://test-url/').get(`${paymentSummaryUri}/${paymentRequest.session.searchedNino}`).reply(404, {});
      nock('http://test-url/').get(`${recentPaymentsUri}/${paymentRequest.session.searchedNino}`).reply(200, recentPaymentData.validPaidAndSent());
      changeCircumstancesPaymentController.getPaymentOverview(paymentRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/error');
      });
    });

    it('should return error view name when payment details API returns 404 response but payment summary returns a 200 response', () => {
      nock('http://test-url/').get(`${changeCircumstancesPaymentDetailsUri}/${paymentRequest.session.searchedNino}`).reply(404, {});
      nock('http://test-url/').get(`${paymentSummaryUri}/${paymentRequest.session.searchedNino}`).reply(200, paymentSummaryData.validFirstPaymentPaid());
      nock('http://test-url/').get(`${recentPaymentsUri}/${paymentRequest.session.searchedNino}`).reply(200, recentPaymentData.validPaidAndSent());
      changeCircumstancesPaymentController.getPaymentOverview(paymentRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/error');
      });
    });

    it('should return not return error view name when all api\'s return 200 but recent payments returns a 404 response', () => {
      nock('http://test-url/').get(`${changeCircumstancesPaymentDetailsUri}/${paymentRequest.session.searchedNino}`).reply(200, claimData.validClaim());
      nock('http://test-url/').get(`${paymentSummaryUri}/${paymentRequest.session.searchedNino}`).reply(200, paymentSummaryData.validFirstPaymentPaid());
      nock('http://test-url/').get(`${recentPaymentsUri}/${paymentRequest.session.searchedNino}`).reply(404, {});
      changeCircumstancesPaymentController.getPaymentOverview(paymentRequest, genericResponse);
      return testPromise.then(() => {
        assert.notEqual(genericResponse.viewName, 'pages/error');
      });
    });

    it('should return error view name when all api\'s return 200 but recent payments returns a 500 response', () => {
      nock('http://test-url/').get(`${changeCircumstancesPaymentDetailsUri}/${paymentRequest.session.searchedNino}`).reply(200, claimData.validClaim());
      nock('http://test-url/').get(`${paymentSummaryUri}/${paymentRequest.session.searchedNino}`).reply(200, paymentSummaryData.validFirstPaymentPaid());
      nock('http://test-url/').get(`${recentPaymentsUri}/${paymentRequest.session.searchedNino}`).reply(500, {});
      changeCircumstancesPaymentController.getPaymentOverview(paymentRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/error');
      });
    });
  });
});
