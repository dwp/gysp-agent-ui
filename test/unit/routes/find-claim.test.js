const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const httpStatus = require('http-status-codes');

const nock = require('nock');

nock.disableNetConnect();

const findClaimController = require('../../../app/routes/find-claim/functions');
const { promiseWait } = require('../../lib/unitHelper');

let testPromise;
let genericResponse;

const { assert } = chai;

const responseHelper = require('../../lib/responseHelper');

const emptyPost = { body: { search: '' } };
const findClaimValidPost = { body: { search: 'InviteKey' } };

const error500Message = 'Error - There has been an internal sever error, try again';
const error404ResponseHeader = { message: 'Claim not found' };
const errorOtherErrorResponse = 'Error - could not get claim data';
const errorNoStatus = 'Can\'t connect to backend';
const successResponse = {
  claimReceivedDate: '2018-03-09T12:37:41.650Z', fullName: 'Joe Bloggs', identifier: 'InviteKey', inviteKey: 'InviteKey', disableRemoveQueueButton: true,
};

const claimSearch = '/api/claim/search';

describe('Find Claim controller ', () => {
  describe(' getFindClaim function ', () => {
    it('should return search view when requested by the user', () => {
      findClaimController.getFindClaim(emptyPost, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/find-claim/search');
    });
  });

  describe(' postFindClaim function ', () => {
    genericResponse = responseHelper.genericResponse();
    genericResponse.locals = {
      traceID: '',
      logMessage: '',
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
      nock('http://test-url/').get(`${claimSearch}/${findClaimValidPost.body.search}`).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
      findClaimController.postFindClaim(findClaimValidPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.globalError, error500Message);
        assert.equal(genericResponse.data.details.search, findClaimValidPost.body.search);
        assert.equal(genericResponse.viewName, 'pages/find-claim/search');
      });
    });

    it('should return view with no results when API returns 404 state', () => {
      nock('http://test-url/').get(`${claimSearch}/${findClaimValidPost.body.search}`).reply(httpStatus.NOT_FOUND, {}, error404ResponseHeader);
      findClaimController.postFindClaim(findClaimValidPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.details.noResult, true);
        assert.equal(genericResponse.data.details.search, findClaimValidPost.body.search);
        assert.equal(genericResponse.viewName, 'pages/find-claim/search');
      });
    });

    it('should return view with error when API returns at status code that is not 200, 404 or 500', () => {
      nock('http://test-url/').get(`${claimSearch}/${findClaimValidPost.body.search}`).reply(httpStatus.BAD_GATEWAY, {});
      findClaimController.postFindClaim(findClaimValidPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.globalError, errorOtherErrorResponse);
        assert.equal(genericResponse.data.details.search, findClaimValidPost.body.search);
        assert.equal(genericResponse.viewName, 'pages/find-claim/search');
      });
    });

    it('should return view with error when API returns no status code.', () => {
      nock('http://test-url/').get(`${claimSearch}/${findClaimValidPost.body.search}`);
      findClaimController.postFindClaim(findClaimValidPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.globalError, errorNoStatus);
        assert.equal(genericResponse.data.details.search, findClaimValidPost.body.search);
        assert.equal(genericResponse.viewName, 'pages/find-claim/search');
      });
    });

    it('should return view when API returns data.', () => {
      nock('http://test-url/').get(`${claimSearch}/${findClaimValidPost.body.search}`).reply(httpStatus.OK, successResponse);
      findClaimController.postFindClaim(findClaimValidPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(JSON.stringify(genericResponse.data.details.result), JSON.stringify(successResponse));
        assert.equal(genericResponse.data.details.search, findClaimValidPost.body.search);
        assert.equal(genericResponse.viewName, 'pages/find-claim/search');
      });
    });
  });
});
