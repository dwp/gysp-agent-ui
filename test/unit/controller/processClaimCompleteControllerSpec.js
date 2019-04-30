const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const nock = require('nock');

nock.disableNetConnect();

const controller = require('../../../app/routes/process-claim-complete/functions');

let testPromise;
let genericResponse;

const { assert } = chai;

const responseHelper = require('../../../test/lib/responseHelper');

const validRequest = { session: { processClaim: { userHasCompleted: true } }, user: { username: 'test@test.com' } };

describe('Process claim controller', () => {
  describe('getProcessClaim function (GET /process-claim/complete)', () => {
    genericResponse = responseHelper.genericResponse();
    genericResponse.locals = responseHelper.localResponse(genericResponse);
    beforeEach(() => {
      testPromise = new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 20);
      });
    });

    it('should return view when user has completed', () => {
      controller.getProcessClaimComplete(validRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(Object.keys(validRequest.session.processClaim).length, 1);
        assert.equal(genericResponse.viewName, 'pages/process-claim-complete/index');
      });
    });
  });
});
