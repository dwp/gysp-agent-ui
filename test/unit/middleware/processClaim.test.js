const { assert } = require('chai');
const responseHelper = require('../../lib/responseHelper');
const processClaim = require('../../../middleware/processClaim');

let genericResponse;
let log;
let expressNext;
let nextResult;

const destroy = (callback) => {
  callback();
};

const emptySession = { url: 'http://localhost:3002/process-claim/payment', path: '/process-claim/payment', session: {} };
const noMatchUrl = { url: 'http://localhost:3002', session: {} };
const emptySessionRedirectTrue = {
  url: 'http://localhost:3002/process-claim', fullUrl: '/process-claim', session: { }, headers: { referer: 'http://localhost:3002/process-claim/payment' }, hostname: 'localhost',
};
const noClaimDetail = { url: 'http://localhost:3002/process-claim/payment', fullUrl: '/process-claim/payment', session: { processClaim: {} } };
const complete = { url: 'http://localhost:3002/process-claim/payment', fullUrl: '/process-claim/payment', session: { processClaim: { userHasCompleted: true, claimDetail: true } } };
const continueReferer = {
  url: 'http://localhost:3002/process-claim/payment', fullUrl: '/process-claim/payment', session: { processClaim: { claimDetail: true } }, headers: { referer: 'http://localhost:3002/process-claim/payment' }, hostname: 'localhost',
};
const continuePath = {
  url: 'http://localhost:3002/process-claim/payment', fullUrl: '/process-claim', session: { processClaim: { claimDetail: true } }, headers: { referer: 'http://localhost:3002/process-claim/payment' }, hostname: '',
};
const somethingElse = {
  url: 'http://localhost:3002/process-claim/payment', fullUrl: '/process-claim/payment', session: { processClaim: { claimDetail: true }, destroy }, headers: { referer: 'http://localhost:3002/process-claim/payment' }, hostname: '', method: 'GET',
};
const continueRefererAllBau = {
  url: 'http://localhost:3002/process-claim/all-claims-to-bau', fullUrl: '/process-claim/all-claims-to-bau', session: { }, headers: { referer: 'http://localhost:3002/process-claim' }, hostname: 'localhost',
};

describe('process claim middleware', () => {
  beforeEach(() => {
    genericResponse = responseHelper.genericResponse();
    log = {
      level: '',
      message: '',
      info: (message) => {
        log.level = 'info';
        log.message = message;
      },
    };
    nextResult = undefined;
    expressNext = () => {
      nextResult = 'called';
    };
  });

  it('should redirect when session is empty', () => {
    processClaim(log)(emptySession, genericResponse, expressNext);
    assert.equal(log.level, 'info');
    assert.equal(log.message, 'session is not defined - redirect to /process-claim');
    assert.equal(genericResponse.address, '/process-claim');
  });

  it('should continue when session is empty and matches a redirect path', () => {
    processClaim(log)(emptySessionRedirectTrue, genericResponse, expressNext);
    assert.equal(nextResult, 'called');
  });

  it('should continue with to next middleware as middleware does not march', () => {
    processClaim(log)(noMatchUrl, genericResponse, expressNext);
    assert.equal(nextResult, 'called');
  });

  it('should redirect when session is does not contain claimDetail session and path is payment page', () => {
    processClaim(log)(noClaimDetail, genericResponse, expressNext);
    assert.equal(log.level, 'info');
    assert.equal(log.message, 'session is not defined - redirect to /process-claim');
    assert.equal(genericResponse.address, '/process-claim');
  });

  it('should redirect back to complete when session is complete but try and access other page', () => {
    processClaim(log)(complete, genericResponse, expressNext);
    assert.equal(log.level, 'info');
    assert.equal(log.message, 'user has already processed claim');
    assert.equal(genericResponse.address, '/process-claim/complete');
  });

  it('should continue with middleware when referer matches with hostname', () => {
    processClaim(log)(continueReferer, genericResponse, expressNext);
    assert.equal(nextResult, 'called');
  });

  it('should continue with middleware when referer does not matches with hostname but path does', () => {
    processClaim(log)(continuePath, genericResponse, expressNext);
    assert.equal(nextResult, 'called');
  });

  it('should redirect back to start of section when hostname or path does not match', () => {
    processClaim(log)(somethingElse, genericResponse, expressNext);
    assert.equal(log.level, 'info');
    assert.equal(log.message, 'Security redirect - user agent failed to match - GET /process-claim/payment');
    assert.equal(genericResponse.address, '/process-claim');
  });

  it('should continue with app when referer matches with hostname and path is /process-claim/all-claims-to-bau', () => {
    processClaim(log)(continueRefererAllBau, genericResponse, expressNext);
    assert.equal(nextResult, 'called');
  });
});
