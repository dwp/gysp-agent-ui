const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const nock = require('nock');

nock.disableNetConnect();

const dropOutClaimController = require('../../../app/routes/drop-out-claim/functions');
const { promiseWait } = require('../../lib/unitHelper');
const kongData = require('../../lib/kongData');

let testPromise;
let genericResponse;

const { assert } = chai;

const responseHelper = require('../../lib/responseHelper');

const validPost = { headers: { cookie: 'test=test;staff_id=test@test.com;' } };

const claimDropOutTotal = '/api/claim/dropout/count';
const claimDropOut = '/api/claim/dropout/nextclaim';
const claimDropOutQueueError = '/api/claim/claiminerror';
const claimDropOutResolveError = '/api/claim/completeclaim';

const claimPDFDownload = '/api/claim/Bloggs123';

const validJSONDropoutDetails = {
  errorDetail: 'some reason',
  claimDate: '2018-01-15T00:00:00.000Z',
  nino: 'AA370773A',
  surname: 'User',
  inviteKey: 'GYSP0123',
};

const validDropoutDetailsResponse = {
  reason: 'some reason',
  claimDate: '15 Jan 2018',
  niNumber: 'AA370773A',
  surname: 'User',
  invitationCode: 'GYSP0123',
};

const validClaimPDFPost = { body: { inviteKey: 'Bloggs123' }, ...kongData() };
const validQueueStatusUpdatePost = { body: { inviteKey: 'Bloggs123', status: 'queue' }, ...kongData() };
const validFixedStatusUpdatePost = { body: { inviteKey: 'Bloggs123', status: 'fixed' }, ...kongData() };

const errorDropOutStatus = '- Issue getting drop out total.';
const errorDropOutDetailsStatus = '- Cannot get drop out.';

describe('Drop out claim controller ', () => {
  describe(' getDropOut function (GET /claims/drop-out)', () => {
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

    it('should return view with total number of drop outs from API', () => {
      nock('http://test-url/')
        .get(claimDropOutTotal)
        .reply(200, 100);
      dropOutClaimController.getDropOut(validPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/claims/drop-out/index');
        assert.equal(genericResponse.data.total, '100');
      });
    });

    it('should return error view when API returns none 200 state', () => {
      nock('http://test-url/').get(claimDropOutTotal).reply(500, {});
      dropOutClaimController.getDropOut(validPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/error');
        assert.equal(genericResponse.data.status, errorDropOutStatus);
      });
    });
  });

  describe(' getDropOutDetails function (GET /claims/drop-out/details)', () => {
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

    it('should return view with a drop out details from API', () => {
      nock('http://test-url/')
        .get(claimDropOut)
        .reply(200, validJSONDropoutDetails);

      dropOutClaimController.getDropOutDetails(validPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/claims/drop-out/details');
        assert.equal(JSON.stringify(genericResponse.data.details), JSON.stringify(validDropoutDetailsResponse));
      });
    });

    it('should return error view when API returns none 200 state', () => {
      nock('http://test-url/').get(claimDropOut).reply(500, {});
      dropOutClaimController.getDropOutDetails(validPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/error');
        assert.equal(genericResponse.data.status, errorDropOutDetailsStatus);
      });
    });
  });

  describe(' postDropOutDetails function (POST /claims/drop-out/details)', () => {
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
      dropOutClaimController.postDropOutClaimDownloadPdf(validClaimPDFPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.writeHeadStatus, 200);
        assert.equal(JSON.stringify(genericResponse.writeHeadHeaders), JSON.stringify({ 'Content-Disposition': 'attachment;filename="blank.jpg"', 'Content-Length': 18 }));
      });
    });

    it('should return error view when API returns none 200 state', () => {
      nock('http://test-url/').get(claimPDFDownload).reply(500, {});
      dropOutClaimController.postDropOutClaimDownloadPdf(validClaimPDFPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/error');
      });
    });
  });

  describe(' postDropOutClaimUpdateStatus function (POST /drop-out/details/update-status)', () => {
    beforeEach(() => {
      testPromise = promiseWait();
    });
    afterEach(() => {
      nock.cleanAll();
    });

    it('should redirect when post is valid with queue status and API returns 200 with valid queue status', () => {
      nock('http://test-url/').put(claimDropOutQueueError).reply(200, {});
      dropOutClaimController.postDropOutClaimUpdateStatus(validQueueStatusUpdatePost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.address, '/claims/drop-out');
      });
    });

    it('should redirect when post is valid with queue status and API returns 200 with valid fixed status', () => {
      nock('http://test-url/').put(claimDropOutResolveError).reply(200, {});
      dropOutClaimController.postDropOutClaimUpdateStatus(validFixedStatusUpdatePost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.address, '/claims/drop-out');
      });
    });

    it('should return error view when API returns none 200 state', () => {
      nock('http://test-url/').get(claimDropOut).reply(200, {});
      nock('http://test-url/').put(claimDropOutQueueError).reply(500, {});
      dropOutClaimController.postDropOutClaimUpdateStatus(validFixedStatusUpdatePost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/claims/drop-out/details');
        assert.equal(genericResponse.data.returnedStatus.status, 'failed');
        assert.equal(genericResponse.data.returnedStatus.inviteKey, 'Bloggs123');
      });
    });
  });
});
