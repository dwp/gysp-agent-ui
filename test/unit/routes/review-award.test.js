const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const httpStatus = require('http-status-codes');

chai.use(chaiAsPromised);

const nock = require('nock');

nock.disableNetConnect();

const controller = require('../../../app/routes/review-award/functions');
const { promiseWait } = require('../../lib/unitHelper');

let testPromise;
let genericResponse;

const { assert } = chai;

const responseHelper = require('../../lib/responseHelper');
const claimData = require('../../lib/claimData');
const dataObjects = require('../../lib/formDataObjects');

const awardReviewTotalUri = '/api/hmrccalc/count/srb-review';
const awardUri = '/api/award';
const awardReviewUri = '/api/hmrccalc/next-srb';
const awardReviewBreakdownUri = '/api/award/srbpaymentbreakdown';
const awardAmountUpdateUri = '/api/award/srbamountsupdate';

const awardReviewTotalResponse = 50;

const validNextSrb = {
  nino: 'AA370773A',
  reasonForChange: 'REVISION OF ENTITLEMENT DUE TO CHANGE IN CONT/CREDIT POSITION',
  entitlementDate: '2018-11-09T12:27:48.795Z',
  newStatePensionAmount: 100.0,
  protectedPaymentAmount: 200.0,
  totalAmount: 300.0,
};

// Headers
const reqHeaders = { reqheaders: { agentRef: 'Test User', location: '123456', staffId: '12345678' } };

// Request Headers
const user = {
  cis: {
    givenname: 'Test', surname: 'User', SLOC: '123456', dwp_staffid: '12345678',
  },
};

// Requests
let validRequest = { session: {}, user: { ...user } };
const invalidRequest = { session: { }, user: { ...user } };

const emptyPostNewEntitlementDateRequest = { session: { award: claimData.validClaim() }, body: {} };
const validPostNewEntitlementDateRequest = { session: { award: claimData.validClaim() }, body: { dateYear: '2020', dateMonth: '01', dateDay: '01' } };

describe('Review award controller', () => {
  describe('getReviewAward function (GET /review-award)', () => {
    genericResponse = responseHelper.genericResponse();
    genericResponse.locals = responseHelper.localResponse(genericResponse);
    beforeEach(() => {
      testPromise = promiseWait();
    });

    it('should return view with total number of awards to review', () => {
      nock('http://test-url/', reqHeaders).get(awardReviewTotalUri).reply(200, awardReviewTotalResponse);
      controller.getReviewAward(validRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/review-award/index');
        assert.equal(genericResponse.data.total, awardReviewTotalResponse);
      });
    });

    it('should return error view when API returns none 200 state', () => {
      nock('http://test-url/', reqHeaders).get(awardReviewTotalUri).reply(500, {});
      controller.getReviewAward(validRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/error');
        assert.equal(genericResponse.data.status, '- Issue getting awards to review.');
        assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on cannot get review award total');
      });
    });
  });

  describe('getReviewReason function (GET /review-award/reason)', () => {
    genericResponse = responseHelper.genericResponse();
    genericResponse.locals = responseHelper.localResponse(genericResponse);

    beforeEach(() => {
      validRequest = { session: {}, user: { ...user } };
    });

    it('should return view with reason when receive 500 response from award api and 500 from award review', async () => {
      nock('http://test-url/', reqHeaders).get(awardReviewUri).reply(500, {});
      nock('http://test-url/').get(`${awardUri}/${claimData.validClaim().nino}`).reply(500, {});
      await controller.getReviewReason(validRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/error');
      assert.equal(genericResponse.data.status, '- There are no awards to review.');
      assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on /api/hmrccalc/next-srb');
    });

    it('should return view with reason when receive 200 response from award api but 500 from award review', async () => {
      nock('http://test-url/', reqHeaders).get(awardReviewUri).reply(500, {});
      nock('http://test-url/').get(`${awardUri}/${claimData.validClaim().nino}`).reply(200, claimData.validClaim());
      await controller.getReviewReason(validRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/error');
      assert.equal(genericResponse.data.status, '- There are no awards to review.');
      assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on /api/hmrccalc/next-srb');
    });

    it('should return view with reason when receive 500 response from award api but 200 from award review', async () => {
      nock('http://test-url/', reqHeaders).get(awardReviewUri).reply(200, validNextSrb);
      nock('http://test-url/').get(`${awardUri}/${claimData.validClaim().nino}`).reply(500, {});
      await controller.getReviewReason(validRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/error');
      assert.equal(genericResponse.data.status, '- There are no awards to review.');
      assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on /api/award/AA370773A');
    });

    it('should return view with reason when receive 200 response from both api\'s', async () => {
      nock('http://test-url/', reqHeaders).get(awardReviewUri).reply(200, validNextSrb);
      nock('http://test-url/').get(`${awardUri}/${claimData.validClaim().nino}`).reply(200, claimData.validClaim());
      await controller.getReviewReason(validRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/review-award/reason');
      assert.deepEqual(genericResponse.data.details, { reasonForChange: 'Change in cont/credit position' });
      assert.deepEqual(validRequest.session['review-award'], validNextSrb);
      assert.deepEqual(validRequest.session.award, claimData.validClaim());
    });
  });

  describe('getNewAward function (GET /review-award/new-award)', () => {
    genericResponse = responseHelper.genericResponse();
    genericResponse.locals = responseHelper.localResponse(genericResponse);

    beforeEach(() => {
      validRequest = { session: { 'review-award': validNextSrb, award: claimData.validClaim() }, user: { cis: { surname: 'User', givenname: 'Test' } } };
    });

    it('should return view with new award when all session data present', () => {
      controller.getNewAward(validRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/review-award/new-award');
    });

    it('should return error view when the session is invalid', () => {
      controller.getNewAward(invalidRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/error');
      assert.equal(genericResponse.data.status, '- Issue getting award to review.');
    });
  });

  describe('getPaymentSchedule function (GET /review-award/schedule)', () => {
    genericResponse = responseHelper.genericResponse();
    genericResponse.locals = responseHelper.localResponse(genericResponse);
    const validReviewAwardRequest = dataObjects.validReviewAwardPaymentScheduleRequest();
    const validReviewAwardWithAssetedEntitlementDateRequest = dataObjects.validReviewAwardPaymentScheduleAssetedEntitlementDateRequest();

    it('should return view with data when a 200 reponse from the API is received', async () => {
      nock('http://test-url/').get(awardReviewBreakdownUri)
        .query({
          inviteKey: validReviewAwardRequest.session.award.inviteKey,
          spAmount: validReviewAwardRequest.session['review-award'].newStatePensionAmount,
          protectedAmount: validReviewAwardRequest.session['review-award'].protectedPaymentAmount,
          entitlementDate: '2018-11-09',
        })
        .reply(200, dataObjects.validPaymentApiResponse());

      await controller.getPaymentSchedule(validReviewAwardRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/review-award/breakdown');
      assert.equal(JSON.stringify(genericResponse.data.details), JSON.stringify(dataObjects.validPaymentFormattedObject()));
    });

    it('should return view with data when a 200 reponse from the API is received with assserted entitlement date', async () => {
      nock('http://test-url/').get(awardReviewBreakdownUri)
        .query({
          inviteKey: validReviewAwardRequest.session.award.inviteKey,
          spAmount: validReviewAwardRequest.session['review-award'].newStatePensionAmount,
          protectedAmount: validReviewAwardRequest.session['review-award'].protectedPaymentAmount,
          entitlementDate: '2020-11-09',
        })
        .reply(200, dataObjects.validPaymentApiResponse());

      await controller.getPaymentSchedule(validReviewAwardWithAssetedEntitlementDateRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/review-award/breakdown');
      assert.equal(JSON.stringify(genericResponse.data.details), JSON.stringify(dataObjects.validPaymentFormattedObject()));
    });

    it('should return error view when no invite key exists in the session', async () => {
      await controller.getPaymentSchedule(dataObjects.invalidSessionPaymentRequest(), genericResponse);
      assert.equal(genericResponse.viewName, 'pages/error');
      assert.equal(genericResponse.data.status, '- Issue getting payment breakdown.');
    });

    it('should return error view when API returns 404 state', async () => {
      nock('http://test-url/').get(awardReviewBreakdownUri)
        .query({
          inviteKey: validReviewAwardRequest.session.award.inviteKey,
          spAmount: validReviewAwardRequest.session['review-award'].newStatePensionAmount,
          protectedAmount: validReviewAwardRequest.session['review-award'].protectedPaymentAmount,
          entitlementDate: '2018-11-09',
        })
        .reply(httpStatus.NOT_FOUND, {});
      await controller.getPaymentSchedule(validReviewAwardRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/error');
      assert.equal(genericResponse.data.status, '- Payment breakdown not found.');
      assert.equal(genericResponse.locals.logMessage, '404 - 404 - {} - Requested on /api/award/srbpaymentbreakdown?inviteKey=BLOG123456&spAmount=100&protectedAmount=200&entitlementDate=2018-11-09');
    });

    it('should return error view when API returns 500 state', async () => {
      nock('http://test-url/').get(awardReviewBreakdownUri)
        .query({
          inviteKey: validReviewAwardRequest.session.award.inviteKey,
          spAmount: validReviewAwardRequest.session['review-award'].newStatePensionAmount,
          protectedAmount: validReviewAwardRequest.session['review-award'].protectedPaymentAmount,
          entitlementDate: '2018-11-09',
        })
        .reply(httpStatus.INTERNAL_SERVER_ERROR, {});
      await controller.getPaymentSchedule(validReviewAwardRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/error');
      assert.equal(genericResponse.data.status, '- Issue getting payment breakdown.');
      assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on /api/award/srbpaymentbreakdown?inviteKey=BLOG123456&spAmount=100&protectedAmount=200&entitlementDate=2018-11-09');
    });
  });

  describe('postPaymentSchedule function (POST /review-award/schedule)', () => {
    genericResponse = responseHelper.genericResponse();
    genericResponse.locals = responseHelper.localResponse(genericResponse);
    const validPostRequest = dataObjects.validReviewAwardPaymentScheduleRequest();

    const flash = {
      type: '',
      message: '',
    };
    const flashMock = (type, message) => {
      flash.type = type;
      flash.message = message;
    };
    validPostRequest.flash = flashMock;

    it(`should return redirect with error when API returns ${httpStatus.BAD_REQUEST} state`, async () => {
      nock('http://test-url/').put(awardAmountUpdateUri).reply(httpStatus.BAD_REQUEST);
      await controller.postPaymentSchedule(validPostRequest, genericResponse);
      assert.equal(flash.type, 'error');
      assert.equal(flash.message, 'There has been a problem with the service, please go back and try again. This has been logged.');
      assert.equal(genericResponse.address, '/review-award/schedule');
      assert.equal(genericResponse.locals.logMessage, `${httpStatus.BAD_REQUEST} - ${httpStatus.BAD_REQUEST} - undefined - Requested on /api/award/srbamountsupdate`);
    });

    it(`should return redirect with error when API returns ${httpStatus.NOT_FOUND} state`, async () => {
      nock('http://test-url/').put(awardAmountUpdateUri).reply(httpStatus.NOT_FOUND);
      await controller.postPaymentSchedule(validPostRequest, genericResponse);
      assert.equal(flash.type, 'error');
      assert.equal(flash.message, 'There has been a problem - award not found. This has been logged.');
      assert.equal(genericResponse.address, '/review-award/schedule');
      assert.equal(genericResponse.locals.logMessage, `${httpStatus.NOT_FOUND} - ${httpStatus.NOT_FOUND} - undefined - Requested on /api/award/srbamountsupdate`);
    });

    it(`should return redirect with error when API returns ${httpStatus.INTERNAL_SERVER_ERROR} state`, async () => {
      nock('http://test-url/').put(awardAmountUpdateUri).reply(httpStatus.INTERNAL_SERVER_ERROR);
      await controller.postPaymentSchedule(validPostRequest, genericResponse);
      assert.equal(flash.type, 'error');
      assert.equal(flash.message, 'There is a problem with the service. This has been logged. Please try again later.');
      assert.equal(genericResponse.address, '/review-award/schedule');
      assert.equal(genericResponse.locals.logMessage, `${httpStatus.INTERNAL_SERVER_ERROR} - ${httpStatus.INTERNAL_SERVER_ERROR} - undefined - Requested on /api/award/srbamountsupdate`);
    });

    it(`should return redirect and session processed when API returns ${httpStatus.OK} state`, async () => {
      nock('http://test-url/').put(awardAmountUpdateUri).reply(httpStatus.OK);
      await controller.postPaymentSchedule(validPostRequest, genericResponse);
      assert.isUndefined(validPostRequest.session['review-award']);
      assert.isTrue(validPostRequest.session.awardReviewUserHasCompleted);
      assert.equal(genericResponse.address, '/review-award/complete');
    });
  });

  describe('getComplete function (POST /review-award/complete)', () => {
    it('should return view with key details and success panel when called', () => {
      const validReviewAwardRequest = dataObjects.validReviewAwardPaymentScheduleRequest();
      const keyDetailsResponse = {
        fullName: 'Joe Bloggs', nino: 'AA 37 07 73 A', status: { text: 'RECEIVING STATE PENSION', class: 'active' }, dateOfBirth: null,
      };
      controller.getComplete(validReviewAwardRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/review-award/complete');
      assert.deepEqual(genericResponse.data.keyDetails, keyDetailsResponse);
    });
  });

  describe('getNewEntitlementDate function (GET /review-award/entitlement-date)', () => {
    beforeEach(() => {
      validRequest = { session: { award: claimData.validClaim() }, user: { cis: { surname: 'User', givenname: 'Test' } } };
    });

    it('should display form when page when requested', () => {
      controller.getNewEntitlementDate(validRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/review-award/date');
    });
  });

  describe('postNewEntitlementDate function (POST /review-award/entitlement-date)', () => {
    it('should return view name when called with invalid post with empty data', () => {
      controller.postNewEntitlementDate(emptyPostNewEntitlementDateRequest, genericResponse);
      assert.equal(Object.keys(genericResponse.data.errors).length, 4);
      assert.equal(genericResponse.viewName, 'pages/review-award/date');
    });

    it('should return view name when called with invalid post with errors', () => {
      controller.postNewEntitlementDate(validPostNewEntitlementDateRequest, genericResponse);
      assert.deepEqual(validPostNewEntitlementDateRequest.session['review-award-date'], validPostNewEntitlementDateRequest.body);
      assert.equal(genericResponse.address, '/review-award/new-award');
    });
  });
});
