const { assert } = require('chai');

const httpStatus = require('http-status-codes');
const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');
const nock = require('nock');

const controller = require('../../../../app/routes/changes-enquiries/manual-payment/functions');

const claimData = require('../../../lib/claimData');
const i18nextConfig = require('../../../../config/i18next');
const responseHelper = require('../../../lib/responseHelper');
const manualPaymentData = require('../../../lib/manualPaymentData');
const kongData = require('../../../lib/kongData');
const requestKongHeaderData = require('../../../lib/requestKongHeaderData');

const session = () => ({
  session: {
    awardDetails: claimData.validClaim(),
    'manual-payment': {
      apiResponse: {
        protectedPaymentAmount: 10,
        cpsStatePensionAmount: 20,
        totalAmount: 30,
      },
      formData: {},
    },
  },
});

const errorMessages = {
  400: 'There has been a problem with the service, please go back and try again. This has been logged.',
  404: 'There has been a problem - payment not found. This has been logged.',
  500: 'There has been a problem with the service, please try again. This has been logged.',
  'invalid-schedule-period': 'Enter a valid payment period.',
};

const flash = { type: '', message: '' };
const flashMock = (type, message) => {
  flash.type = type;
  flash.message = message;
};

const manualPaymentCalculationApiUri = '/api/payment/manual-payment-calculation';
const manualPaymentApiUri = '/api/payment/manual-payment';

const reqHeaders = requestKongHeaderData();

const tableData = {
  protectedPaymentAmount: '£10.00',
  cpsStatePensionAmount: '£20.00',
  totalAmount: '£30.00',
};

const queryString = '?inviteKey=BLOG123456&startDate=2000-02-28&endDate=2000-02-28&paymentDate=2000-02-28';

let genericResponse;

const getDetailsRequest = {
  ...session(),
};

const getDetailsResponse = {
  backLink: '/changes-and-enquiries/payment',
  formAction: '/changes-and-enquiries/payment/manual-payment/details',
  formData: {},
};

const postDetailsRequestEmpty = {
  body: {},
  ...session(),
};

const postDetailsRequestComplete = {
  body: { ...manualPaymentData.dayIs28MonthIs2YearIs2000 },
  flash: flashMock,
  ...session(),
};

const getConfirmRequest = {
  ...session(),
};

const getConfirmResponse = {
  backLink: '/changes-and-enquiries/payment/manual-payment/details',
  button: '/changes-and-enquiries/payment/manual-payment/update',
  tableData,
};

const getUpdateRequest = {
  flash: flashMock,
  ...session(),
  ...kongData(),
};

describe('Manual Payment controller', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

  beforeEach(() => {
    genericResponse = responseHelper.genericResponse();
    genericResponse.locals = responseHelper.localResponse(genericResponse);
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('getDetails function (GET /changes-and-enquiries/payment/manual-payment/details)', () => {
    it('should return correct data and page when requested', () => {
      controller.getDetails(getDetailsRequest, genericResponse);
      assert.equal(JSON.stringify(genericResponse.data), JSON.stringify(getDetailsResponse));
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/manual-payment/details');
    });
  });

  describe('postDetails function (POST /changes-and-enquiries/payment/manual-payment/details)', () => {
    it('should return the same data and page, with errors, when requested with an empty form', async () => {
      await controller.postDetails(postDetailsRequestEmpty, genericResponse);
      assert.equal(Object.keys(genericResponse.data.errors).length, 12);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/manual-payment/details');
    });

    it('should return the same data and page, with an error, when the API returns a 400 state', async () => {
      nock('http://test-url/').get(manualPaymentCalculationApiUri + queryString).reply(httpStatus.BAD_REQUEST, {});
      await controller.postDetails(postDetailsRequestComplete, genericResponse);
      assert.equal(flash.type, 'error');
      assert.equal(flash.message, errorMessages[400]);
      assert.equal(genericResponse.address, '/changes-and-enquiries/payment/manual-payment/details');
    });

    it('should return the same data and page, with an error, when the API returns a 404 state', async () => {
      nock('http://test-url/').get(manualPaymentCalculationApiUri + queryString).reply(httpStatus.NOT_FOUND, {});
      await controller.postDetails(postDetailsRequestComplete, genericResponse);
      assert.equal(flash.type, 'error');
      assert.equal(flash.message, errorMessages[404]);
      assert.equal(genericResponse.address, '/changes-and-enquiries/payment/manual-payment/details');
    });

    it('should return the same data and page, with an error, when the API returns a 500 state', async () => {
      nock('http://test-url/').get(manualPaymentCalculationApiUri + queryString).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
      await controller.postDetails(postDetailsRequestComplete, genericResponse);
      assert.equal(flash.type, 'error');
      assert.equal(flash.message, errorMessages['invalid-schedule-period']);
      assert.equal(genericResponse.address, '/changes-and-enquiries/payment/manual-payment/details');
    });

    it('should save to session and redirect to /manual-payment/confirm', async () => {
      nock('http://test-url/').get(manualPaymentCalculationApiUri + queryString).reply(httpStatus.OK, {});
      await controller.postDetails(postDetailsRequestComplete, genericResponse);
      const { formData } = postDetailsRequestComplete.session['manual-payment'];
      assert.deepEqual(formData, postDetailsRequestComplete.body);
    });
  });

  describe('getConfirm function (GET /changes-and-enquiries/payment/manual-payment/confirm', () => {
    it('should return correct data and page when requested', () => {
      controller.getConfirm(getConfirmRequest, genericResponse);
      assert.equal(JSON.stringify(genericResponse.data), JSON.stringify(getConfirmResponse));
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/manual-payment/confirm');
    });
  });

  describe('getUpdate function (GET /changes-and-enquiries/payment/manual-payment/update)', () => {
    it('should return the same data and page, with an error, when the API returns a 400 state', async () => {
      nock('http://test-url/', reqHeaders).post(manualPaymentApiUri).reply(httpStatus.BAD_REQUEST, {});
      await controller.getUpdate(getUpdateRequest, genericResponse);
      assert.equal(flash.type, 'error');
      assert.equal(flash.message, errorMessages[400]);
      assert.equal(genericResponse.address, '/changes-and-enquiries/payment/manual-payment/confirm');
    });

    it('should return the same data and page, with an error, when the API returns a 404 state', async () => {
      nock('http://test-url/', reqHeaders).post(manualPaymentApiUri).reply(httpStatus.NOT_FOUND, {});
      await controller.getUpdate(getUpdateRequest, genericResponse);
      assert.equal(flash.type, 'error');
      assert.equal(flash.message, errorMessages[404]);
      assert.equal(genericResponse.address, '/changes-and-enquiries/payment/manual-payment/confirm');
    });

    it('should return the same data and page, with an error, when the API returns a 500 state', async () => {
      nock('http://test-url/', reqHeaders).post(manualPaymentApiUri).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
      await controller.getUpdate(getUpdateRequest, genericResponse);
      assert.equal(flash.type, 'error');
      assert.equal(flash.message, errorMessages[500]);
      assert.equal(genericResponse.address, '/changes-and-enquiries/payment/manual-payment/confirm');
    });

    it('should clear the manual-payment section from the session and redirect to the /payment page when the API returns a 200 state', async () => {
      nock('http://test-url/', reqHeaders).post(manualPaymentApiUri).reply(httpStatus.OK, {});
      await controller.getUpdate(getUpdateRequest, genericResponse);
      assert.isUndefined(getUpdateRequest.session['manual-payment']);
      assert.equal(flash.type, 'success');
      assert.equal(flash.message, 'Manual payment recorded');
      assert.equal(genericResponse.address, '/changes-and-enquiries/payment');
    });
  });
});
