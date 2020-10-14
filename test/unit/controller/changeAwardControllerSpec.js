const assert = require('assert');
const nock = require('nock');

const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../config/i18next');

nock.disableNetConnect();

const controller = require('../../../app/routes/changes-enquiries/award/functions');

const responseHelper = require('../../lib/responseHelper');
const claimData = require('../../lib/claimData');
const { promiseWait } = require('../../lib/unitHelper');

const keyDetails = {
  fullName: 'Joe Bloggs',
  nino: 'AA 37 07 73 A',
  status: { text: 'RECEIVING STATE PENSION', class: 'active' },
  dateOfBirth: null,
};

let testPromise;
let genericResponse = {};
const ninoRequest = { session: { searchedNino: 'AA370773A' } };
const ninoRequestWithId = { session: { searchedNino: 'AA370773A' }, body: {}, params: { id: '0' } };
const ninoRequestWithIdForUprating = { session: { searchedNino: 'AA370773B' }, body: {}, params: { id: '0' } };
const ninoRequestWithIdForUpratingNonWeekly = { session: { searchedNino: 'AA370773C' }, body: {}, params: { id: '0' } };
const ninoRequestWithFutureUpratingNotInPayment = { session: { searchedNino: 'AA370773D' } };

const changeCircumstancesDetailsUri = '/api/award';

describe('Change circumstances award controller', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

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

  describe('getAwardList function (GET /changes-enquiries/award)', () => {
    it('should return error view name when API returns a 404 response', () => {
      nock('http://test-url/').get(`${changeCircumstancesDetailsUri}/${ninoRequest.session.searchedNino}`).reply(404, {});
      controller.getAwardList(ninoRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/error');
        assert.equal(genericResponse.locals.logMessage, '404 - 404 - {} - Requested on api/award/{NINO}');
      });
    });

    it('should return view name and view data when called nino exists in session and exists on API', () => {
      nock('http://test-url/').get(`${changeCircumstancesDetailsUri}/${ninoRequestWithId.session.searchedNino}`).reply(200, claimData.validClaim());
      controller.getAwardList(ninoRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/award/index');
        assert.equal(JSON.stringify(genericResponse.data.details), JSON.stringify(claimData.validAwardListViewData()));
        assert.equal(JSON.stringify(genericResponse.data.keyDetails), JSON.stringify(keyDetails));
      });
    });

    it('should return view name and view data when session data already exists', () => {
      controller.getAwardList(ninoRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/award/index');
        assert.equal(JSON.stringify(genericResponse.data.details), JSON.stringify(claimData.validAwardListViewData()));
        assert.equal(JSON.stringify(genericResponse.data.keyDetails), JSON.stringify(keyDetails));
      });
    });

    it('should return view name and view data when future uprating exists and not in payment', () => {
      nock('http://test-url/').get(`${changeCircumstancesDetailsUri}/${ninoRequestWithFutureUpratingNotInPayment.session.searchedNino}`).reply(200, claimData.validClaimWithFutureUprating());
      controller.getAwardList(ninoRequestWithFutureUpratingNotInPayment, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/award/index');
        assert.equal(JSON.stringify(genericResponse.data.details), JSON.stringify(claimData.validAwardListViewDataWithFutureUprating()));
        assert.equal(JSON.stringify(genericResponse.data.keyDetails), JSON.stringify(keyDetails));
      });
    });
  });

  describe('getAwardDetails function (GET /changes-enquiries/award/0)', () => {
    it('should return error view name when API returns a 404 response', () => {
      nock('http://test-url/').get(`${changeCircumstancesDetailsUri}/${ninoRequestWithId.session.searchedNino}`).reply(404, {});
      controller.getAwardDetails(ninoRequestWithId, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/error');
        assert.equal(genericResponse.locals.logMessage, '404 - 404 - {} - Requested on api/award/{NINO}');
      });
    });

    it('should return view name and view data when called nino exists in session and exists on API', () => {
      nock('http://test-url/').get(`${changeCircumstancesDetailsUri}/${ninoRequestWithId.session.searchedNino}`).reply(200, claimData.validClaim());
      controller.getAwardDetails(ninoRequestWithId, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/award/details');
        assert.equal(JSON.stringify(genericResponse.data.details), JSON.stringify(claimData.validAwardDetailsViewData()));
        assert.equal(JSON.stringify(genericResponse.data.keyDetails), JSON.stringify(keyDetails));
      });
    });

    it('should return view name and view data when session data already exists', () => {
      controller.getAwardDetails(ninoRequestWithId, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/award/details');
        assert.equal(JSON.stringify(genericResponse.data.details), JSON.stringify(claimData.validAwardDetailsViewData()));
        assert.equal(JSON.stringify(genericResponse.data.keyDetails), JSON.stringify(keyDetails));
      });
    });

    it('should return view name and view data when detail is for uprating amounts not in payment yet', () => {
      const details = claimData.validClaimWithFutureUprating();
      details.paymentFrequency = '1W';
      nock('http://test-url/').get(`${changeCircumstancesDetailsUri}/${ninoRequestWithIdForUprating.session.searchedNino}`).reply(200, details);
      controller.getAwardDetails(ninoRequestWithIdForUprating, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/award/details');
        assert.equal(JSON.stringify(genericResponse.data.details), JSON.stringify(claimData.validAwardDetailsViewDataWithUprating()));
        assert.equal(JSON.stringify(genericResponse.data.keyDetails), JSON.stringify(keyDetails));
      });
    });

    it('should return view name and view data when detail is for uprating amounts not in payment yet and is not weekly', () => {
      nock('http://test-url/').get(`${changeCircumstancesDetailsUri}/${ninoRequestWithIdForUpratingNonWeekly.session.searchedNino}`).reply(200, claimData.validClaimWithFutureUprating());
      controller.getAwardDetails(ninoRequestWithIdForUpratingNonWeekly, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/award/details');
        assert.equal(JSON.stringify(genericResponse.data.details), JSON.stringify(claimData.validAwardDetailsViewDataWithUpratingWithFrequencyAmount()));
        assert.equal(JSON.stringify(genericResponse.data.keyDetails), JSON.stringify(keyDetails));
      });
    });
  });
});
