const nock = require('nock');
const httpStatus = require('http-status-codes');

nock.disableNetConnect();

const { assert } = require('chai');

const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../../config/i18next');

const controller = require('../../../../app/routes/changes-enquiries/payment-frequency/functions');

const responseHelper = require('../../../lib/responseHelper');
const claimData = require('../../../lib/claimData');
const { promiseWait } = require('../../../lib/unitHelper');
const kongData = require('../../../lib/kongData');
const requestKongHeaderData = require('../../../lib/requestKongHeaderData');

let testPromise;
let genericResponse = {};

const changePaymentFrequencyGetRequest = {
  session: {
    searchedNino: 'AA370773A',
    awardDetails: claimData.validClaim(),
  },
};
const changePaymentFrequencyViewData = {
  awardDetails: changePaymentFrequencyGetRequest.session.awardDetails,
  inputFrequency: false,
};

const emptyPostRequest = { session: { awardDetails: claimData.validClaim() }, body: {} };
const validPostSameFrequencyRequest = { session: { awardDetails: claimData.validClaim() }, body: { frequency: '4W' } };

const putChangePaymentFrequencyApiUri = '/api/award/frequencychangeupdate';

const reqHeaders = requestKongHeaderData();

const errorMessage = {
  notFound: 'There has been a problem - award not found. This has been logged.',
  badRequest: 'There has been a problem with the service, please go back and try again. This has been logged.',
  other: 'There is a problem with the service. This has been logged. Please try again later.',
};

let flash = {
  type: '',
  message: '',
};
const flashMock = (type, message) => {
  flash.type = type;
  flash.message = message;
};

const paymentSchedulePostRequest = {
  ...kongData(),
  session: {
    awardDetails: claimData.validClaim(),
    searchedNino: 'AA370773A',
  },
  body: { frequency: '2W' },
  flash: flashMock,
};

describe('Change payment frequency controller ', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

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

    flash = { type: '', message: '' };

    testPromise = promiseWait();
  });

  describe(' getChangePaymentFrequency function (GET /changes-and-enquiries/payment/frequency)', () => {
    it('should display change bank or building account details page when requested', (done) => {
      controller.getChangePaymentFrequency(changePaymentFrequencyGetRequest, genericResponse);
      assert.equal(JSON.stringify(genericResponse.data), JSON.stringify(changePaymentFrequencyViewData));
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/payment-frequency/index');
      done();
    });
  });

  describe(' postChangePaymentFrequency function (POST /changes-and-enquiries/payment/frequency)', () => {
    it('should return view name when called with empty post with errors', () => {
      controller.postChangePaymentFrequency(emptyPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(Object.keys(genericResponse.data.errors).length, 1);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/payment-frequency/index');
      });
    });

    it('should return a redirect to payment page when post is a valid post and is same as current frequency', () => {
      controller.postChangePaymentFrequency(validPostSameFrequencyRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.address, '/changes-and-enquiries/payment');
      });
    });

    it('should return a redirect to payment page when post is valid and is different frequency', () => {
      nock('http://test-url/', reqHeaders).put(putChangePaymentFrequencyApiUri).reply(httpStatus.OK, {});
      controller.postChangePaymentFrequency(paymentSchedulePostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(flash.type, 'success');
        assert.equal(flash.message, 'Frequency changed');
        assert.equal(genericResponse.address, '/changes-and-enquiries/payment');
      });
    });

    it('should return a the schedule with not found global error', () => {
      nock('http://test-url/', reqHeaders).put(putChangePaymentFrequencyApiUri).reply(httpStatus.NOT_FOUND, {});
      controller.postChangePaymentFrequency(paymentSchedulePostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(flash.type, 'error');
        assert.equal(flash.message, errorMessage.notFound);
        assert.equal(genericResponse.locals.logMessage, '404 - 404 - {} - Requested on api/award/frequencychangeupdate');
        assert.equal(genericResponse.address, '/changes-and-enquiries/payment/frequency');
      });
    });

    it('should return a the schedule with bad request global error', () => {
      nock('http://test-url/', reqHeaders).put(putChangePaymentFrequencyApiUri).reply(httpStatus.BAD_REQUEST, {});
      controller.postChangePaymentFrequency(paymentSchedulePostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(flash.type, 'error');
        assert.equal(flash.message, errorMessage.badRequest);
        assert.equal(genericResponse.locals.logMessage, '400 - 400 - {} - Requested on api/award/frequencychangeupdate');
        assert.equal(genericResponse.address, '/changes-and-enquiries/payment/frequency');
      });
    });

    it('should return a the schedule with other global error', () => {
      nock('http://test-url/', reqHeaders).put(putChangePaymentFrequencyApiUri).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
      controller.postChangePaymentFrequency(paymentSchedulePostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(flash.type, 'error');
        assert.equal(flash.message, errorMessage.other);
        assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on api/award/frequencychangeupdate');
        assert.equal(genericResponse.address, '/changes-and-enquiries/payment/frequency');
      });
    });
  });
});
