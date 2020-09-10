const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const httpStatus = require('http-status-codes');

chai.use(chaiAsPromised);

const nock = require('nock');

nock.disableNetConnect();

const controller = require('../../../app/routes/process-claim-payment/functions');

let testPromise;
let genericResponse;

const { assert } = chai;

const responseHelper = require('../../lib/responseHelper');
const dataObjects = require('../lib/formDataObjects');

const awardPaymentUri = '/api/award/paymentbreakdown';
const awardCreateScheduleUri = '/api/award/createschedule';

const errorMessage = {
  status500: 'Try again or send claim to BAU',
  statusOther: 'Error - connection refused.',
  statusNone: 'Error - could not create letter.',
};

describe('Process claim payment controller', () => {
  beforeEach(() => {
    testPromise = new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 50);
    });
  });
  describe('getProcessClaimPayment function (GET /process-claim/payment)', () => {
    genericResponse = responseHelper.genericResponse();
    genericResponse.locals = responseHelper.localResponse(genericResponse);
    const validRequest = dataObjects.validProcessClaimPaymentRequest();

    it('should return view with data when a 200 response from the API is received', () => {
      nock('http://test-url/').get(`${awardPaymentUri}/${validRequest.session.processClaim.claimDetail.inviteKey}`)
        .reply(200, dataObjects.validPaymentApiResponse());
      controller.getProcessClaimPayment(validRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/process-claim-payment/index');
        assert.equal(JSON.stringify(genericResponse.data.details), JSON.stringify(dataObjects.validPaymentFormattedObject()));
      });
    });

    it('should return error view when no invite key exists in the session', () => {
      controller.getProcessClaimPayment(dataObjects.invalidSessionPaymentRequest(), genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.currentStatus, httpStatus.INTERNAL_SERVER_ERROR);
        assert.equal(genericResponse.viewName, 'pages/error');
        assert.equal(genericResponse.data.status, '- Issue getting payment breakdown.');
      });
    });

    it('should return error view when API returns 404 state', () => {
      nock('http://test-url/').get(`${awardPaymentUri}/${validRequest.session.processClaim.claimDetail.inviteKey}`).reply(404, {});
      controller.getProcessClaimPayment(validRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/error');
        assert.equal(genericResponse.data.status, '- Payment breakdown not found.');
        assert.equal(genericResponse.locals.logMessage, '404 - 404 - {} - Requested on payment breakdown not found');
      });
    });

    it('should return error view when API returns 500 state', () => {
      nock('http://test-url/').get(`${awardPaymentUri}/${validRequest.session.processClaim.claimDetail.inviteKey}`).reply(500, {});
      controller.getProcessClaimPayment(validRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/error');
        assert.equal(genericResponse.data.status, '- Issue getting payment breakdown.');
        assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on cannot get claim payment detail');
      });
    });
  });
  describe('postProcessClaimPayment function (POST /process-claim/payment)', () => {
    const validPostRequest = dataObjects.validProcessClaimPaymentFormRequest();
    const invalidPostRequest = dataObjects.invalidProcessClaimPaymentFormRequest();

    it('should return error view when invalid post request is submitted', () => {
      controller.postProcessClaimPayment(invalidPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.currentStatus, httpStatus.INTERNAL_SERVER_ERROR);
        assert.equal(genericResponse.viewName, 'pages/error');
        assert.equal(genericResponse.data.status, '- Issue creating letter.');
      });
    });

    it('should return view with error when API returns 500 state', () => {
      nock('http://test-url/').post(awardCreateScheduleUri).reply(httpStatus.INTERNAL_SERVER_ERROR);
      nock('http://test-url/').get(`${awardPaymentUri}/${validPostRequest.session.processClaim.claimDetail.inviteKey}`)
        .reply(httpStatus.OK, dataObjects.validPaymentApiResponse());
      controller.postProcessClaimPayment(validPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.globalError, errorMessage.status500);
        assert.equal(genericResponse.viewName, 'pages/process-claim-payment/index');
      });
    });

    it('should return view with error when API returns at status code that is not 200 or 500', () => {
      nock('http://test-url/').post(awardCreateScheduleUri).reply(httpStatus.BAD_GATEWAY, {});
      nock('http://test-url/').get(`${awardPaymentUri}/${validPostRequest.session.processClaim.claimDetail.inviteKey}`)
        .reply(httpStatus.OK, dataObjects.validPaymentApiResponse());
      controller.postProcessClaimPayment(validPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.globalError, errorMessage.statusOther);
        assert.equal(genericResponse.viewName, 'pages/process-claim-payment/index');
      });
    });
    it('should return view with error when API returns no status code.', () => {
      nock('http://test-url/').post(awardCreateScheduleUri);
      nock('http://test-url/').get(`${awardPaymentUri}/${validPostRequest.session.processClaim.claimDetail.inviteKey}`)
        .reply(httpStatus.OK, dataObjects.validPaymentApiResponse());
      controller.postProcessClaimPayment(validPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.globalError, errorMessage.statusNone);
        assert.equal(genericResponse.viewName, 'pages/process-claim-payment/index');
      });
    });

    it('should return redirect when 200 received from the API.', () => {
      nock('http://test-url/').post(awardCreateScheduleUri).reply(httpStatus.OK);
      controller.postProcessClaimPayment(validPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.address, '/process-claim/complete');
        assert.equal(Object.keys(validPostRequest.session.processClaim).length, 1);
        assert.equal(validPostRequest.session.processClaim.userHasCompleted, true);
      });
    });
  });
});
