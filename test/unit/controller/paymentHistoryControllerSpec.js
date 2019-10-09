const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const httpStatus = require('http-status-codes');
const moment = require('moment');

const creditDate5DaysAgo = moment().subtract(5, 'd');
const creditDate15DaysAgo = moment().subtract(15, 'd');

chai.use(chaiAsPromised);

const nock = require('nock');

nock.disableNetConnect();

const controller = require('../../../app/routes/changes-enquiries/payment-history/functions');

let genericResponse;

const { assert } = chai;

const responseHelper = require('../../../test/lib/responseHelper');
const claimData = require('../../lib/claimData');

const paymentUri = '/api/payment';
const updateStatusUri = '/api/payment/update-status';

const flash = {
  type: '',
  message: '',
};
const flashMock = (type, message) => {
  flash.type = type;
  flash.message = message;
};

const paymentDetail = {
  status: 'SENT',
  accountName: 'Mr R H Smith',
  accountNumber: '98765432',
  sortCode: '400500',
  referenceNumber: null,
  totalAmount: 100,
  startDate: '2019-07-30T00:00:00.000+0000',
  endDate: '2019-08-27T00:00:00.000+0000',
  creditDate: creditDate5DaysAgo,
};

const paymentDetailFormatted = {
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
      key: { classes: 'govuk-!-width-one-third govuk-!-font-weight-regular', text: 'payment-detail:summary-keys.period' },
      value: { html: '30/07/2019 to<br />27/08/2019' },
    },
    {
      key: { classes: 'govuk-!-width-one-third govuk-!-font-weight-regular', text: 'payment-detail:summary-keys.status' },
      value: { text: 'Sent' },
    },
  ],
  id: 123,
};

const paymentDetailWithReferenceNumber = {
  status: 'SENT',
  accountName: 'Mr R H Smith',
  accountNumber: '98765432',
  sortCode: '400500',
  referenceNumber: '12345678',
  totalAmount: 100,
  startDate: '2019-07-30T23:00:00.000+0000',
  endDate: '2019-08-27T23:00:00.000+0000',
  creditDate: '2019-08-27T06:00:00',
};

const paymentDetailWithReferenceNumberFormatted = {
  status: 'Sent',
  accountHolder: 'Mr R H Smith',
  accountNumber: '98765432',
  detailsSummaryRows: [
    {
      key: { classes: 'govuk-!-width-one-third', text: 'payment-detail:summary-keys.total' },
      value: { classes: 'govuk-!-font-weight-bold', text: '£100.00' },
    },
    {
      key: { classes: 'govuk-!-width-one-third govuk-!-font-weight-regular', text: 'payment-detail:summary-keys.period' },
      value: { html: '31/07/2019 to<br />28/08/2019' },
    },
    {
      key: { classes: 'govuk-!-width-one-third govuk-!-font-weight-regular', text: 'payment-detail:summary-keys.status' },
      value: { text: 'Sent' },
    },
  ],
  id: 321,
  sortCode: '40 05 00',
  rollNumber: '12345678',
};

const paymentDetailPaid = {
  status: 'PAID',
  accountName: 'Mr R H Smith',
  accountNumber: '98765432',
  sortCode: '400500',
  referenceNumber: null,
  totalAmount: 100,
  startDate: '2019-07-30T23:00:00.000+0000',
  endDate: '2019-08-27T23:00:00.000+0000',
  creditDate: creditDate5DaysAgo,
};

const paymentDetailPaidFormattedAfter14Days = {
  status: 'Paid',
  accountHolder: 'Mr R H Smith',
  accountNumber: '98765432',
  detailsSummaryRows: [
    {
      key: { classes: 'govuk-!-width-one-third', text: 'payment-detail:summary-keys.total' },
      value: { classes: 'govuk-!-font-weight-bold', text: '£100.00' },
    },
    {
      key: { classes: 'govuk-!-width-one-third govuk-!-font-weight-regular', text: 'payment-detail:summary-keys.period' },
      value: { html: '31/07/2019 to<br />28/08/2019' },
    },
    {
      key: { classes: 'govuk-!-width-one-third govuk-!-font-weight-regular', text: 'payment-detail:summary-keys.status' },
      value: { text: 'Paid' },
    },
  ],
  id: 12345,
  sortCode: '40 05 00',
};

const paymentDetailPaidFormatted = {
  id: 123,
  changeType: 'returned',
};

const baseRequest = {
  session: { awardDetails: claimData.validClaim() }, params: { id: 123 }, user: { cis: { surname: 'User', givenname: 'Test' } }, body: {},
};

let validRequest = { session: { awardDetails: claimData.validClaim() }, params: { id: 123 }, user: { cis: { surname: 'User', givenname: 'Test' } } };
let validPaymentStatusRequest = { session: { awardDetails: claimData.validClaim() }, params: { id: 123 }, user: { cis: { surname: 'User', givenname: 'Test' } } };
const validPaymentStatusRequest2 = { session: { awardDetails: claimData.validClaim() }, params: { id: 123 }, user: { cis: { surname: 'User', givenname: 'Test' } } };

const emptyPostRequest = Object.assign(JSON.parse(JSON.stringify(baseRequest)), { body: {} });
const blankPostRequest = Object.assign(JSON.parse(JSON.stringify(baseRequest)), { body: { statusUpdate: '' } });
const noPostRequest = Object.assign(JSON.parse(JSON.stringify(baseRequest)), { body: { statusUpdate: 'no' } });
const yesPostRequest = Object.assign(JSON.parse(JSON.stringify(baseRequest)), { body: { statusUpdate: 'yes' } });

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
      nock('http://test-url/').get(`${paymentUri}/123`).reply(httpStatus.NOT_FOUND, {});
      await controller.getPaymentHistoryDetail(validRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/error');
      assert.equal(genericResponse.data.status, '- There are no payment details.');
      assert.equal(genericResponse.locals.logMessage, '404 - 404 - {} - Requested on /api/payment/123');
    });

    it('should return view without roll number when receive 200 response from API', async () => {
      nock('http://test-url/').get(`${paymentUri}/123`).reply(httpStatus.OK, paymentDetail);
      await controller.getPaymentHistoryDetail(validRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/payment-history/detail');
      assert.deepEqual(genericResponse.data.paymentHistoryDetail, paymentDetailFormatted);
    });

    it('should return view without roll number when data is already in the cache', async () => {
      await controller.getPaymentHistoryDetail(validRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/payment-history/detail');
      assert.deepEqual(genericResponse.data.paymentHistoryDetail, paymentDetailFormatted);
    });

    it('should return view with roll number when receive 200 response from API', async () => {
      nock('http://test-url/').get(`${paymentUri}/321`).reply(httpStatus.OK, paymentDetailWithReferenceNumber);
      validRequest = { session: { awardDetails: claimData.validClaim() }, params: { id: 321 }, user: { cis: { surname: 'User', givenname: 'Test' } } };
      await controller.getPaymentHistoryDetail(validRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/payment-history/detail');
      assert.deepEqual(genericResponse.data.paymentHistoryDetail, paymentDetailWithReferenceNumberFormatted);
    });

    it('should return view roll number when data is already in the cache', async () => {
      await controller.getPaymentHistoryDetail(validRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/payment-history/detail');
      assert.deepEqual(genericResponse.data.paymentHistoryDetail, paymentDetailWithReferenceNumberFormatted);
    });

    it('should return view with no link to change payment staus when status is not paid', async () => {
      nock('http://test-url/').get(`${paymentUri}/1234`).reply(httpStatus.OK, paymentDetailWithReferenceNumber);
      paymentDetailWithReferenceNumberFormatted.id = 1234;
      validRequest = { session: { awardDetails: claimData.validClaim() }, params: { id: 1234 }, user: { cis: { surname: 'User', givenname: 'Test' } } };
      await controller.getPaymentHistoryDetail(validRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/payment-history/detail');
      assert.deepEqual(genericResponse.data.paymentHistoryDetail, paymentDetailWithReferenceNumberFormatted);
    });

    it('should return view with no link to change payment staus when credit data is greater than 14 days ago', async () => {
      paymentDetailPaid.creditDate = creditDate15DaysAgo;
      nock('http://test-url/').get(`${paymentUri}/12345`).reply(httpStatus.OK, paymentDetailPaid);
      validRequest = { session: { awardDetails: claimData.validClaim() }, params: { id: 12345 }, user: { cis: { surname: 'User', givenname: 'Test' } } };
      await controller.getPaymentHistoryDetail(validRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/payment-history/detail');
      assert.deepEqual(genericResponse.data.paymentHistoryDetail, paymentDetailPaidFormattedAfter14Days);
    });
  });

  describe('getStatusUpdate function (GET /changes-and-enquiries/payment-history/:id/status-update)', () => {
    genericResponse = responseHelper.genericResponse();
    genericResponse.locals = responseHelper.localResponse(genericResponse);

    it('should return view when receive 500 response from API', async () => {
      nock('http://test-url/').get(`${paymentUri}/123`).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
      await controller.getStatusUpdate(validPaymentStatusRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/error');
      assert.equal(genericResponse.data.status, '- There are no payment details.');
      assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on /api/payment/123');
    });

    it('should return view when receive 404 response from API', async () => {
      nock('http://test-url/').get(`${paymentUri}/123`).reply(httpStatus.NOT_FOUND, {});
      await controller.getStatusUpdate(validPaymentStatusRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/error');
      assert.equal(genericResponse.data.status, '- There are no payment details.');
      assert.equal(genericResponse.locals.logMessage, '404 - 404 - {} - Requested on /api/payment/123');
    });

    it('should return view when receive 200 response from API', async () => {
      paymentDetailPaid.creditDate = creditDate5DaysAgo;
      nock('http://test-url/').get(`${paymentUri}/123`).reply(httpStatus.OK, paymentDetailPaid);
      await controller.getStatusUpdate(validPaymentStatusRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/payment-history/change-status');
      assert.deepEqual(genericResponse.data.statusDetail, paymentDetailPaidFormatted);
    });

    it('should return view when data is already in the cache', async () => {
      await controller.getStatusUpdate(validPaymentStatusRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/payment-history/change-status');
      assert.deepEqual(genericResponse.data.statusDetail, paymentDetailPaidFormatted);
    });

    it('should return redirect and display alert when payment status is not updatable - STATUS', async () => {
      nock('http://test-url/').get(`${paymentUri}/12345678`).reply(httpStatus.OK, paymentDetail);
      validPaymentStatusRequest = { session: { awardDetails: claimData.validClaim() }, params: { id: 12345678 }, user: { cis: { surname: 'User', givenname: 'Test' } } };
      validPaymentStatusRequest.flash = flashMock;
      await controller.getStatusUpdate(validPaymentStatusRequest, genericResponse);
      assert.equal(flash.type, 'error');
      assert.equal(flash.message, 'Error - this payment cannot update payment status.');
      assert.equal(genericResponse.address, '/changes-and-enquiries/payment-history/12345678');
    });

    it('should return redirect and display alert when payment status is not updatable - Current date greater than 14 day after credit date', async () => {
      paymentDetailPaid.creditDate = creditDate15DaysAgo;
      validPaymentStatusRequest2.flash = flashMock;
      nock('http://test-url/').get(`${paymentUri}/123`).reply(httpStatus.OK, paymentDetailPaid);
      await controller.getStatusUpdate(validPaymentStatusRequest2, genericResponse);
      assert.equal(flash.type, 'error');
      assert.equal(flash.message, 'Error - this payment cannot update payment status.');
      assert.equal(genericResponse.address, '/changes-and-enquiries/payment-history/123');
    });
  });

  describe('postStatusUpdate function (POST /changes-and-enquiries/payment-history/:id/status-update)', () => {
    it('should return view name when called with empty post with errors', async () => {
      nock('http://test-url/').get(`${paymentUri}/123`).reply(httpStatus.OK, paymentDetailPaid);
      await controller.postStatusUpdate(emptyPostRequest, genericResponse);
      assert.equal(Object.keys(genericResponse.data.errors).length, 1);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/payment-history/change-status');
    });

    it('should return view name when called with blank post with errors', async () => {
      nock('http://test-url/').get(`${paymentUri}/123`).reply(httpStatus.OK, paymentDetailPaid);
      await controller.postStatusUpdate(blankPostRequest, genericResponse);
      assert.equal(Object.keys(genericResponse.data.errors).length, 1);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/payment-history/change-status');
    });

    it('should return redirect when status update is no', async () => {
      nock('http://test-url/').get(`${paymentUri}/123`).reply(httpStatus.OK, paymentDetailPaid);
      await controller.postStatusUpdate(noPostRequest, genericResponse);
      assert.equal(Object.keys(genericResponse.data.errors).length, 1);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/payment-history/change-status');
    });

    it('should return redirect when status update is yes and receive 200 response from API', async () => {
      nock('http://test-url/').get(`${paymentUri}/123`).reply(httpStatus.OK, paymentDetailPaid);
      nock('http://test-url/').put(updateStatusUri).reply(httpStatus.OK);
      await controller.postStatusUpdate(yesPostRequest, genericResponse);
      assert.isUndefined(yesPostRequest.session['payment-history']['123']);
      assert.equal(genericResponse.address, '/changes-and-enquiries/payment');
    });

    it('should return redirect with flash data view when status update is yes but receive 500 response from API', async () => {
      nock('http://test-url/').get(`${paymentUri}/123`).reply(httpStatus.OK, paymentDetailPaid);
      nock('http://test-url/').put(updateStatusUri).reply(httpStatus.INTERNAL_SERVER_ERROR);
      yesPostRequest.flash = flashMock;
      await controller.postStatusUpdate(yesPostRequest, genericResponse);
      assert.equal(flash.type, 'error');
      assert.equal(flash.message, 'Error - could not save data.');
      assert.equal(genericResponse.address, '/changes-and-enquiries/payment-history/123/status-update');
    });

    it('should return redirect with flash data view when status update is yes but receive 400 response from API', async () => {
      nock('http://test-url/').get(`${paymentUri}/123`).reply(httpStatus.OK, paymentDetailPaid);
      nock('http://test-url/').put(updateStatusUri).reply(httpStatus.BAD_REQUEST);
      yesPostRequest.flash = flashMock;
      await controller.postStatusUpdate(yesPostRequest, genericResponse);
      assert.equal(flash.type, 'error');
      assert.equal(flash.message, 'Error - connection refused.');
      assert.equal(genericResponse.address, '/changes-and-enquiries/payment-history/123/status-update');
    });

    it('should return redirect with flash data view when status update is yes but receive 404 response from API', async () => {
      nock('http://test-url/').get(`${paymentUri}/123`).reply(httpStatus.OK, paymentDetailPaid);
      nock('http://test-url/').put(updateStatusUri).reply(httpStatus.NOT_FOUND);
      yesPostRequest.flash = flashMock;
      await controller.postStatusUpdate(yesPostRequest, genericResponse);
      assert.equal(flash.type, 'error');
      assert.equal(flash.message, 'Error - payment schedule not found.');
      assert.equal(genericResponse.address, '/changes-and-enquiries/payment-history/123/status-update');
    });
  });
});
