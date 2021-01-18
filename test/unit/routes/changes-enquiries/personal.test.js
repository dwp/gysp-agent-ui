const assert = require('assert');
const nock = require('nock');

nock.disableNetConnect();

const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../../config/i18next');

const controller = require('../../../../app/routes/changes-enquiries/personal/functions');

const responseHelper = require('../../../lib/responseHelper');
const claimData = require('../../../lib/claimData');
const { promiseWait } = require('../../../lib/unitHelper');

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

    testPromise = promiseWait();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe(' getCustomerOverview function (GET /changes-enquiries/personal)', () => {
    before(async () => {
      await i18next
        .use(i18nextFsBackend)
        .init(i18nextConfig);
    });

    it('should return view name and view data when called nino exists in session and exists on API', () => {
      nock('http://test-url/').get(`${changeCircumstancesDetailsUri}/${ninoRequest.session.searchedNino}`).reply(200, claimData.validClaim());
      controller.getPersonalDetails(ninoRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/personal/index');
        assert.equal(JSON.stringify(genericResponse.data.details), JSON.stringify(claimData.validPersonalDetailsViewData()));
      });
    });

    it('should return view name and dead view data when called nino exists in session and exists on API', () => {
      nock('http://test-url/').get(`${changeCircumstancesDetailsUri}/${ninoRequest.session.searchedNino}`).reply(200, claimData.validClaimWithDeathVerified());
      controller.getPersonalDetails(ninoRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/personal/index');
        assert.deepEqual(genericResponse.data.details, claimData.validClaimWithDeathVerifiedData());
      });
    });

    it('should return view name and dead not verified view data when called nino exists in session and exists on API', () => {
      nock('http://test-url/').get(`${changeCircumstancesDetailsUri}/${ninoRequest.session.searchedNino}`).reply(200, claimData.validClaimWithDeathNotVerified());
      controller.getPersonalDetails(ninoRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/personal/index');
        assert.deepEqual(genericResponse.data.details, claimData.validClaimWithDeathNotVerifiedData());
      });
    });

    it('should return view name and dead verified arrears view data when called nino exists in session and exists on API', () => {
      nock('http://test-url/').get(`${changeCircumstancesDetailsUri}/${ninoRequest.session.searchedNino}`).reply(200, claimData.validClaimWithDeathNotVerified());
      controller.getPersonalDetails(ninoRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/personal/index');
        assert.deepEqual(genericResponse.data.details, claimData.validClaimWithDeathNotVerifiedData());
      });
    });

    it('should return view name and deferral view data when called nino exists in session and exists on API', () => {
      nock('http://test-url/').get(`${changeCircumstancesDetailsUri}/${ninoRequest.session.searchedNino}`).reply(200, claimData.validClaimWithDeferral());
      controller.getPersonalDetails(ninoRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/personal/index');
        assert.equal(JSON.stringify(genericResponse.data.details), JSON.stringify({ ...claimData.validPersonalDetailsViewData(), enableStopStatePension: false }));
      });
    });

    it('should return error view name when API returns a 404 response', () => {
      nock('http://test-url/').get(`${changeCircumstancesDetailsUri}/${ninoRequest.session.searchedNino}`).reply(404, {});
      controller.getPersonalDetails(ninoRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/error');
        assert.equal(genericResponse.locals.logMessage, '404 - 404 - {} - Requested on api/award/{NINO}');
      });
    });
  });
});
