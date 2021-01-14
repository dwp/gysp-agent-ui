const { assert } = require('chai');
const responseHelper = require('../../lib/responseHelper');
const changesEnquiries = require('../../../middleware/changesEnquiries');

const claimData = require('../../lib/claimData');

let genericResponse;
let log;
let expressNext;
let nextResult;

const get = (req) => () => req.headers.referrer;

const emptyRequest = { url: 'http://test-url/', session: {} };
const findSomeoneBase = { fullUrl: '/find-someone', headers: { referrer: '' } };
const findSomeoneWithReferrerAsSearchResult = {
  ...findSomeoneBase, headers: { referrer: 'search-result' }, session: {}, get: get({ headers: { referrer: 'search-result' } }),
};
const findSomeoneWithReferrerAsChangesAndEnquiries = {
  ...findSomeoneBase, headers: { referrer: 'changes-and-enquiries' }, session: {}, get: get({ headers: { referrer: 'changes-and-enquiries' } }),
};
const findSomeoneWithReferrerAsTasks = {
  ...findSomeoneBase, headers: { referrer: 'tasks' }, session: {}, get: get({ headers: { referrer: 'tasks' } }),
};
const findSomeoneWithNoReferrer = {
  ...findSomeoneBase, session: { origin: null }, get: get({ headers: { referrer: '' } }),
};
const findSomeoneWithNoReferrerNoOrigin = {
  ...findSomeoneBase, session: { }, get: get({ headers: { referrer: '' } }),
};
const findSomeoneUrl = {
  url: 'http://test-url/find-someone/results', session: { origin: 'test' },
};

// Search results requests
const searchResultBase = { url: 'http://test-url/changes-and-enquiries/find-someone/search-result', fullUrl: '/changes-and-enquiries/find-someone/search-result', headers: { referrer: 'find-someone' } };
const searchResultInSession = { ...searchResultBase, session: { searchedNino: 'NINO' } };
const searchResultNoSession = { ...searchResultBase, session: { } };

// Changes and enquires requests
const changeAndEnquiresBase = { url: 'http://test-url/changes-and-enquiries/personal', fullUrl: '/changes-and-enquiries/personal', headers: { referrer: 'find-someone/search-results' } };
const changeAndEnquiresInSession = { ...changeAndEnquiresBase, session: { searchedNino: 'NINO', origin: 'test' } };
const changeAndEnquiresInSessionWithAward = { ...changeAndEnquiresBase, session: { searchedNino: 'NINO', origin: 'test', awardDetails: claimData.validClaim() } };
const changeAndEnquiresNoSession = { ...changeAndEnquiresBase, session: { } };

const deathWithNoReferrer = {
  url: 'http://test-url/changes-and-enquiries/death', fullUrl: '/changes-and-enquiries/death', headers: { }, session: { searchedNino: 'NINO', death: { foo: 'bar' } }, method: 'GET', hostname: 'test-url',
};

const deathWithReferrer = {
  url: 'http://test-url/changes-and-enquiries/marital-details', fullUrl: '/changes-and-enquiries/marital-details', headers: { referer: 'http://test-url/changes-and-enquiries/personal' }, session: { searchedNino: 'NINO' }, hostname: 'test-url',
};

const maritalDetailsWithReferrer = {
  url: 'http://test-url/changes-and-enquiries/death', fullUrl: '/changes-and-enquiries/death', headers: { referer: 'http://test-url/changes-and-enquiries/personal' }, session: { searchedNino: 'NINO' }, hostname: 'test-url',
};

const maritalDetailsWithNoReferrer = {
  url: 'http://test-url/changes-and-enquiries/marital-details', fullUrl: '/changes-and-enquiries/marital-details', headers: { }, session: { searchedNino: 'NINO', marital: { foo: 'bar' } }, method: 'GET', hostname: 'test-url',
};

const changesAndEnquiriesReq = (path, session) => ({
  url: `http://test-url/changes-and-enquiries${path}`, fullUrl: '/changes-and-enquiries', session: { ...session },
});

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

  describe('/find-someone', () => {
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

  describe('/find-someone/search-result', () => {
    it('should continue with service when searchedNino is in session', () => {
      changesEnquiries(log)(searchResultInSession, genericResponse, expressNext);
      assert.equal(nextResult, 'called');
    });

    it('should redirect when searchedNino not in session', () => {
      changesEnquiries(log)(searchResultNoSession, genericResponse, expressNext);
      assert.equal(genericResponse.address, '/find-someone');
    });
  });

  describe('/changes-and-enquiries', () => {
    it('should set origin and continue with service when searchedNino is in session', () => {
      changesEnquiries(log)(changeAndEnquiresInSession, genericResponse, expressNext);
      assert.isTrue(genericResponse.locals.restrictedService);
      assert.equal(genericResponse.locals.origin, 'test');
      assert.equal(nextResult, 'called');
    });

    it('should set origin and key details locals then continue with service when searchedNino and awardDetails are in session', () => {
      changesEnquiries(log)(changeAndEnquiresInSessionWithAward, genericResponse, expressNext);
      assert.isTrue(genericResponse.locals.restrictedService);
      assert.equal(genericResponse.locals.origin, 'test');
      assert.isObject(genericResponse.locals.keyDetails);
      assert.equal(nextResult, 'called');
    });

    it('should redirect when searchedNino not in session', () => {
      changesEnquiries(log)(changeAndEnquiresNoSession, genericResponse, expressNext);
      assert.equal(genericResponse.address, '/find-someone');
    });

    describe('/death', () => {
      it('should continue when referer is set', () => {
        changesEnquiries(log)(deathWithReferrer, genericResponse, expressNext);
        assert.equal(nextResult, 'called');
      });

      it('should redirect and log an error when no referer set', () => {
        changesEnquiries(log)(deathWithNoReferrer, genericResponse, expressNext);
        assert.equal(log.level, 'info');
        assert.equal(log.message, `Security redirect - user agent failed to match - ${deathWithNoReferrer.method} ${deathWithNoReferrer.fullUrl}`);
        assert.isUndefined(deathWithNoReferrer.session.death);
        assert.equal(genericResponse.address, '/changes-and-enquiries/personal');
      });
    });

    describe('/marital-details', () => {
      it('should continue when referer is set', () => {
        changesEnquiries(log)(maritalDetailsWithReferrer, genericResponse, expressNext);
        assert.equal(nextResult, 'called');
      });

      it('should redirect and log an error when no referer set', () => {
        changesEnquiries(log)(maritalDetailsWithNoReferrer, genericResponse, expressNext);
        assert.equal(log.level, 'info');
        assert.equal(log.message, `Security redirect - user agent failed to match - ${maritalDetailsWithNoReferrer.method} ${maritalDetailsWithNoReferrer.fullUrl}`);
        assert.equal(log.level, 'info');
        assert.isUndefined(maritalDetailsWithNoReferrer.session.marital);
        assert.equal(genericResponse.address, '/changes-and-enquiries/personal');
      });
    });

    describe('delete or retain session based on url path', () => {
      context('stop state pension', () => {
        it('should delete stop state pension when not on path', () => {
          const request = changesAndEnquiriesReq('/', { 'stop-state-pension': { foo: 'bar' } });
          changesEnquiries(log)(request, genericResponse, expressNext);
          assert.isUndefined(request.session['stop-state-pension']);
        });

        it('should retain stop state pension when on death path', () => {
          const request = changesAndEnquiriesReq('/death', { 'stop-state-pension': { foo: 'bar' } });
          changesEnquiries(log)(request, genericResponse, expressNext);
          assert.isDefined(request.session['stop-state-pension']);
        });

        it('should retain stop state pension when on deferral path', () => {
          const request = changesAndEnquiriesReq('/deferral', { 'stop-state-pension': { foo: 'bar' } });
          changesEnquiries(log)(request, genericResponse, expressNext);
          assert.isDefined(request.session['stop-state-pension']);
        });
      });

      context('death', () => {
        it('should delete all death related session when not on path', () => {
          const request = changesAndEnquiriesReq('/', {
            death: { foo: 'bar' },
            'death-payee-details-updated': { foo: 'bar' },
            'death-payment-details': { foo: 'bar' },
          });
          changesEnquiries(log)(request, genericResponse, expressNext);
          assert.isUndefined(request.session.death);
          assert.isUndefined(request.session['death-payee-details-updated']);
          assert.isUndefined(request.session['death-payment-details']);
        });

        it('should retain death related session when on death path', () => {
          const request = changesAndEnquiriesReq('/death', {
            death: { foo: 'bar' },
            'death-payee-details-updated': { foo: 'bar' },
            'death-payment-details': { foo: 'bar' },
          });
          changesEnquiries(log)(request, genericResponse, expressNext);
          assert.isDefined(request.session.death);
          assert.isDefined(request.session['death-payee-details-updated']);
          assert.isDefined(request.session['death-payment-details']);
        });
      });

      context('deferral', () => {
        it('should delete deferral related session when not on path', () => {
          const request = changesAndEnquiriesReq('/', {
            deferral: { foo: 'bar' },
          });
          changesEnquiries(log)(request, genericResponse, expressNext);
          assert.isUndefined(request.session.deferral);
        });

        it('should retain deferral related session when on deferral path', () => {
          const request = changesAndEnquiriesReq('/deferral', {
            deferral: { foo: 'bar' },
          });
          changesEnquiries(log)(request, genericResponse, expressNext);
          assert.isDefined(request.session.deferral);
        });
      });

      context('marital', () => {
        it('should delete marital detail related session when not on path', () => {
          const request = changesAndEnquiriesReq('/', {
            marital: { foo: 'bar' },
          });
          changesEnquiries(log)(request, genericResponse, expressNext);
          assert.isUndefined(request.session.marital);
        });

        it('should retain marital detail related session when on marital-details/ path', () => {
          const request = changesAndEnquiriesReq('/marital-details/', {
            marital: { foo: 'bar' },
          });
          changesEnquiries(log)(request, genericResponse, expressNext);
          assert.isDefined(request.session.marital);
        });
      });

      context('manual-payment', () => {
        it('should delete manual payment related session when not on path', () => {
          const request = changesAndEnquiriesReq('/', {
            'manual-payment': { foo: 'bar' },
          });
          changesEnquiries(log)(request, genericResponse, expressNext);
          assert.isUndefined(request.session['manual-payment']);
        });

        it('should retain manual payment related session when on manual-payment path', () => {
          const request = changesAndEnquiriesReq('/manual-payment', {
            'manual-payment': { foo: 'bar' },
          });
          changesEnquiries(log)(request, genericResponse, expressNext);
          assert.isDefined(request.session['manual-payment']);
        });
      });
    });
  });
});
