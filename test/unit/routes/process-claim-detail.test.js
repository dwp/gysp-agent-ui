const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const nock = require('nock');

nock.disableNetConnect();

const controller = require('../../../app/routes/process-claim-detail/functions');
const { promiseWait } = require('../../lib/unitHelper');
const kongData = require('../../lib/kongData');

let testPromise;
let genericResponse;

const { assert } = chai;

const responseHelper = require('../../lib/responseHelper');

const awardDetailUri = '/api/award/nextaward';

const awardDetailResponse = {
  nino: 'AA370773A',
  dob: '1953-01-15T00:00:00.000Z',
  firstName: 'Joe',
  surname: 'Bloggs',
};
const awardDetailViewDetails = {
  nino: 'AA370773A',
  name: 'Joe Bloggs',
  dob: '15/01/1953',
};

const validRequest = { session: {}, ...kongData() };

describe('Process claim detail controller', () => {
  describe('getProcessClaimDetailsCache function (GET /process-claim/detail)', () => {
    genericResponse = responseHelper.genericResponse();
    genericResponse.locals = responseHelper.localResponse(genericResponse);
    beforeEach(() => {
      testPromise = promiseWait();
    });

    it('should return view when API returns none 404 state', () => {
      nock('http://test-url/').get(awardDetailUri).reply(404, {});
      controller.getProcessClaimDetailCache(validRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/process-claim-detail/index');
      });
    });

    it('should return error view when API returns none 200 state', () => {
      nock('http://test-url/').get(awardDetailUri).reply(500, {});
      controller.getProcessClaimDetailCache(validRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/error');
        assert.equal(genericResponse.data.status, '- Issue getting claim detail.');
        assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on cannot get claim detail');
      });
    });

    it('should return view with view data from API', () => {
      nock('http://test-url/').get(awardDetailUri).reply(200, awardDetailResponse);
      controller.getProcessClaimDetailCache(validRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/process-claim-detail/index');
        assert.equal(JSON.stringify(genericResponse.data.details), JSON.stringify(awardDetailViewDetails));
        assert.equal(JSON.stringify(validRequest.session.processClaim.claimDetail), JSON.stringify(awardDetailResponse));
      });
    });

    it('should return view with view data from cache', () => {
      controller.getProcessClaimDetailCache(validRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/process-claim-detail/index');
        assert.equal(JSON.stringify(genericResponse.data.details), JSON.stringify(awardDetailViewDetails));
      });
    });
  });
});
