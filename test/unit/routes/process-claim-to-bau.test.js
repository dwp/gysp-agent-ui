const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const nock = require('nock');

nock.disableNetConnect();

const controller = require('../../../app/routes/process-claim-to-bau/functions');
const { promiseWait } = require('../../lib/unitHelper');
const kongData = require('../../lib/kongData');

let testPromise;
let genericResponse;

const { assert } = chai;

const responseHelper = require('../../lib/responseHelper');

const allAwardsToRobotUri = '/api/award/sendallbacktorobot';
const awardToRobotUri = '/api/award/sendbacktorobot';

const flash = {
  type: '',
  message: '',
};
const flashMock = (type, message) => {
  flash.type = type;
  flash.message = message;
};

const validAllBAURequest = {
  flash: flashMock,
  ...kongData(),
};

const validSingleBAURequest = {
  flash: flashMock,
  session: {
    processClaim: {
      claimDetail: { inviteKey: 'BLOGGS1234' },
    },
  },
  ...kongData(),
};

const invalidSingleBAURequest = {
  session: {},
  ...kongData(),
};

describe('Process claim send to BAU controller', () => {
  describe('getAllClaimsToBau function (GET /process-claim/all-claims-to-bau)', () => {
    genericResponse = responseHelper.genericResponse();
    genericResponse.locals = responseHelper.localResponse(genericResponse);
    beforeEach(() => {
      testPromise = promiseWait();
    });

    it('should return and redirect back when API returns a 200 response', () => {
      nock('http://test-url/').put(allAwardsToRobotUri).reply(200, {});
      controller.getAllClaimsToBau(validAllBAURequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.address, '/process-claim');
      });
    });

    it('should return error view when API returns 404 status', () => {
      nock('http://test-url/').put(allAwardsToRobotUri).reply(404, {});
      controller.getAllClaimsToBau(validAllBAURequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(flash.type, 'error');
        assert.equal(flash.message, 'There are no claims to send to BAU');
        assert.equal(genericResponse.address, '/process-claim');
      });
    });

    it('should return error view when API returns 500 status', () => {
      nock('http://test-url/').put(allAwardsToRobotUri).reply(500, {});
      controller.getAllClaimsToBau(validAllBAURequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/error');
        assert.equal(genericResponse.data.status, '- Issue sending all available claims to BAU.');
        assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on cannot send all available claims to BAU');
      });
    });
  });

  describe('getClaimToBau function (GET /process-claim/claim-to-bau)', () => {
    genericResponse = responseHelper.genericResponse();
    genericResponse.locals = responseHelper.localResponse(genericResponse);
    beforeEach(() => {
      testPromise = promiseWait();
    });

    it('should return and redirect back when API returns a 200 response', () => {
      nock('http://test-url/').put(awardToRobotUri).reply(200, {});
      controller.getClaimToBau(validSingleBAURequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.address, '/process-claim');
      });
    });

    it('should return error view when session data not present', () => {
      nock('http://test-url/').put(awardToRobotUri).reply(500, {});
      controller.getClaimToBau(invalidSingleBAURequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/error');
        assert.equal(genericResponse.data.status, '- Issue sending claim to BAU.');
      });
    });

    it('should return error view when API returns 404 status', () => {
      nock('http://test-url/').put(awardToRobotUri).reply(404, {});
      controller.getClaimToBau(validSingleBAURequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.address, '/process-claim');
      });
    });

    it('should return error view when API returns 500 status', () => {
      nock('http://test-url/').put(awardToRobotUri).reply(500, {});
      controller.getClaimToBau(validSingleBAURequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/error');
        assert.equal(genericResponse.data.status, '- Issue sending claim to BAU.');
        assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on cannot send claim to BAU');
      });
    });
  });
});
