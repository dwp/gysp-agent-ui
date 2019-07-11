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

const awardReviewTotalUri = '/api/hmrccalc/count/srb-review';

const awardReviewTotalResponse = 50;

const validRequest = { session: {}, user: { cis: { surname: 'User', givenname: 'Test' } } };

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
});
