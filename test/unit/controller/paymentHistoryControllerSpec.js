const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const httpStatus = require('http-status-codes');

chai.use(chaiAsPromised);

const nock = require('nock');

nock.disableNetConnect();

const controller = require('../../../app/routes/changes-enquiries/payment-history/functions');

let genericResponse;

const { assert } = chai;

const responseHelper = require('../../../test/lib/responseHelper');
const claimData = require('../../lib/claimData');

const paymentUri = '/api/payment';

const paymentDetail = {
  status: 'SENT',
  accountName: 'Mr R H Smith',
  accountNumber: '98765432',
  sortCode: '400500',
  referenceNumber: null,
};

const paymentDetailFormatted = {
  status: 'Sent',
  accountHolder: 'Mr R H Smith',
  accountNumber: '98765432',
  sortCode: '40 05 00',
};

const paymentDetailWithReferenceNumber = {
  status: 'SENT',
  accountName: 'Mr R H Smith',
  accountNumber: '98765432',
  sortCode: '400500',
  referenceNumber: '12345678',
};

const paymentDetailWithReferenceNumberFormatted = {
  status: 'Sent',
  accountHolder: 'Mr R H Smith',
  accountNumber: '98765432',
  sortCode: '40 05 00',
  rollNumber: '12345678',
};

let validRequest = { session: { awardDetails: claimData.validClaim() }, params: { id: 123 }, user: { cis: { surname: 'User', givenname: 'Test' } } };

describe('Payment history controller', () => {
  describe('getPaymentHistoryDetail function (GET /changes-and-enquiries/payment-history/detail)', () => {
    genericResponse = responseHelper.genericResponse();
    genericResponse.locals = responseHelper.localResponse(genericResponse);

    it('should return view when receive 500 response from API', async () => {
      nock('http://test-url/').get(`${paymentUri}/123`).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
      await controller.getPaymentHistoryDetail(validRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/error');
      assert.equal(genericResponse.data.status, '- There are no payment details.');
      assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on /api/payment/123');
    });

    it('should return view when receive 404 response from API', async () => {
      nock('http://test-url/').get(`${paymentUri}/123`).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
      await controller.getPaymentHistoryDetail(validRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/error');
      assert.equal(genericResponse.data.status, '- There are no payment details.');
      assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on /api/payment/123');
    });

    it('should return view without roll number when receive 200 response from API', async () => {
      nock('http://test-url/').get(`${paymentUri}/123`).reply(httpStatus.OK, paymentDetail);
      await controller.getPaymentHistoryDetail(validRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/payment-history/detail');
      assert.deepEqual(genericResponse.data.paymentDetail, paymentDetailFormatted);
    });

    it('should return view without roll number when data is already in the cache', async () => {
      await controller.getPaymentHistoryDetail(validRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/payment-history/detail');
      assert.deepEqual(genericResponse.data.paymentDetail, paymentDetailFormatted);
    });

    it('should return view with roll number when receive 200 response from API', async () => {
      nock('http://test-url/').get(`${paymentUri}/321`).reply(httpStatus.OK, paymentDetailWithReferenceNumber);
      validRequest = { session: { awardDetails: claimData.validClaim() }, params: { id: 321 }, user: { cis: { surname: 'User', givenname: 'Test' } } };
      await controller.getPaymentHistoryDetail(validRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/payment-history/detail');
      assert.deepEqual(genericResponse.data.paymentDetail, paymentDetailWithReferenceNumberFormatted);
    });

    it('should return view roll number when data is already in the cache', async () => {
      await controller.getPaymentHistoryDetail(validRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/payment-history/detail');
      assert.deepEqual(genericResponse.data.paymentDetail, paymentDetailWithReferenceNumberFormatted);
    });
  });
});
