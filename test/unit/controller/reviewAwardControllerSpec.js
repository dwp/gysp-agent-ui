const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const nock = require('nock');

nock.disableNetConnect();

const controller = require('../../../app/routes/review-award/functions');

let testPromise;
let genericResponse;

const { assert } = chai;

const responseHelper = require('../../../test/lib/responseHelper');
const claimData = require('../../lib/claimData');

const awardReviewTotalUri = '/api/hmrccalc/count/srb-review';
const awardUri = '/api/award';
const awardReviewUri = '/api/hmrccalc/next-srb';

const awardReviewTotalResponse = 50;

const validNextSrb = {
  nino: 'AA370773A',
  reasonForChange: 'REVISION OF ENTITLEMENT DUE TO CHANGE IN CONT/CREDIT POSITION',
  entitlementDate: '2018-11-09T12:27:48.795Z',
  newStatePensionAmount: 100.0,
  protectedPaymentAmount: 200.0,
  totalAmount: 300.0,
};

let validRequest = { session: {}, user: { cis: { surname: 'User', givenname: 'Test' } } };

describe('Review award controller', () => {
  describe('getReviewAward function (GET /review-award)', () => {
    genericResponse = responseHelper.genericResponse();
    genericResponse.locals = responseHelper.localResponse(genericResponse);
    beforeEach(() => {
      testPromise = new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 20);
      });
    });

    it('should return view with total number of awards to review', () => {
      nock('http://test-url/').get(awardReviewTotalUri).reply(200, awardReviewTotalResponse);
      controller.getReviewAward(validRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/review-award/index');
        assert.equal(genericResponse.data.total, awardReviewTotalResponse);
      });
    });

    it('should return error view when API returns none 200 state', () => {
      nock('http://test-url/').get(awardReviewTotalUri).reply(500, {});
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
      validRequest = { session: {}, user: { cis: { surname: 'User', givenname: 'Test' } } };
    });

    it('should return view with reason when receive 500 response from award api and 500 from award review', async () => {
      nock('http://test-url/').get(awardReviewUri).reply(500, {});
      nock('http://test-url/').get(`${awardUri}/${claimData.validClaim().nino}`).reply(500, {});
      await controller.getReviewReason(validRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/error');
      assert.equal(genericResponse.data.status, '- There are no awards to review.');
      assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on /api/hmrccalc/next-srb');
    });

    it('should return view with reason when receive 200 response from award api but 500 from award review', async () => {
      nock('http://test-url/').get(awardReviewUri).reply(500, {});
      nock('http://test-url/').get(`${awardUri}/${claimData.validClaim().nino}`).reply(200, claimData.validClaim());
      await controller.getReviewReason(validRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/error');
      assert.equal(genericResponse.data.status, '- There are no awards to review.');
      assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on /api/hmrccalc/next-srb');
    });

    it('should return view with reason when receive 500 response from award api but 200 from award review', async () => {
      nock('http://test-url/').get(awardReviewUri).reply(200, validNextSrb);
      nock('http://test-url/').get(`${awardUri}/${claimData.validClaim().nino}`).reply(500, {});
      await controller.getReviewReason(validRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/error');
      assert.equal(genericResponse.data.status, '- There are no awards to review.');
      assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on /api/award/AA370773A');
    });

    it('should return view with reason when receive 200 response from both api\'s', async () => {
      nock('http://test-url/').get(awardReviewUri).reply(200, validNextSrb);
      nock('http://test-url/').get(`${awardUri}/${claimData.validClaim().nino}`).reply(200, claimData.validClaim());
      await controller.getReviewReason(validRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/review-award/reason');
      assert.deepEqual(genericResponse.data.details, { reasonForChange: 'Change in cont/credit position' });
      assert.deepEqual(validRequest.session['review-award'], validNextSrb);
      assert.deepEqual(validRequest.session.award, claimData.validClaim());
    });
  });
});
