const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const nock = require('nock');

nock.disableNetConnect();

const controller = require('../../../app/routes/process-claim-complete/functions');
const { promiseWait } = require('../../lib/unitHelper');

let testPromise;
let genericResponse;

const { assert } = chai;

const responseHelper = require('../../lib/responseHelper');

const validRequest = {
  session: {
    processClaim: { userHasCompleted: true },
  },
};

describe('Process claim controller', () => {
  describe('getProcessClaim function (GET /process-claim/complete)', () => {
    genericResponse = responseHelper.genericResponse();
    genericResponse.locals = responseHelper.localResponse(genericResponse);
    beforeEach(() => {
      testPromise = promiseWait();
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
