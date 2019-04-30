const assert = require('assert');
const nock = require('nock');

nock.disableNetConnect();

const changeCircumstancesController = require('../../../app/routes/changes-enquiries/functions');

const responseHelper = require('../../lib/responseHelper');
const claimData = require('../../lib/claimData');

let testPromise;
let genericResponse = {};
const emptyRequest = { session: {}, body: {} };
const ninoRequest = { session: { searchedNino: 'AA370773A' }, body: {} };

const changeCircumstancesDetailsUri = '/api/award';

describe('Change circumstances controller ', () => {
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

  describe(' getCustomerOverview function (GET /changes-enquiries/overview)', () => {
    it('should display a somethings gone wrong page when search nino is not in request', (done) => {
      changeCircumstancesController.getOverview(emptyRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/error');
      done();
    });

    it('should return view name and view data when called nino exists in session and exists on API', () => {
      nock('http://test-url/').get(`${changeCircumstancesDetailsUri}/${ninoRequest.session.searchedNino}`).reply(200, claimData.validClaim());
      changeCircumstancesController.getOverview(ninoRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/overview');
        assert.equal(JSON.stringify(genericResponse.data.details), JSON.stringify(claimData.validViewData()));
      });
    });

    it('should return error view name when API returns a 404 response', () => {
      nock('http://test-url/').get(`${changeCircumstancesDetailsUri}/${ninoRequest.session.searchedNino}`).reply(404, {});
      changeCircumstancesController.getOverview(ninoRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/error');
      });
    });
  });
});
