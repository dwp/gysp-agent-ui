const assert = require('assert');
const nock = require('nock');

const navigationData = require('../../lib/navigationData');

nock.disableNetConnect();

const controller = require('../../../app/routes/changes-enquiries/award/functions');

const responseHelper = require('../../lib/responseHelper');
const claimData = require('../../lib/claimData');

const keyDetails = {
  fullName: 'Joe Bloggs',
  nino: 'AA 37 07 73 A',
  status: { text: 'RECEIVING STATE PENSION', class: 'active' },
  dateOfBirth: null,
};

let testPromise;
let genericResponse = {};
const ninoRequest = { session: { searchedNino: 'AA370773A' }, body: {} };

const changeCircumstancesDetailsUri = '/api/award';

describe('Change circumstances personal controller', () => {
  beforeEach(() => {
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

    testPromise = new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 100);
    });
  });

  describe(' getCustomerOverview function (GET /changes-enquiries/award)', () => {
    it('should return error view name when API returns a 404 response', () => {
      nock('http://test-url/').get(`${changeCircumstancesDetailsUri}/${ninoRequest.session.searchedNino}`).reply(404, {});
      controller.getAwardDetails(ninoRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/error');
        assert.equal(genericResponse.locals.logMessage, '404 - 404 - {} - Requested on api/award/{NINO}');
      });
    });

    it('should return view name and view data when called nino exists in session and exists on API', () => {
      nock('http://test-url/').get(`${changeCircumstancesDetailsUri}/${ninoRequest.session.searchedNino}`).reply(200, claimData.validClaim());
      controller.getAwardDetails(ninoRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/award/index');
        assert.equal(JSON.stringify(genericResponse.data.details), JSON.stringify(claimData.validAwardDetailsViewData()));
        assert.equal(JSON.stringify(genericResponse.data.keyDetails), JSON.stringify(keyDetails));
        assert.equal(JSON.stringify(genericResponse.data.secondaryNavigationList), JSON.stringify(navigationData.validNavigationAwardSelected()));
      });
    });

    it('should return view name and view data when session data already exists', () => {
      controller.getAwardDetails(ninoRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/award/index');
        assert.equal(JSON.stringify(genericResponse.data.details), JSON.stringify(claimData.validAwardDetailsViewData()));
        assert.equal(JSON.stringify(genericResponse.data.keyDetails), JSON.stringify(keyDetails));
        assert.equal(JSON.stringify(genericResponse.data.secondaryNavigationList), JSON.stringify(navigationData.validNavigationAwardSelected()));
      });
    });
  });
});
