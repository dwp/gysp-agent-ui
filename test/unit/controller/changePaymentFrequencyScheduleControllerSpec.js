const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const httpStatus = require('http-status-codes');

chai.use(chaiAsPromised);

const nock = require('nock');

nock.disableNetConnect();

const controller = require('../../../app/routes/changes-enquiries/payment-frequency-schedule/functions');

let testPromise;
let genericResponse;

const { assert } = chai;

const responseHelper = require('../../lib/responseHelper');
const dataObjects = require('../lib/formDataObjects');
const claimData = require('../../lib/claimData');
const paymentData = require('../../lib/paymentData');

const errorMessage = {
  notFound: 'Error - award not found.',
  badRequest: 'Error - connection refused.',
  other: 'Error - could not save data.',
};

const flash = {
  type: '',
  message: '',
};
const flashMock = (type, message) => {
  flash.type = type;
  flash.message = message;
};

const paymentScheduleRequest = {
  session: {
    searchedNino: 'AA370773A',
    awardDetails: claimData.validClaim(),
    'payment-frequency': { frequency: '1W' },
  },
};

const paymentSchedulePostRequest = {
  user: { cis: { surname: 'User', givenname: 'Test' } },
  session: {
    awardDetails: claimData.validClaim(),
    frequencyChangeSchedule: paymentData.validSchedule(),
    searchedNino: 'AA370773A',
    'payment-frequency': { frequency: '1W' },
  },
  body: {},
  flash: flashMock,
};

const reqHeaders = { reqheaders: { agentRef: 'Test User' } };

const getChangePaymentFrequencyApiUri = '/api/award/frequencychangecalc';
const putChangePaymentFrequencyApiUri = '/api/award/frequencychangeupdate';

describe('Change payment frequency schedule controller', () => {
  beforeEach(() => {
    testPromise = new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 50);
    });
  });
  describe('getPaymentSchedule function (GET /changes-enquiries/payment/frequency/schedule)', () => {
    genericResponse = responseHelper.genericResponse();
    genericResponse.locals = responseHelper.localResponse(genericResponse);

    it('should return view with data when a 200 reponse from the API is received', () => {
      nock('http://test-url/').get(getChangePaymentFrequencyApiUri)
        .query({ frequency: paymentScheduleRequest.session['payment-frequency'].frequency, nino: paymentScheduleRequest.session.searchedNino })
        .reply(200, dataObjects.validProcessClaimPaymentApiResponse());
      controller.getChangePaymentFrequency(paymentScheduleRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/payment-frequency-schedule/index');
        assert.equal(JSON.stringify(genericResponse.data.details), JSON.stringify(dataObjects.validProcessClaimPaymentFormattedObject()));
      });
    });

    it('should return error view when nino exists in the session', () => {
      controller.getChangePaymentFrequency(dataObjects.noNinoChangePaymentScheduleRequest(), genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.currentStatus, httpStatus.INTERNAL_SERVER_ERROR);
        assert.equal(genericResponse.viewName, 'pages/error');
        assert.equal(genericResponse.data.status, '- Issue getting payment schedule.');
      });
    });

    it('should return error view when no payment-frequency key exists in the session', () => {
      controller.getChangePaymentFrequency(dataObjects.noPaymentFrequencyChangePaymentScheduleRequest(), genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.currentStatus, httpStatus.INTERNAL_SERVER_ERROR);
        assert.equal(genericResponse.viewName, 'pages/error');
        assert.equal(genericResponse.data.status, '- Issue getting payment schedule.');
      });
    });

    it('should return error view when API returns 404 state', () => {
      nock('http://test-url/').get(getChangePaymentFrequencyApiUri)
        .query({ frequency: paymentScheduleRequest.session['payment-frequency'].frequency, nino: paymentScheduleRequest.session.searchedNino })
        .reply(404, {});
      controller.getChangePaymentFrequency(paymentScheduleRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/error');
        assert.equal(genericResponse.data.status, '- Payment schedule not found.');
        assert.equal(genericResponse.locals.logMessage, '404 - 404 - {} - Requested on payment schedule not found');
      });
    });

    it('should return error view when API returns 500 state', () => {
      nock('http://test-url/').get(getChangePaymentFrequencyApiUri)
        .query({ frequency: paymentScheduleRequest.session['payment-frequency'].frequency, nino: paymentScheduleRequest.session.searchedNino })
        .reply(500, {});
      controller.getChangePaymentFrequency(paymentScheduleRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/error');
        assert.equal(genericResponse.data.status, '- Issue getting payment schedule.');
        assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on cannot get payment schedule');
      });
    });
  });

  describe('postChangePaymentFrequency function (POST /changes-and-enquiries/payment/frequency)', () => {
    it('should return a redirect to back payment page when post', () => {
      nock('http://test-url/', reqHeaders).put(putChangePaymentFrequencyApiUri).reply(httpStatus.OK, {});
      controller.postChangePaymentFrequency(paymentSchedulePostRequest, genericResponse);
      return testPromise.then(() => {
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
        assert.equal(genericResponse.address, '/changes-and-enquiries/payment/frequency/schedule');
      });
    });

    it('should return a the schedule with bad request global error', () => {
      nock('http://test-url/', reqHeaders).put(putChangePaymentFrequencyApiUri).reply(httpStatus.BAD_REQUEST, {});
      controller.postChangePaymentFrequency(paymentSchedulePostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(flash.type, 'error');
        assert.equal(flash.message, errorMessage.badRequest);
        assert.equal(genericResponse.locals.logMessage, '400 - 400 - {} - Requested on api/award/frequencychangeupdate');
        assert.equal(genericResponse.address, '/changes-and-enquiries/payment/frequency/schedule');
      });
    });

    it('should return a the schedule with other global error', () => {
      nock('http://test-url/', reqHeaders).put(putChangePaymentFrequencyApiUri).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
      controller.postChangePaymentFrequency(paymentSchedulePostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(flash.type, 'error');
        assert.equal(flash.message, errorMessage.other);
        assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on api/award/frequencychangeupdate');
        assert.equal(genericResponse.address, '/changes-and-enquiries/payment/frequency/schedule');
      });
    });
  });
});
