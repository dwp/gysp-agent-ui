const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const httpStatus = require('http-status-codes');
const moment = require('moment');
const nock = require('nock');

const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../../config/i18next');

const creditDate5DaysAgo = moment().subtract(5, 'd');
const creditDate15DaysAgo = moment().subtract(15, 'd');

chai.use(chaiAsPromised);


nock.disableNetConnect();

const controller = require('../../../../app/routes/changes-enquiries/payment-history/functions');

let genericResponse;

const { assert } = chai;

const responseHelper = require('../../../lib/responseHelper');
const claimData = require('../../../lib/claimData');
const kongData = require('../../../lib/kongData');

const paymentUri = '/api/payment';
const returnPaymentUri = '/api/payment/return-payment';
const reissuePaymentApi = '/api/payment/reissue-payment';
const paymentUpdateStatusApi = '/api/payment/update-status';
const awardStatusUpdateApi = '/api/award/update-status';

let flash = {
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
  startDate: '2019-07-30T06:00:00.000+0000',
  endDate: '2019-08-27T06:00:00.000+0000',
  creditDate: creditDate5DaysAgo,
};

const paymentDetailFormatted = {
  status: 'Sent',
  accountHolder: 'Mr R H Smith',
  accountNumber: '98765432',
  sortCode: '40 05 00',
  detailsSummaryRows: [
    {
      key: { classes: 'govuk-!-width-one-third', text: 'Total' },
      value: { classes: 'govuk-!-font-weight-bold', text: '£100.00' },
    },
    {
      key: { classes: 'govuk-!-width-one-third govuk-!-font-weight-regular', text: 'Period' },
      value: { html: '30 July 2019 to<br />27 August 2019', classes: 'payment-detail__period' },
    },
    {
      key: { classes: 'govuk-!-width-one-third govuk-!-font-weight-regular', text: 'Status' },
      value: { text: 'Sent' },
      actions: {
        items: [{
          href: '/changes-and-enquiries/payment-history/123/status-update',
          text: 'Recall payment',
        }],
      },
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
  startDate: '2019-07-30T06:00:00.000+0000',
  endDate: '2019-08-27T06:00:00.000+0000',
  creditDate: '2019-08-27T06:00:00',
};

const paymentDetailWithReferenceNumberFormatted = {
  status: 'Sent',
  accountHolder: 'Mr R H Smith',
  accountNumber: '98765432',
  detailsSummaryRows: [
    {
      key: { classes: 'govuk-!-width-one-third', text: 'Total' },
      value: { classes: 'govuk-!-font-weight-bold', text: '£100.00' },
    },
    {
      key: { classes: 'govuk-!-width-one-third govuk-!-font-weight-regular', text: 'Period' },
      value: { html: '30 July 2019 to<br />27 August 2019', classes: 'payment-detail__period' },
    },
    {
      key: { classes: 'govuk-!-width-one-third govuk-!-font-weight-regular', text: 'Status' },
      value: { text: 'Sent' },
      actions: {
        items: [
          {
            href: '/changes-and-enquiries/payment-history/321/status-update',
            text: 'Recall payment',
          },
        ],
      },
    },
  ],
  id: 321,
  sortCode: '40 05 00',
  rollNumber: '12345678',
};

const paymentDetailWithReferenceNumberFormattedNotPaid = JSON.parse(JSON.stringify(paymentDetailWithReferenceNumberFormatted));

const baseResponse = {
  accountName: 'Mr R H Smith',
  accountNumber: '98765432',
  sortCode: '400500',
  referenceNumber: null,
  totalAmount: 100,
  startDate: '2019-07-30T06:00:00.000+0000',
  endDate: '2019-08-27T06:00:00.000+0000',
};
const paymentDetailPaid = Object.assign(JSON.parse(JSON.stringify(baseResponse)), { status: 'PAID', creditDate: creditDate5DaysAgo });
const paymentDetailSent = Object.assign(JSON.parse(JSON.stringify(baseResponse)), { status: 'SENT', creditDate: creditDate5DaysAgo });
const paymentDetailRecalling = Object.assign(JSON.parse(JSON.stringify(baseResponse)), { status: 'RECALLING', creditDate: creditDate5DaysAgo });
const paymentDetailReturned = Object.assign(JSON.parse(JSON.stringify(baseResponse)), { status: 'RETURNED', creditDate: creditDate5DaysAgo });

const paymentDetailPaidFormattedAfter14Days = {
  status: 'Paid',
  accountHolder: 'Mr R H Smith',
  accountNumber: '98765432',
  detailsSummaryRows: [
    {
      key: { classes: 'govuk-!-width-one-third', text: 'Total' },
      value: { classes: 'govuk-!-font-weight-bold', text: '£100.00' },
    },
    {
      key: { classes: 'govuk-!-width-one-third govuk-!-font-weight-regular', text: 'Period' },
      value: { html: '30 July 2019 to<br />27 August 2019', classes: 'payment-detail__period' },
    },
    {
      key: { classes: 'govuk-!-width-one-third govuk-!-font-weight-regular', text: 'Status' },
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

const reissuePaymentDetailsFormatted = {
  accountDetailsSummaryRows: [
    {
      key: {
        classes: 'govuk-!-width-one-third',
        text: 'Account holder',
      },
      value: { text: 'Joe Bloggs' },
    }, {
      key: {
        classes: 'govuk-!-width-one-third',
        text: 'Sort code',
      },
      value: { text: '11 22 33' },
    }, {
      key: {
        classes: 'govuk-!-width-one-third',
        text: 'Account number',
      },
      value: { text: '12345678' },
    }, {
      key: {
        classes: 'govuk-!-width-one-third',
        text: 'Roll number',
      },
      value: { text: '231231232' },
    },
  ],
  paymentDetailsSummaryRows: [
    {
      key: {
        classes: 'govuk-!-width-one-third govuk-!-font-weight-bold',
        text: 'Total',
      },
      value: {
        classes: 'govuk-!-font-weight-bold',
        text: '£100.00',
      },
    }, {
      key: {
        classes: 'govuk-!-width-one-third govuk-!-font-weight-regular',
        text: 'Period',
      },
      value: { text: '30/07/2019 to 27/08/2019' },
    },
  ],
};

const baseRequest = {
  session: { awardDetails: claimData.validClaim() }, params: { id: 123 }, ...kongData(), body: {},
};

let validRequest = { session: { awardDetails: claimData.validClaim() }, params: { id: 123 }, ...kongData() };
let validPaymentStatusRequest = { session: { awardDetails: claimData.validClaim() }, params: { id: 123 }, ...kongData() };
const validPaymentStatusRequest2 = { session: { awardDetails: claimData.validClaim() }, params: { id: 123 }, ...kongData() };
const validPaymentStatusRequestSent = { session: { awardDetails: claimData.validClaim() }, params: { id: 123 }, ...kongData() };
const validPaymentStatusRequestRecalling = { session: { awardDetails: claimData.validClaim() }, params: { id: 123 }, ...kongData() };
let validReissueRequest = { };

const validReissueDeathRequest = {
  session: { awardDetails: claimData.validClaimWithDeathVerified() }, params: { id: 123 }, ...kongData(), flash: flashMock,
};

const validReissueDeathNotVerifiedRequest = {
  session: { awardDetails: claimData.validClaimWithDeathNotVerified() }, params: { id: 123 }, ...kongData(), flash: flashMock,
};

const emptyPostRequest = Object.assign(JSON.parse(JSON.stringify(baseRequest)), { body: {} });
const blankPostRequest = Object.assign(JSON.parse(JSON.stringify(baseRequest)), { body: { statusUpdate: '' } });
const noPostRequest = Object.assign(JSON.parse(JSON.stringify(baseRequest)), { body: { statusUpdate: 'no' } });
const yesPostRequest = Object.assign(JSON.parse(JSON.stringify(baseRequest)), { body: { statusUpdate: 'yes' }, flash: flashMock });
const yesPostRequestRecalling = Object.assign(JSON.parse(JSON.stringify(baseRequest)), { body: { statusUpdate: 'yes' }, flash: flashMock });
yesPostRequestRecalling.params.id = 1111;
const yesPostRequestRecalled = Object.assign(JSON.parse(JSON.stringify(yesPostRequestRecalling)), { flash: flashMock });
const yesPostRequestPaid = Object.assign(JSON.parse(JSON.stringify(baseRequest)), { body: { statusUpdate: 'no' }, flash: flashMock });
yesPostRequestPaid.params.id = 1111;

describe('Payment history controller', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

  beforeEach(() => {
    flash = { type: '', message: '' };
  });

  afterEach(() => {
    nock.cleanAll();
  });

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
      validRequest = { session: { awardDetails: claimData.validClaim() }, params: { id: 321 }, ...kongData() };
      await controller.getPaymentHistoryDetail(validRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/payment-history/detail');
      assert.deepEqual(genericResponse.data.paymentHistoryDetail, paymentDetailWithReferenceNumberFormatted);
    });

    it('should return view roll number when data is already in the cache', async () => {
      await controller.getPaymentHistoryDetail(validRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/payment-history/detail');
      assert.deepEqual(genericResponse.data.paymentHistoryDetail, paymentDetailWithReferenceNumberFormatted);
    });

    it('should return view with no link to change payment status when status is not paid', async () => {
      nock('http://test-url/').get(`${paymentUri}/1234`).reply(httpStatus.OK, paymentDetailWithReferenceNumber);
      paymentDetailWithReferenceNumberFormattedNotPaid.id = 1234;
      paymentDetailWithReferenceNumberFormattedNotPaid.detailsSummaryRows[2].actions.items[0].href = '/changes-and-enquiries/payment-history/1234/status-update';
      validRequest = { session: { awardDetails: claimData.validClaim() }, params: { id: 1234 }, ...kongData() };
      await controller.getPaymentHistoryDetail(validRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/payment-history/detail');
      assert.deepEqual(genericResponse.data.paymentHistoryDetail, paymentDetailWithReferenceNumberFormattedNotPaid);
    });

    it('should return view with no link to change payment status when credit data is greater than 14 days ago', async () => {
      paymentDetailPaid.creditDate = creditDate15DaysAgo;
      nock('http://test-url/').get(`${paymentUri}/12345`).reply(httpStatus.OK, paymentDetailPaid);
      validRequest = { session: { awardDetails: claimData.validClaim() }, params: { id: 12345 }, ...kongData() };
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

    it('should allow status update when status is SENT', async () => {
      paymentDetailSent.creditDate = creditDate5DaysAgo;
      nock('http://test-url/').get(`${paymentUri}/123`).reply(httpStatus.OK, paymentDetailSent);
      await controller.getStatusUpdate(validPaymentStatusRequestSent, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/payment-history/change-status');
    });

    it('should allow status update when status is RECALLING', async () => {
      nock('http://test-url/').get(`${paymentUri}/123`).reply(httpStatus.OK, paymentDetailRecalling);
      await controller.getStatusUpdate(validPaymentStatusRequestRecalling, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/payment-history/change-status');
    });

    it('should return redirect and display alert when payment status is not updatable - STATUS', async () => {
      nock('http://test-url/').get(`${paymentUri}/12345678`).reply(httpStatus.OK, paymentDetailReturned);
      validPaymentStatusRequest = { session: { awardDetails: claimData.validClaim() }, params: { id: 12345678 }, ...kongData() };
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

    describe('Status - PAID to RETURNED', () => {
      it('should return redirect when status update is yes and receive 200 response from payment and award API', async () => {
        nock('http://test-url/').get(`${paymentUri}/123`).reply(httpStatus.OK, paymentDetailPaid);
        nock('http://test-url/').put(returnPaymentUri).reply(httpStatus.OK);
        nock('http://test-url/').put(awardStatusUpdateApi).reply(httpStatus.OK);
        await controller.postStatusUpdate(yesPostRequest, genericResponse);
        assert.isUndefined(yesPostRequest.session['payment-history']['123']);
        assert.equal(flash.type, 'success');
        assert.equal(flash.message, 'Payment returned - payments stopped');
        assert.equal(genericResponse.address, '/changes-and-enquiries/payment');
      });

      it('should return redirect with flash data view when status update is yes but receive 500 response from the payment API', async () => {
        nock('http://test-url/').get(`${paymentUri}/123`).reply(httpStatus.OK, paymentDetailPaid);
        nock('http://test-url/').put(returnPaymentUri).reply(httpStatus.INTERNAL_SERVER_ERROR);
        yesPostRequest.flash = flashMock;
        await controller.postStatusUpdate(yesPostRequest, genericResponse);
        assert.equal(flash.type, 'error');
        assert.equal(flash.message, 'Error - could not save data.');
        assert.equal(genericResponse.address, '/changes-and-enquiries/payment-history/123/status-update');
        assert.equal(genericResponse.locals.logMessage, '500 - 500 - undefined - Requested on /api/payment/return-payment');
      });

      it('should return redirect with flash data view when status update is yes but receive 400 response from the payment API', async () => {
        nock('http://test-url/').get(`${paymentUri}/123`).reply(httpStatus.OK, paymentDetailPaid);
        nock('http://test-url/').put(returnPaymentUri).reply(httpStatus.BAD_REQUEST);
        yesPostRequest.flash = flashMock;
        await controller.postStatusUpdate(yesPostRequest, genericResponse);
        assert.equal(flash.type, 'error');
        assert.equal(flash.message, 'Error - connection refused.');
        assert.equal(genericResponse.address, '/changes-and-enquiries/payment-history/123/status-update');
        assert.equal(genericResponse.locals.logMessage, '400 - 400 - undefined - Requested on /api/payment/return-payment');
      });

      it('should return redirect with flash data view when status update is yes but receive 404 response from the payment API', async () => {
        nock('http://test-url/').get(`${paymentUri}/123`).reply(httpStatus.OK, paymentDetailPaid);
        nock('http://test-url/').put(returnPaymentUri).reply(httpStatus.NOT_FOUND);
        yesPostRequest.flash = flashMock;
        await controller.postStatusUpdate(yesPostRequest, genericResponse);
        assert.equal(flash.type, 'error');
        assert.equal(flash.message, 'Error - not found.');
        assert.equal(genericResponse.address, '/changes-and-enquiries/payment-history/123/status-update');
        assert.equal(genericResponse.locals.logMessage, '404 - 404 - undefined - Requested on /api/payment/return-payment');
      });

      it('should return redirect with flash data view when status update is yes but receive 500 response from the award API', async () => {
        nock('http://test-url/').get(`${paymentUri}/123`).reply(httpStatus.OK, paymentDetailPaid);
        nock('http://test-url/').put(returnPaymentUri).reply(httpStatus.OK);
        nock('http://test-url/').put(awardStatusUpdateApi).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
        yesPostRequest.flash = flashMock;
        await controller.postStatusUpdate(yesPostRequest, genericResponse);
        assert.equal(flash.type, 'error');
        assert.equal(flash.message, 'Error - could not save data.');
        assert.equal(genericResponse.address, '/changes-and-enquiries/payment-history/123/status-update');
        assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on /api/award/update-status');
      });

      it('should return redirect with flash data view when status update is yes but receive 400 response from the award API', async () => {
        nock('http://test-url/').get(`${paymentUri}/123`).reply(httpStatus.OK, paymentDetailPaid);
        nock('http://test-url/').put(returnPaymentUri).reply(httpStatus.OK);
        nock('http://test-url/').put(awardStatusUpdateApi).reply(httpStatus.BAD_REQUEST, {});
        yesPostRequest.flash = flashMock;
        await controller.postStatusUpdate(yesPostRequest, genericResponse);
        assert.equal(flash.type, 'error');
        assert.equal(flash.message, 'Error - connection refused.');
        assert.equal(genericResponse.address, '/changes-and-enquiries/payment-history/123/status-update');
        assert.equal(genericResponse.locals.logMessage, '400 - 400 - {} - Requested on /api/award/update-status');
      });

      it('should return redirect with flash data view when status update is yes but receive 404 response from the award API', async () => {
        nock('http://test-url/').get(`${paymentUri}/123`).reply(httpStatus.OK, paymentDetailPaid);
        nock('http://test-url/').put(returnPaymentUri).reply(httpStatus.OK);
        nock('http://test-url/').put(awardStatusUpdateApi).reply(httpStatus.NOT_FOUND, {});
        yesPostRequest.flash = flashMock;
        await controller.postStatusUpdate(yesPostRequest, genericResponse);
        assert.equal(flash.type, 'error');
        assert.equal(flash.message, 'Error - not found.');
        assert.equal(genericResponse.address, '/changes-and-enquiries/payment-history/123/status-update');
        assert.equal(genericResponse.locals.logMessage, '404 - 404 - {} - Requested on /api/award/update-status');
      });
    });

    describe('Status - SENT to RECALLING', () => {
      it('should return redirect when status update is yes and receive 200 response from payment and award API', async () => {
        nock('http://test-url/').get(`${paymentUri}/1111`).reply(httpStatus.OK, paymentDetailSent);
        nock('http://test-url/').put(paymentUpdateStatusApi).reply(httpStatus.OK);
        await controller.postStatusUpdate(yesPostRequestRecalling, genericResponse);
        assert.isUndefined(yesPostRequestRecalling.session['payment-history']['1111']);
        assert.equal(flash.type, 'success');
        assert.equal(flash.message, 'Recalling payment');
        assert.equal(genericResponse.address, '/changes-and-enquiries/payment');
      });

      it('should return redirect with flash data view when status update is yes but receive 500 response from the payment API', async () => {
        nock('http://test-url/').get(`${paymentUri}/1111`).reply(httpStatus.OK, paymentDetailSent);
        nock('http://test-url/').put(paymentUpdateStatusApi).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
        await controller.postStatusUpdate(yesPostRequestRecalling, genericResponse);
        assert.equal(flash.type, 'error');
        assert.equal(flash.message, 'Error - could not save data.');
        assert.equal(genericResponse.address, '/changes-and-enquiries/payment-history/1111/status-update');
        assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on /api/payment/update-status');
      });

      it('should return redirect with flash data view when status update is yes but receive 400 response from the payment API', async () => {
        nock('http://test-url/').get(`${paymentUri}/1111`).reply(httpStatus.OK, paymentDetailSent);
        nock('http://test-url/').put(paymentUpdateStatusApi).reply(httpStatus.BAD_REQUEST, {});
        await controller.postStatusUpdate(yesPostRequestRecalling, genericResponse);
        assert.equal(flash.type, 'error');
        assert.equal(flash.message, 'Error - connection refused.');
        assert.equal(genericResponse.address, '/changes-and-enquiries/payment-history/1111/status-update');
        assert.equal(genericResponse.locals.logMessage, '400 - 400 - {} - Requested on /api/payment/update-status');
      });

      it('should return redirect with flash data view when status update is yes but receive 404 response from the payment API', async () => {
        nock('http://test-url/').get(`${paymentUri}/1111`).reply(httpStatus.OK, paymentDetailSent);
        nock('http://test-url/').put(paymentUpdateStatusApi).reply(httpStatus.NOT_FOUND, {});
        await controller.postStatusUpdate(yesPostRequestRecalling, genericResponse);
        assert.equal(flash.type, 'error');
        assert.equal(flash.message, 'Error - not found.');
        assert.equal(genericResponse.address, '/changes-and-enquiries/payment-history/1111/status-update');
        assert.equal(genericResponse.locals.logMessage, '404 - 404 - {} - Requested on /api/payment/update-status');
      });
    });

    describe('Status - RECALLING to RECALLED', () => {
      it('should return redirect when status update is yes and receive 200 response from payment and award API', async () => {
        nock('http://test-url/').get(`${paymentUri}/1111`).reply(httpStatus.OK, paymentDetailRecalling);
        nock('http://test-url/').put(paymentUpdateStatusApi).reply(httpStatus.OK);
        await controller.postStatusUpdate(yesPostRequestRecalled, genericResponse);
        assert.isUndefined(yesPostRequestRecalled.session['payment-history']['1111']);
        assert.equal(genericResponse.address, '/changes-and-enquiries/payment');
      });

      it('should return redirect with flash data view when status update is yes but receive 500 response from the payment API', async () => {
        nock('http://test-url/').get(`${paymentUri}/1111`).reply(httpStatus.OK, paymentDetailRecalling);
        nock('http://test-url/').put(paymentUpdateStatusApi).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
        yesPostRequestRecalled.flash = flashMock;
        await controller.postStatusUpdate(yesPostRequestRecalled, genericResponse);
        assert.equal(flash.type, 'error');
        assert.equal(flash.message, 'Error - could not save data.');
        assert.equal(genericResponse.address, '/changes-and-enquiries/payment-history/1111/status-update');
        assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on /api/payment/update-status');
      });

      it('should return redirect with flash data view when status update is yes but receive 400 response from the payment API', async () => {
        nock('http://test-url/').get(`${paymentUri}/1111`).reply(httpStatus.OK, paymentDetailRecalling);
        nock('http://test-url/').put(paymentUpdateStatusApi).reply(httpStatus.BAD_REQUEST, {});
        yesPostRequestRecalled.flash = flashMock;
        await controller.postStatusUpdate(yesPostRequestRecalled, genericResponse);
        assert.equal(flash.type, 'error');
        assert.equal(flash.message, 'Error - connection refused.');
        assert.equal(genericResponse.address, '/changes-and-enquiries/payment-history/1111/status-update');
        assert.equal(genericResponse.locals.logMessage, '400 - 400 - {} - Requested on /api/payment/update-status');
      });

      it('should return redirect with flash data view when status update is yes but receive 404 response from the payment API', async () => {
        nock('http://test-url/').get(`${paymentUri}/1111`).reply(httpStatus.OK, paymentDetailRecalling);
        nock('http://test-url/').put(paymentUpdateStatusApi).reply(httpStatus.NOT_FOUND, {});
        yesPostRequestRecalled.flash = flashMock;
        await controller.postStatusUpdate(yesPostRequestRecalled, genericResponse);
        assert.equal(flash.type, 'error');
        assert.equal(flash.message, 'Error - not found.');
        assert.equal(genericResponse.address, '/changes-and-enquiries/payment-history/1111/status-update');
        assert.equal(genericResponse.locals.logMessage, '404 - 404 - {} - Requested on /api/payment/update-status');
      });
    });

    describe('Status - RECALLING to PAID', () => {
      it('should return redirect when status update is yes and receive 200 response from payment and award API', async () => {
        nock('http://test-url/').get(`${paymentUri}/1111`).reply(httpStatus.OK, paymentDetailRecalling);
        nock('http://test-url/').put(paymentUpdateStatusApi).reply(httpStatus.OK);
        await controller.postStatusUpdate(yesPostRequestPaid, genericResponse);
        assert.isUndefined(yesPostRequestPaid.session['payment-history']['1111']);
        assert.equal(genericResponse.address, '/changes-and-enquiries/payment');
      });

      it('should return redirect with flash data view when status update is yes but receive 500 response from the payment API', async () => {
        nock('http://test-url/').get(`${paymentUri}/1111`).reply(httpStatus.OK, paymentDetailRecalling);
        nock('http://test-url/').put(paymentUpdateStatusApi).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
        yesPostRequestPaid.flash = flashMock;
        await controller.postStatusUpdate(yesPostRequestPaid, genericResponse);
        assert.equal(flash.type, 'error');
        assert.equal(flash.message, 'Error - could not save data.');
        assert.equal(genericResponse.address, '/changes-and-enquiries/payment-history/1111/status-update');
        assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on /api/payment/update-status');
      });

      it('should return redirect with flash data view when status update is yes but receive 400 response from the payment API', async () => {
        nock('http://test-url/').get(`${paymentUri}/1111`).reply(httpStatus.OK, paymentDetailRecalling);
        nock('http://test-url/').put(paymentUpdateStatusApi).reply(httpStatus.BAD_REQUEST, {});
        yesPostRequestPaid.flash = flashMock;
        await controller.postStatusUpdate(yesPostRequestPaid, genericResponse);
        assert.equal(flash.type, 'error');
        assert.equal(flash.message, 'Error - connection refused.');
        assert.equal(genericResponse.address, '/changes-and-enquiries/payment-history/1111/status-update');
        assert.equal(genericResponse.locals.logMessage, '400 - 400 - {} - Requested on /api/payment/update-status');
      });

      it('should return redirect with flash data view when status update is yes but receive 404 response from the payment API', async () => {
        nock('http://test-url/').get(`${paymentUri}/1111`).reply(httpStatus.OK, paymentDetailRecalling);
        nock('http://test-url/').put(paymentUpdateStatusApi).reply(httpStatus.NOT_FOUND, {});
        yesPostRequestPaid.flash = flashMock;
        await controller.postStatusUpdate(yesPostRequestPaid, genericResponse);
        assert.equal(flash.type, 'error');
        assert.equal(flash.message, 'Error - not found.');
        assert.equal(genericResponse.address, '/changes-and-enquiries/payment-history/1111/status-update');
        assert.equal(genericResponse.locals.logMessage, '404 - 404 - {} - Requested on /api/payment/update-status');
      });
    });
  });

  describe('getReissuePayment function (GET /changes-and-enquiries/payment-history/:id/reissue)', () => {
    beforeEach(() => {
      genericResponse = responseHelper.genericResponse();
      genericResponse.locals = responseHelper.localResponse(genericResponse);
      validReissueRequest = {
        session: { awardDetails: claimData.validClaim() }, params: { id: 123 }, ...kongData(), flash: flashMock,
      };
    });

    it('should return view when receive 500 response from API', async () => {
      nock('http://test-url/').get(`${paymentUri}/123`).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
      await controller.getReissuePayment(validReissueRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/error');
      assert.equal(genericResponse.data.status, '- There are no payment details.');
      assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on /api/payment/123');
    });

    it('should return view when receive 404 response from API', async () => {
      nock('http://test-url/').get(`${paymentUri}/123`).reply(httpStatus.NOT_FOUND, {});
      await controller.getReissuePayment(validReissueRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/error');
      assert.equal(genericResponse.data.status, '- There are no payment details.');
      assert.equal(genericResponse.locals.logMessage, '404 - 404 - {} - Requested on /api/payment/123');
    });

    it('should return view when receive 200 response from API', async () => {
      nock('http://test-url/').get(`${paymentUri}/123`).reply(httpStatus.OK, paymentDetailReturned);
      await controller.getReissuePayment(validReissueRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/payment-history/reissue');
      assert.deepEqual(genericResponse.data.details, reissuePaymentDetailsFormatted);
    });

    it('should allow status update when status is RETURNED', async () => {
      nock('http://test-url/').get(`${paymentUri}/123`).reply(httpStatus.OK, paymentDetailReturned);
      await controller.getReissuePayment(validReissueRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/payment-history/reissue');
    });

    it('should return redirect and display alert when payment status is not updatable - SENT', async () => {
      nock('http://test-url/').get(`${paymentUri}/12345678`).reply(httpStatus.OK, paymentDetailSent);
      validReissueRequest.params.id = 12345678;
      await controller.getReissuePayment(validReissueRequest, genericResponse);
      assert.equal(flash.type, 'error');
      assert.equal(flash.message, 'Error - this payment cannot be reissued.');
      assert.equal(genericResponse.address, '/changes-and-enquiries/payment-history/12345678');
    });

    it('should return redirect and display alert when payment status is not updatable - RETURNED DEAD', async () => {
      nock('http://test-url/').get(`${paymentUri}/12345678`).reply(httpStatus.OK, paymentDetailReturned);
      validReissueDeathRequest.params.id = 12345678;
      await controller.getReissuePayment(validReissueDeathRequest, genericResponse);
      assert.equal(flash.type, 'error');
      assert.equal(flash.message, 'Error - this payment cannot be reissued.');
      assert.equal(genericResponse.address, '/changes-and-enquiries/payment-history/12345678');
    });

    it('should return redirect and display alert when payment status is not updatable - RETURNED DEAD NOTVERIFIED', async () => {
      nock('http://test-url/').get(`${paymentUri}/12345678`).reply(httpStatus.OK, paymentDetailReturned);
      validReissueDeathNotVerifiedRequest.params.id = 12345678;
      await controller.getReissuePayment(validReissueDeathNotVerifiedRequest, genericResponse);
      assert.equal(flash.type, 'error');
      assert.equal(flash.message, 'Error - this payment cannot be reissued.');
      assert.equal(genericResponse.address, '/changes-and-enquiries/payment-history/12345678');
    });
  });

  describe('postReissuePayment function (POST /changes-and-enquiries/payment-history/:id/reissue)', () => {
    beforeEach(() => {
      genericResponse = responseHelper.genericResponse();
      genericResponse.locals = responseHelper.localResponse(genericResponse);
      validReissueRequest = {
        session: { awardDetails: claimData.validClaim() }, params: { id: 123 }, ...kongData(), flash: flashMock,
      };
    });

    it('should return redirect and display alert when payment status is not updatable - SENT', async () => {
      nock('http://test-url/').get(`${paymentUri}/12345678`).reply(httpStatus.OK, paymentDetailSent);
      validReissueRequest.params.id = 12345678;
      await controller.postReissuePayment(validReissueRequest, genericResponse);
      assert.equal(flash.type, 'error');
      assert.equal(flash.message, 'Error - this payment cannot be reissued.');
      assert.equal(genericResponse.address, '/changes-and-enquiries/payment-history/12345678');
    });

    it('should return redirect and display alert when payment status is not updatable - RETURNED DEAD', async () => {
      nock('http://test-url/').get(`${paymentUri}/12345678`).reply(httpStatus.OK, paymentDetailReturned);
      validReissueDeathRequest.params.id = 12345678;
      await controller.postReissuePayment(validReissueDeathRequest, genericResponse);
      assert.equal(flash.type, 'error');
      assert.equal(flash.message, 'Error - this payment cannot be reissued.');
      assert.equal(genericResponse.address, '/changes-and-enquiries/payment-history/12345678');
    });

    it('should return redirect and display alert when payment status is not updatable - RETURNED DEAD NOTVERIFIED', async () => {
      nock('http://test-url/').get(`${paymentUri}/12345678`).reply(httpStatus.OK, paymentDetailReturned);
      validReissueDeathNotVerifiedRequest.params.id = 12345678;
      await controller.postReissuePayment(validReissueDeathNotVerifiedRequest, genericResponse);
      assert.equal(flash.type, 'error');
      assert.equal(flash.message, 'Error - this payment cannot be reissued.');
      assert.equal(genericResponse.address, '/changes-and-enquiries/payment-history/12345678');
    });

    it('should return redirect when receive 200 response from payment API', async () => {
      nock('http://test-url/').get(`${paymentUri}/123`).reply(httpStatus.OK, paymentDetailReturned);
      nock('http://test-url/').put(reissuePaymentApi).reply(httpStatus.OK);
      await controller.postReissuePayment(validReissueRequest, genericResponse);
      assert.isUndefined(validReissueRequest.session['payment-history']['123']);
      assert.equal(genericResponse.address, '/changes-and-enquiries/payment');
    });

    it('should return redirect with flash data view when receive 500 response from the payment API', async () => {
      nock('http://test-url/').get(`${paymentUri}/123`).reply(httpStatus.OK, paymentDetailReturned);
      nock('http://test-url/').put(reissuePaymentApi).reply(httpStatus.INTERNAL_SERVER_ERROR);
      await controller.postReissuePayment(validReissueRequest, genericResponse);
      assert.equal(flash.type, 'error');
      assert.equal(flash.message, 'Error - could not save data.');
      assert.equal(genericResponse.address, '/changes-and-enquiries/payment-history/123/reissue');
      assert.equal(genericResponse.locals.logMessage, '500 - 500 - undefined - Requested on /api/payment/reissue-payment');
    });

    it('should return redirect with flash data view when receive 400 response from the payment API', async () => {
      nock('http://test-url/').get(`${paymentUri}/123`).reply(httpStatus.OK, paymentDetailReturned);
      nock('http://test-url/').put(reissuePaymentApi).reply(httpStatus.BAD_REQUEST);
      await controller.postReissuePayment(validReissueRequest, genericResponse);
      assert.equal(flash.type, 'error');
      assert.equal(flash.message, 'Error - connection refused.');
      assert.equal(genericResponse.address, '/changes-and-enquiries/payment-history/123/reissue');
      assert.equal(genericResponse.locals.logMessage, '400 - 400 - undefined - Requested on /api/payment/reissue-payment');
    });

    it('should return redirect with flash data view when receive 404 response from the payment API', async () => {
      nock('http://test-url/').get(`${paymentUri}/123`).reply(httpStatus.OK, paymentDetailReturned);
      nock('http://test-url/').put(reissuePaymentApi).reply(httpStatus.NOT_FOUND);
      await controller.postReissuePayment(validReissueRequest, genericResponse);
      assert.equal(flash.type, 'error');
      assert.equal(flash.message, 'Error - not found.');
      assert.equal(genericResponse.address, '/changes-and-enquiries/payment-history/123/reissue');
      assert.equal(genericResponse.locals.logMessage, '404 - 404 - undefined - Requested on /api/payment/reissue-payment');
    });

    it('should return view when receive 500 response from payment API', async () => {
      nock('http://test-url/').get(`${paymentUri}/123`).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
      await controller.postReissuePayment(validReissueRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/error');
      assert.equal(genericResponse.data.status, '- There are no payment details.');
      assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on /api/payment/123');
    });
  });
});
