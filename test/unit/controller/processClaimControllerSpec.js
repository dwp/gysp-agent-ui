const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const nock = require('nock');

nock.disableNetConnect();

const controller = require('../../../app/routes/process-claim/functions');
const { promiseWait } = require('../../lib/unitHelper');

let testPromise;
let genericResponse;

const { assert } = chai;

const responseHelper = require('../../../test/lib/responseHelper');

const awardTotalUri = '/api/award/count/daily-awards';

const awardTotalResponse = 50;

const validRequest = { session: {}, user: { cis: { surname: 'User', givenname: 'Test' } } };
const validWithDetailRequest = { session: { processClaim: { foo: 'bar' } }, user: { cis: { surname: 'User', givenname: 'Test' } } };

describe('Process claim controller', () => {
  describe('getProcessClaim function (GET /process-claim)', () => {
    genericResponse = responseHelper.genericResponse();
    genericResponse.locals = responseHelper.localResponse(genericResponse);
    beforeEach(() => {
      testPromise = promiseWait();
    });

    it('should return view with total number of claims from API', () => {
      nock('http://test-url/').get(awardTotalUri).reply(200, awardTotalResponse);
      controller.getProcessClaim(validRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/process-claim/index');
        assert.equal(genericResponse.data.total, awardTotalResponse);
      });
    });

    it('should return view with total number of claims from API with no session', () => {
      nock('http://test-url/').get(awardTotalUri).reply(200, awardTotalResponse);
      controller.getProcessClaim(validWithDetailRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/process-claim/index');
        assert.equal(validWithDetailRequest.session.processClaim, undefined);
        assert.equal(genericResponse.data.total, awardTotalResponse);
      });
    });

    it('should return error view when API returns none 200 state', () => {
      nock('http://test-url/').get(awardTotalUri).reply(500, {});
      controller.getProcessClaim(validRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/error');
        assert.equal(genericResponse.data.status, '- Issue getting claim total.');
        assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on cannot get process claim total');
      });
    });
  });
});
