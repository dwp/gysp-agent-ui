const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const nock = require('nock');

nock.disableNetConnect();

const overseasCompletedClaimController = require('../../../app/routes/overseas-completed-claim/functions');
const { promiseWait } = require('../../lib/unitHelper');

let testPromise;
let genericResponse;

const { assert } = chai;

const responseHelper = require('../../../test/lib/responseHelper');

const validPost = { headers: { cookie: 'test=test;staff_id=test@test.com;' } };

const overseasCompletedClaimTotal = '/api/claim/overseas/count';
const overseasCompletedClaim = '/api/claim/nextoverseasclaim';
const updateCompletedClaimStatus = '/api/claim/completeoverseasclaim';
const updateNotUploadedClaimStatus = '/api/claim/claimnotuploaded';

const claimPDFDownload = '/api/claim/Bloggs123';

const validJSONOverseasCompletedClaimDetails = {
  statePensionDate: '2018-07-19T00:00:00.000Z',
  claimDate: '2018-05-19T00:00:00.000Z',
  surname: 'User',
  nino: 'AA370773A',
  inviteKey: 'BLOG123',
};

const validJSONOverseasCompletedClaimDetailsResponse = {
  statePensionDate: '19 Jul 2018',
  claimDate: '19 May 2018',
  niNumber: 'AA370773A',
  surname: 'User',
  inviteKey: 'BLOG123',
};

const validClaimPDFPost = { body: { inviteKey: 'Bloggs123' }, user: { cis: { dwp_staffid: 'test@test.com' } } };
const validCreatedStatusUpdatePost = { body: { inviteKey: 'Bloggs123', status: 'CREATED' }, user: { cis: { dwp_staffid: 'test@test.com' } } };
const validCompleteStatusUpdatePost = { body: { inviteKey: 'Bloggs123', status: 'COMPLETE' }, user: { cis: { dwp_staffid: 'test@test.com' } } };

const errorOverseasCompletedClaimStatus = '- Issue getting overseas completed claim total.';
const errorOverseasCompletedClaimDetailsStatus = '- Cannot get overseas completed claim.';

describe('Overseas completed claim controller ', () => {
  describe(' getOverseasCompletedClaim function (GET /claims/overseas/completed-claim)', () => {
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

    it('should return view with total number of overseas completed claims from API', () => {
      nock('http://test-url/')
        .get(overseasCompletedClaimTotal)
        .reply(200, 100);
      overseasCompletedClaimController.getOverseasCompletedClaim(validPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/claims/overseas/index');
        assert.equal(genericResponse.data.total, '100');
      });
    });

    it('should return error view when API returns none 200 state', () => {
      nock('http://test-url/').get(overseasCompletedClaimTotal).reply(500, {});
      overseasCompletedClaimController.getOverseasCompletedClaim(validPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/error');
        assert.equal(genericResponse.data.status, errorOverseasCompletedClaimStatus);
      });
    });
  });

  describe('getOverseasCompletedClaimDetails function (GET /claims/overseas/completed-claim/details)', () => {
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

    it('should return view with overseas completed claim details from API', () => {
      nock('http://test-url/')
        .get(overseasCompletedClaim)
        .reply(200, validJSONOverseasCompletedClaimDetails);

      overseasCompletedClaimController.getOverseasCompletedClaimDetails(validPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/claims/overseas/completed-claim-details');
        assert.equal(JSON.stringify(genericResponse.data.details), JSON.stringify(validJSONOverseasCompletedClaimDetailsResponse));
      });
    });

    it('should return error view when API returns none 200 state', () => {
      nock('http://test-url/').get(overseasCompletedClaim).reply(500, {});
      overseasCompletedClaimController.getOverseasCompletedClaimDetails(validPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/error');
        assert.equal(genericResponse.data.status, errorOverseasCompletedClaimDetailsStatus);
      });
    });
  });

  describe(' postOverseasCompletedClaimDetails function (POST /claims/overseas/completed-claim/details)', () => {
    genericResponse = responseHelper.pdfResponse();
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

    it('should return a PDF for drop out details from API', () => {
      nock('http://test-url/')
        .get(claimPDFDownload)
        .reply(200, { body: { a: 'b' } }, { 'content-disposition': 'inline;filename="blank.jpg"' });
      overseasCompletedClaimController.postOverseasCompletedClaimDownloadPdf(validClaimPDFPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.writeHeadStatus, 200);
        assert.equal(JSON.stringify(genericResponse.writeHeadHeaders), JSON.stringify({ 'Content-Disposition': 'attachment;filename="blank.jpg"', 'Content-Length': 18 }));
      });
    });

    it('should return error view when API returns none 200 state', () => {
      nock('http://test-url/').get(claimPDFDownload).reply(500, {});
      overseasCompletedClaimController.postOverseasCompletedClaimDownloadPdf(validClaimPDFPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/error');
      });
    });
  });

  describe(' postOverseasCompletedClaimUpdateStatus function (POST /overseas/completed-claim/details/update-status)', () => {
    beforeEach(() => {
      testPromise = promiseWait();
    });
    afterEach(() => {
      nock.cleanAll();
    });

    it('should redirect when post is valid with CREATED status and API returns 200', () => {
      nock('http://test-url/').put(updateNotUploadedClaimStatus).reply(200, {});
      overseasCompletedClaimController.postOverseasCompletedClaimUpdateStatus(validCreatedStatusUpdatePost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.address, '/claims/overseas/completed-claim');
      });
    });

    it('should redirect when post is valid with COMPLETE status and API returns 200', () => {
      nock('http://test-url/').put(updateCompletedClaimStatus).reply(200, {});
      overseasCompletedClaimController.postOverseasCompletedClaimUpdateStatus(validCompleteStatusUpdatePost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.address, '/claims/overseas/completed-claim');
      });
    });

    it('should return error view when API returns none 200 state', () => {
      nock('http://test-url/').get(overseasCompletedClaim).reply(200, {});
      nock('http://test-url/').put(updateCompletedClaimStatus).reply(500, {});

      overseasCompletedClaimController.postOverseasCompletedClaimUpdateStatus(validCompleteStatusUpdatePost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/claims/overseas/completed-claim-details');
        assert.equal(genericResponse.data.returnedStatus.status, 'failed');
        assert.equal(genericResponse.data.returnedStatus.inviteKey, 'Bloggs123');
      });
    });
  });
});
