const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const httpStatus = require('http-status-codes');

const nock = require('nock');

nock.disableNetConnect();

const findSomeoneController = require('../../../app/routes/find-someone/functions');
const claimData = require('../../lib/claimData');

let testPromise;
let genericResponse;

const { assert } = chai;

const responseHelper = require('../../lib/responseHelper');

const emptyPost = {};
const findSomeoneValidPost = { session: {}, body: { fullName: 'Joe Bloggs', nino: 'AA370773A' } };

const error500Message = 'Error - There has been an internal sever error, try again';
const errorOtherErrorResponse = 'Error - could not get citizen data';
const errorNoStatus = 'Can\'t connect to backend';

const findSomeoneSearch = '/api/award';

const validGetSearchResultRequest = {
  session: {
    awardDetails: {
      nino: 'AA111111A',
      firstName: 'Joe',
      surname: 'Bloggs',
      awardStatus: 'RECEIVING STATE PENSION',
    },
  },
};

describe('Find someone controller ', () => {
  describe(' getFindSomeone function ', () => {
    it('should return search view when requested by the user', () => {
      findSomeoneController.getFindSomeone(emptyPost, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/find-someone/search');
    });
  });

  describe(' postFindSomeone function ', () => {
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
      testPromise = new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 20);
      });
    });

    it('should return view with error when API returns 500 state', () => {
      nock('http://test-url/').get(`${findSomeoneSearch}/${findSomeoneValidPost.body.nino}`).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
      findSomeoneController.postFindSomeone(findSomeoneValidPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.globalError, error500Message);
        assert.equal(genericResponse.data.details.nino, findSomeoneValidPost.body.nino);
        assert.equal(genericResponse.viewName, 'pages/find-someone/search');
      });
    });

    it('should return view with no results when API returns 404 state', () => {
      nock('http://test-url/').get(`${findSomeoneSearch}/${findSomeoneValidPost.body.nino}`).reply(httpStatus.NOT_FOUND, {});
      findSomeoneController.postFindSomeone(findSomeoneValidPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.details.noResult, true);
        assert.equal(genericResponse.data.details.nino, findSomeoneValidPost.body.nino);
        assert.equal(genericResponse.viewName, 'pages/find-someone/search');
      });
    });

    it('should return view with error when API returns at status code that is not 200, 404 or 500', () => {
      nock('http://test-url/').get(`${findSomeoneSearch}/${findSomeoneValidPost.body.nino}`).reply(httpStatus.BAD_GATEWAY, {});
      findSomeoneController.postFindSomeone(findSomeoneValidPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.globalError, errorOtherErrorResponse);
        assert.equal(genericResponse.data.details.nino, findSomeoneValidPost.body.nino);
        assert.equal(genericResponse.viewName, 'pages/find-someone/search');
      });
    });

    it('should return view with error when API returns no status code.', () => {
      nock('http://test-url/').get(`${findSomeoneSearch}/${findSomeoneValidPost.body.nino}`);
      findSomeoneController.postFindSomeone(findSomeoneValidPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.globalError, errorNoStatus);
        assert.equal(genericResponse.data.details.nino, findSomeoneValidPost.body.nino);
        assert.equal(genericResponse.viewName, 'pages/find-someone/search');
      });
    });

    it('should return redirect back when API returns data.', () => {
      nock('http://test-url/').get(`${findSomeoneSearch}/${findSomeoneValidPost.body.nino}`).reply(httpStatus.OK, claimData.validClaim());
      findSomeoneController.postFindSomeone(findSomeoneValidPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.address, 'find-someone/search-result');
      });
    });
    it('should return the correct view name for getting search result', (done) => {
      findSomeoneController.getSearchResult(validGetSearchResultRequest, genericResponse);
      assert.equal(genericResponse.data.keyDetails.fullName, 'Joe Bloggs');
      assert.equal(genericResponse.data.keyDetails.nino, 'AA 11 11 11 A');
      assert.equal(genericResponse.data.keyDetails.status.text, 'RECEIVING STATE PENSION');
      assert.equal(genericResponse.viewName, 'pages/find-someone/search-result');
      done();
    });
  });
});
