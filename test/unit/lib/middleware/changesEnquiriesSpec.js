const { assert } = require('chai');
const responseHelper = require('../../../lib/responseHelper');
const changesEnquiries = require('../../../../lib/middleware/changesEnquiries');

let genericResponse;
let log;
let expressNext;
let nextResult;

const get = (req) => () => req.headers.referrer;

const emptyRequest = { url: 'http://localhost:3002/', session: {} };
const findSomeoneWithReferrerAsSearchResult = {
  fullUrl: '/find-someone', headers: { referrer: 'search-result' }, session: {}, get: get({ headers: { referrer: 'search-result' } }),
};
const findSomeoneWithReferrerAsChangesAndEnquiries = {
  fullUrl: '/find-someone', headers: { referrer: 'changes-and-enquiries' }, session: {}, get: get({ headers: { referrer: 'changes-and-enquiries' } }),
};
const findSomeoneWithReferrerAsTasks = {
  fullUrl: '/find-someone', headers: { referrer: 'tasks' }, session: {}, get: get({ headers: { referrer: 'tasks' } }),
};
const findSomeoneWithNoReferrer = {
  fullUrl: '/find-someone', headers: { referrer: '' }, session: { origin: null }, get: get({ headers: { referrer: '' } }),
};
const findSomeoneWithNoReferrerNoOrigin = {
  fullUrl: '/find-someone', headers: { referrer: '' }, session: { }, get: get({ headers: { referrer: '' } }),
};
const findSomeoneUrl = {
  url: 'http://localhost:3002/find-someone/results', session: { origin: 'test' },
};

describe('middleware: changes enquires', () => {
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

  it('should continue with app when no condition matches', () => {
    changesEnquiries(log)(emptyRequest, genericResponse, expressNext);
    assert.equal(nextResult, 'called');
  });

  it('should continue and set origin as full service when url is /find-someone and search-result is in referrer', () => {
    changesEnquiries(log)(findSomeoneWithReferrerAsSearchResult, genericResponse, expressNext);
    assert.equal(findSomeoneWithReferrerAsSearchResult.session.origin, 'full-service');
    assert.isTrue(genericResponse.locals.restrictedService);
    assert.equal(genericResponse.locals.origin, 'full-service');
    assert.equal(genericResponse.locals.activeTab, 'change-and-enquiries');
    assert.equal(nextResult, 'called');
  });

  it('should continue and set origin as full service when url is /find-someone and changes-and-enquiries is in referrer', () => {
    changesEnquiries(log)(findSomeoneWithReferrerAsChangesAndEnquiries, genericResponse, expressNext);
    assert.equal(findSomeoneWithReferrerAsChangesAndEnquiries.session.origin, 'full-service');
    assert.isTrue(genericResponse.locals.restrictedService);
    assert.equal(genericResponse.locals.origin, 'full-service');
    assert.equal(genericResponse.locals.activeTab, 'change-and-enquiries');
    assert.equal(nextResult, 'called');
  });

  it('should continue and set origin as full service when url is /find-someone and tasks is in referrer', () => {
    changesEnquiries(log)(findSomeoneWithReferrerAsTasks, genericResponse, expressNext);
    assert.equal(findSomeoneWithReferrerAsTasks.session.origin, 'full-service');
    assert.isTrue(genericResponse.locals.restrictedService);
    assert.equal(genericResponse.locals.origin, 'full-service');
    assert.equal(genericResponse.locals.activeTab, 'change-and-enquiries');
    assert.equal(nextResult, 'called');
  });

  it('should continue and set origin as restricted service when url is /find-someone and referrer undefined and origin is null', () => {
    changesEnquiries(log)(findSomeoneWithNoReferrer, genericResponse, expressNext);
    assert.equal(findSomeoneWithNoReferrer.session.origin, 'restricted-service');
    assert.isTrue(genericResponse.locals.restrictedService);
    assert.equal(genericResponse.locals.origin, 'restricted-service');
    assert.equal(genericResponse.locals.activeTab, 'change-and-enquiries');
    assert.equal(nextResult, 'called');
  });

  it('should continue when url is /find-someone and referrer undefined', () => {
    changesEnquiries(log)(findSomeoneWithNoReferrerNoOrigin, genericResponse, expressNext);
    assert.isTrue(genericResponse.locals.restrictedService);
    assert.isUndefined(genericResponse.locals.origin);
    assert.equal(genericResponse.locals.activeTab, 'change-and-enquiries');
    assert.equal(nextResult, 'called');
  });

  it('should continue and set locals when url contains /find-someone', () => {
    changesEnquiries(log)(findSomeoneUrl, genericResponse, expressNext);
    assert.isTrue(genericResponse.locals.restrictedService);
    assert.equal(genericResponse.locals.origin, 'test');
    assert.equal(nextResult, 'called');
  });
});
