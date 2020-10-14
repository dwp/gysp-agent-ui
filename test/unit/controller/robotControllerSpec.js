const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const httpStatus = require('http-status-codes');

const nock = require('nock');

nock.disableNetConnect();

const claimController = require('../../../app/routes/robot/functions');
const { promiseWait } = require('../../lib/unitHelper');

let testPromise;
let genericResponse;

const { assert } = chai;

const responseHelper = require('../../../test/lib/responseHelper');

const emptyPost = { body: { accessKey: '' }, headers: { cookie: 'test=test;staff_id=test@test.com;' } };
const nextClaimEmptyPost = { body: { accessKey: '' }, headers: { cookie: 'test=test;staff_id=test@test.com;' } };
const nextClaimValidPost = { body: { accessKey: 'U2FsdGVkX1+dF1IUW1o0qywf8/3IGtoXEb9e5VlKlv4=' }, headers: { cookie: 'test=test;staff_id=test@test.com;' } };
const nextClaimInvalidPost = { body: { accessKey: 'invalid' }, headers: { cookie: 'test=test;staff_id=test@test.com;' } };
const claimInErrorEmptyPost = { body: { accessKey: '', inviteKey: '', message: 'Test' }, fullUrl: 'test' };
const claimInErrorValidPost = { body: { accessKey: 'U2FsdGVkX1+dF1IUW1o0qywf8/3IGtoXEb9e5VlKlv4=', inviteKey: 'POTT1234', message: 'Test' }, fullUrl: 'test' };
const claimInErrorInvalidPost = { body: { accessKey: 'invalid', inviteKey: 'POTT1234', message: 'Test' }, fullUrl: 'test' };

const error500Response = { message: 'This is an error message' };
const error404ResponseHeader = { claimmessage: 'This is a claimmessage' };
const errorOtherErrorResponse = { message: 'Error - could not get claim data' };
const errorNoStatus = { message: 'Can\'t connect to backend' };
const validationErrorMessage = 'Error - Please correct the issues below.';
const accessKeyErrorMessage = 'Error - Incorrect Access key.';
const successResponse = { test: 'test' };

const nextPendingClaim = '/api/claim/nextpendingclaim';
const claimInError = '/api/claim/claiminerror';

describe('Robot controller ', () => {
  describe(' getClaim function ', () => {
    it('should return next claim view when requested by the user', () => {
      claimController.getClaim(emptyPost, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/robot/claim');
    });
  });

  describe(' postClaim function ', () => {
    genericResponse = responseHelper.genericResponse();
    genericResponse.locals = {
      traceID: '',
      logMessage: '',
      robotSecret: 'test',
      robotKey: 'test',
      agentGateway: 'http://test-url/',
      logger: {
        error(traceID, errorTxt) {
          genericResponse.locals.traceID = traceID;
          genericResponse.locals.logMessage = errorTxt;
        },
      },
    };
    beforeEach(() => {
      testPromise = promiseWait();
    });

    it('should return view with error when API returns 500 state', () => {
      nock('http://test-url/').get(nextPendingClaim).reply(httpStatus.INTERNAL_SERVER_ERROR, error500Response);
      claimController.postClaim(nextClaimValidPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.details.result, JSON.stringify(error500Response));
        assert.equal(genericResponse.data.globalError, error500Response.message);
        assert.equal(genericResponse.viewName, 'pages/robot/claim');
      });
    });

    it('should return view with error when API returns 404 state', () => {
      nock('http://test-url/').get(nextPendingClaim).reply(httpStatus.NOT_FOUND, {}, error404ResponseHeader);
      claimController.postClaim(nextClaimValidPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.details.result, JSON.stringify({ message: error404ResponseHeader.claimmessage }));
        assert.equal(genericResponse.data.globalError, error404ResponseHeader.claimmessage);
        assert.equal(genericResponse.viewName, 'pages/robot/claim');
      });
    });

    it('should return view with error when API returns at status code that is not 200, 404 or 500', () => {
      nock('http://test-url/').get(nextPendingClaim).reply(httpStatus.BAD_GATEWAY, {});
      claimController.postClaim(nextClaimValidPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.details.result, JSON.stringify(errorOtherErrorResponse));
        assert.equal(genericResponse.data.globalError, errorOtherErrorResponse.message);
        assert.equal(genericResponse.viewName, 'pages/robot/claim');
      });
    });

    it('should return view with error when API returns no status code.', () => {
      nock('http://test-url/').get(nextPendingClaim);
      claimController.postClaim(nextClaimValidPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.details.result, JSON.stringify(errorNoStatus));
        assert.equal(genericResponse.data.globalError, errorNoStatus.message);
        assert.equal(genericResponse.viewName, 'pages/robot/claim');
      });
    });

    it('should return view with error when access key is empty', () => {
      claimController.postClaim(nextClaimEmptyPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.globalError, validationErrorMessage);
        assert.equal(genericResponse.viewName, 'pages/robot/claim');
      });
    });

    it('should return view with error when access key is incorrect', () => {
      claimController.postClaim(nextClaimInvalidPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.globalError, accessKeyErrorMessage);
        assert.equal(genericResponse.viewName, 'pages/robot/claim');
      });
    });

    it('should return view when API returns data.', () => {
      nock('http://test-url/').get(nextPendingClaim).reply(httpStatus.OK, successResponse);
      claimController.postClaim(nextClaimEmptyPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.globalError, validationErrorMessage);
        assert.equal(genericResponse.viewName, 'pages/robot/claim');
      });
    });
  });

  describe(' getClaimInError function ', () => {
    genericResponse = responseHelper.genericResponse();
    genericResponse.locals = {
      traceID: '',
      logMessage: '',
      robotSecret: 'test',
      robotKey: 'test',
      agentGateway: 'http://test-url/',
      logger: {
        error(traceID, errorTxt) {
          genericResponse.locals.traceID = traceID;
          genericResponse.locals.logMessage = errorTxt;
        },
      },
    };
    beforeEach(() => {
      testPromise = promiseWait();
    });

    it('should return view with error when API returns 404 state', () => {
      nock('http://test-url/').put(claimInError).reply(httpStatus.NOT_FOUND, {});
      claimController.postClaimInError(claimInErrorValidPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.globalError, 'Error - Claim not found for invite key');
        assert.equal(genericResponse.viewName, 'pages/robot/claim-in-error');
      });
    });

    it('should return view with error when API returns 500 state', () => {
      nock('http://test-url/').put(claimInError).reply(httpStatus.CONFLICT, {});
      claimController.postClaimInError(claimInErrorValidPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.globalError, 'Error - Current claim status is not in SUBMITTED state');
        assert.equal(genericResponse.viewName, 'pages/robot/claim-in-error');
      });
    });

    it('should return view with error when API returns at status code that is not 200, 404 or 500', () => {
      nock('http://test-url/').put(claimInError).reply(httpStatus.BAD_GATEWAY, {});
      claimController.postClaimInError(claimInErrorValidPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.globalError, 'Error - Could not update claim');
        assert.equal(genericResponse.viewName, 'pages/robot/claim-in-error');
      });
    });

    it('should return view with error when API returns no status code.', () => {
      nock('http://test-url/').put(claimInError);
      claimController.postClaimInError(claimInErrorValidPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.globalError, 'Can\'t connect to backend');
        assert.equal(genericResponse.viewName, 'pages/robot/claim-in-error');
      });
    });

    it('should return error when invalid data is supplied.', () => {
      claimController.postClaimInError(claimInErrorEmptyPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.globalError, 'Error - Please correct the issues below.');
        assert.equal(genericResponse.viewName, 'pages/robot/claim-in-error');
      });
    });

    it('should return error when invalid access key is supplied.', () => {
      claimController.postClaimInError(claimInErrorInvalidPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.globalError, accessKeyErrorMessage);
        assert.equal(genericResponse.viewName, 'pages/robot/claim-in-error');
      });
    });

    it('should return view when API returns data.', () => {
      nock('http://test-url/').put(claimInError).reply(httpStatus.OK, successResponse);
      claimController.postClaimInError(claimInErrorValidPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.globalSuccess, 'Success - Claim in error has been added');
        assert.equal(genericResponse.viewName, 'pages/robot/claim-in-error');
      });
    });
  });
});
