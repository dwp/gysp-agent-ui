const { assert } = require('chai');
const nock = require('nock');

nock.disableNetConnect();

const changeCircumstancesPaymentController = require('../../../app/routes/changes-enquiries/payment/functions');

const responseHelper = require('../../lib/responseHelper');
const claimData = require('../../lib/claimData');
const paymentSummaryData = require('../../lib/paymentSummaryData');

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

let testPromise;
let genericResponse = {};
const emptyRequest = { session: {}, body: {} };
const paymentRequest = { session: { searchedNino: 'AA370773A', awardDetails: claimData.validClaim() }, body: {} };

const changeCircumstancesPaymentDetailsUri = '/api/award';
const paymentSummaryUri = '/api/payment/paymentsummary';

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

    it('should return view name and view data when nino exists in session and exists on API first payment paid', () => {
      nock('http://test-url/').get(`${changeCircumstancesPaymentDetailsUri}/${paymentRequest.session.searchedNino}`).reply(200, claimData.validClaim());
      nock('http://test-url/').get(`${paymentSummaryUri}/${paymentRequest.session.searchedNino}`).reply(200, paymentSummaryData.validFirstPaymentPaid());
      changeCircumstancesPaymentController.getPaymentOverview(paymentRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/payment/index');
        assert.equal(JSON.stringify(genericResponse.data.details), JSON.stringify(paymentViewDataWithReference));
        assert.equal(JSON.stringify(genericResponse.data.paymentSummary), JSON.stringify(paymentSummaryViewDataFirstPaymentPaid));
      });
    });

    it('should return view name and view data when nino exists in session and exists on API first payment not paid', () => {
      nock('http://test-url/').get(`${changeCircumstancesPaymentDetailsUri}/${paymentRequest.session.searchedNino}`).reply(200, claimData.validClaim());
      nock('http://test-url/').get(`${paymentSummaryUri}/${paymentRequest.session.searchedNino}`).reply(200, paymentSummaryData.validFirstPaymentNotPaid());
      changeCircumstancesPaymentController.getPaymentOverview(paymentRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/payment/index');
        assert.equal(JSON.stringify(genericResponse.data.details), JSON.stringify(paymentViewDataWithReference));
        assert.equal(JSON.stringify(genericResponse.data.paymentSummary), JSON.stringify(paymentSummaryViewDataFirstPaymentNotPaid));
      });
    });

    it('should return error view name when both API\'s returns a 404 response', () => {
      nock('http://test-url/').get(`${changeCircumstancesPaymentDetailsUri}/${paymentRequest.session.searchedNino}`).reply(404, {});
      nock('http://test-url/').get(`${paymentSummaryUri}/${paymentRequest.session.searchedNino}`).reply(404, {});
      changeCircumstancesPaymentController.getPaymentOverview(paymentRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/error');
      });
    });

    it('should return error view name when both payment details API returns 200 response but payment summary returns a 404 response', () => {
      nock('http://test-url/').get(`${changeCircumstancesPaymentDetailsUri}/${paymentRequest.session.searchedNino}`).reply(200, claimData.validClaim());
      nock('http://test-url/').get(`${paymentSummaryUri}/${paymentRequest.session.searchedNino}`).reply(404, {});
      changeCircumstancesPaymentController.getPaymentOverview(paymentRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/error');
      });
    });

    it('should return error view name when both payment details API returns 404 response but payment summary returns a 200 response', () => {
      nock('http://test-url/').get(`${changeCircumstancesPaymentDetailsUri}/${paymentRequest.session.searchedNino}`).reply(404, {});
      nock('http://test-url/').get(`${paymentSummaryUri}/${paymentRequest.session.searchedNino}`).reply(200, paymentSummaryData.validFirstPaymentPaid());
      changeCircumstancesPaymentController.getPaymentOverview(paymentRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/error');
      });
    });
  });
});
