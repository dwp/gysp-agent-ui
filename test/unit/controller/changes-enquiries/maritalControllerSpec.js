const { assert } = require('chai');
const nock = require('nock');
const httpStatus = require('http-status-codes');

nock.disableNetConnect();

const controller = require('../../../../app/routes/changes-enquiries/marital/functions');

const responseHelper = require('../../../lib/responseHelper');
const claimData = require('../../../lib/claimData');

let genericResponse = {};
const ninoRequest = { session: { searchedNino: 'AA370773A' }, body: {} };

const changeCircumstancesDetailsUri = '/api/award';

describe('Change circumstances - marital controller', () => {
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
  });

  describe(' getMaritalDetails function (GET /changes-enquiries/marital)', () => {
    it('should return error view name when API returns a NOT_FOUND response', async () => {
      nock('http://test-url/').get(`${changeCircumstancesDetailsUri}/${ninoRequest.session.searchedNino}`).reply(httpStatus.NOT_FOUND, {});
      await controller.getMaritalDetails(ninoRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/error');
      assert.equal(genericResponse.locals.logMessage, '404 - 404 - {} - Requested on api/award/{NINO}');
      assert.include(genericResponse.data.status, 'app:errors.api.not-found');
    });

    it('should return error view name when API returns a INTERNAL_SERVER_ERROR response', async () => {
      nock('http://test-url/').get(`${changeCircumstancesDetailsUri}/${ninoRequest.session.searchedNino}`).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
      await controller.getMaritalDetails(ninoRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/error');
      assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on api/award/{NINO}');
      assert.include(genericResponse.data.status, 'app:errors.api.internal-server-error');
    });

    it('should return view name and data when called nino exists in session and API return OK response', async () => {
      nock('http://test-url/').get(`${changeCircumstancesDetailsUri}/${ninoRequest.session.searchedNino}`).reply(httpStatus.OK, claimData.validClaimMarried());
      await controller.getMaritalDetails(ninoRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/marital/index');
      assert.isObject(genericResponse.data.keyDetails);
      assert.isObject(genericResponse.data.maritalDetails);
    });

    it('should return view name and data when award cached', async () => {
      await controller.getMaritalDetails(ninoRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/marital/index');
      assert.isObject(genericResponse.data.keyDetails);
      assert.isObject(genericResponse.data.maritalDetails);
    });
  });
});
