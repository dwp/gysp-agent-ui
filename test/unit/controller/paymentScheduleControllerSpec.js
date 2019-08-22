const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const httpStatus = require('http-status-codes');

chai.use(chaiAsPromised);

const nock = require('nock');

nock.disableNetConnect();

const controller = require('../../../app/routes/changes-enquiries/payment-schedule/functions');

let testPromise;
let genericResponse;

const { assert } = chai;

const responseHelper = require('../../lib/responseHelper');
const dataObjects = require('../lib/formDataObjects');
const claimData = require('../../lib/claimData');

const paymentScheduleRequest = { session: { searchedNino: 'AA370773A', awardDetails: claimData.validClaim() } };

const paymentScheduleUri = '/api/payment/paymentbreakdown';

describe('Payment schedule controller', () => {
  beforeEach(() => {
    testPromise = new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 50);
    });
  });
  describe('getPaymentSchedule function (GET /changes-enquiries/payment/schedule)', () => {
    genericResponse = responseHelper.genericResponse();
    genericResponse.locals = responseHelper.localResponse(genericResponse);

    it('should return view with data when a 200 reponse from the API is received', () => {
      nock('http://test-url/').get(`${paymentScheduleUri}/${paymentScheduleRequest.session.searchedNino}`)
        .reply(200, dataObjects.validPaymentApiResponse());
      controller.getPaymentSchedule(paymentScheduleRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/payment-schedule/index');
        assert.equal(JSON.stringify(genericResponse.data.details), JSON.stringify(dataObjects.validPaymentFormattedObject()));
      });
    });

    it('should return error view when no invite key exists in the session', () => {
      controller.getPaymentSchedule(dataObjects.invalidSessionPaymentRequest(), genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.currentStatus, httpStatus.INTERNAL_SERVER_ERROR);
        assert.equal(genericResponse.viewName, 'pages/error');
        assert.equal(genericResponse.data.status, '- Issue getting payment schedule.');
      });
    });

    it('should return error view when API returns 404 state', () => {
      nock('http://test-url/').get(`${paymentScheduleUri}/${paymentScheduleRequest.session.searchedNino}`).reply(404, {});
      controller.getPaymentSchedule(paymentScheduleRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/error');
        assert.equal(genericResponse.data.status, '- Payment schedule not found.');
        assert.equal(genericResponse.locals.logMessage, '404 - 404 - {} - Requested on payment schedule not found');
      });
    });

    it('should return error view when API returns 500 state', () => {
      nock('http://test-url/').get(`${paymentScheduleUri}/${paymentScheduleRequest.session.searchedNino}`).reply(500, {});
      controller.getPaymentSchedule(paymentScheduleRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/error');
        assert.equal(genericResponse.data.status, '- Issue getting payment schedule.');
        assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on cannot get payment schedule');
      });
    });
  });
});
