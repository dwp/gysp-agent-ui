const { assert } = require('chai');
const nock = require('nock');
const httpStatus = require('http-status-codes');

nock.disableNetConnect();

const controller = require('../../../app/routes/changes-enquiries/death/functions');

const responseHelper = require('../../lib/responseHelper');
const claimData = require('../../lib/claimData');
const navigationData = require('../../lib/navigationData');

let testPromise;
let genericResponse = {};

const enterDateOfDeathRequest = { session: { awardDetails: claimData.validClaim() } };
const enterDateOfDeathResponse = {
  keyDetails: {
    fullName: 'Joe Bloggs', nino: 'AA 37 07 73 A', status: { text: 'RECEIVING STATE PENSION', class: 'active' }, dateOfBirth: null,
  },
  awardDetails: claimData.validClaim(),
  secondaryNavigationList: navigationData.validNavigationPersonalSelected(),
};

const verifyDeathRequest = { session: { awardDetails: claimData.validClaimWithDeathNotVerified() } };
const verifyDeathResponse = {
  keyDetails: {
    fullName: 'Joe Bloggs', nino: 'AA 37 07 73 A', status: { text: 'DEAD - NOT VERIFIED', class: 'dead' }, dateOfBirth: null,
  },
  awardDetails: claimData.validClaimWithDeathNotVerified(),
  secondaryNavigationList: navigationData.validNavigationPersonalSelected(),
  dateOfDeath: '1 January 2019',
};

const verifiedResponse = {
  keyDetails: {
    fullName: 'Joe Bloggs', nino: 'AA 37 07 73 A', status: { text: 'DEAD - NOT VERIFIED', class: 'dead' }, dateOfBirth: null,
  },
  awardDetails: claimData.validClaimWithDeathNotVerified(),
  secondaryNavigationList: navigationData.validNavigationPersonalSelected(),
};

const emptyPostRequest = { session: { awardDetails: claimData.validClaim() }, body: {} };
const validPostRequest = {
  user: { cis: { surname: 'User', givenname: 'Test' } },
  session: { awardDetails: claimData.validClaim() },
  body: {
    dateDay: '01', dateMonth: '01', dateYear: '2019', verification: 'V',
  },
};
const validPostNVRequest = {
  user: { cis: { surname: 'User', givenname: 'Test' } },
  session: { awardDetails: claimData.validClaim() },
  body: {
    dateDay: '01', dateMonth: '01', dateYear: '2019', verification: 'NV',
  },
};

const validYesPostRequest = {
  user: { cis: { surname: 'User', givenname: 'Test' } },
  session: { awardDetails: claimData.validClaimWithDeathNotVerified() },
  body: {
    verify: 'yes',
  },
};

const validNoPostRequest = {
  user: { cis: { surname: 'User', givenname: 'Test' } },
  session: { awardDetails: claimData.validClaimWithDeathNotVerified() },
  body: {
    verify: 'no',
  },
};

const emptyAddVerifedDeathPostRequest = { session: { awardDetails: claimData.validClaimWithDeathNotVerified() }, body: {} };
const validAddVerifedDeathPostRequest = {
  user: { cis: { surname: 'User', givenname: 'Test' } },
  session: { awardDetails: claimData.validClaimWithDeathNotVerified() },
  body: {
    dateDay: '01', dateMonth: '01', dateYear: '2019',
  },
};

const reqHeaders = { reqheaders: { agentRef: 'Test User' } };

const deathDetailsUpdateApiUri = '/api/award/record-death';

const errorMessages = {
  400: 'Error - connection refused.',
  404: 'Error - award not found.',
  500: 'Error - could not save data.',
};

describe('Change circumstances date of death controller ', () => {
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
      }, 30);
    });
  });
  afterEach(() => {
    nock.cleanAll();
  });

  describe(' getAddDateDeath function (GET /changes-and-enquiries/personal/death)', () => {
    it('should display form when page when requested', (done) => {
      controller.getAddDateDeath(enterDateOfDeathRequest, genericResponse);
      assert.equal(JSON.stringify(genericResponse.data), JSON.stringify(enterDateOfDeathResponse));
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death/enter-date');
      done();
    });
  });

  describe(' postAddDateDeath function (POST /changes-and-enquiries/personal/death)', () => {
    it('should return view name when called with empty post with errors', () => {
      controller.postAddDateDeath(emptyPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(Object.keys(genericResponse.data.errors).length, 5);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death/enter-date');
      });
    });

    it('should return view with error when API returns 400 state', () => {
      nock('http://test-url/', reqHeaders).put(deathDetailsUpdateApiUri).reply(httpStatus.BAD_REQUEST, {});
      controller.postAddDateDeath(validPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.locals.logMessage, '400 - 400 - {} - Requested on api/award/record-death');
        assert.equal(genericResponse.data.globalError, errorMessages[400]);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death/enter-date');
      });
    });

    it('should return view with error when API returns 404 state', () => {
      nock('http://test-url/', reqHeaders).put(deathDetailsUpdateApiUri).reply(httpStatus.NOT_FOUND, {});
      controller.postAddDateDeath(validPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.locals.logMessage, '404 - 404 - {} - Requested on api/award/record-death');
        assert.equal(genericResponse.data.globalError, errorMessages[404]);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death/enter-date');
      });
    });

    it('should return view with error when API returns 500 state', () => {
      nock('http://test-url/', reqHeaders).put(deathDetailsUpdateApiUri).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
      controller.postAddDateDeath(validPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on api/award/record-death');
        assert.equal(genericResponse.data.globalError, errorMessages[500]);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death/enter-date');
      });
    });

    it('should return a redirect when API returns 200 state with valid bank post', () => {
      nock('http://test-url/', reqHeaders).put(deathDetailsUpdateApiUri).reply(httpStatus.OK, {});
      controller.postAddDateDeath(validPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.address, '/changes-and-enquiries/personal');
      });
    });

    it('should return a redirect when API returns 200 state with NV validation', () => {
      nock('http://test-url/', reqHeaders).put(deathDetailsUpdateApiUri).reply(httpStatus.OK, {});
      controller.postAddDateDeath(validPostNVRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.address, '/changes-and-enquiries/personal');
      });
    });
  });

  describe(' getVerifyDeath function (GET /changes-and-enquiries/personal/death/verify)', () => {
    it('should display form when requested', (done) => {
      controller.getVerifyDeath(verifyDeathRequest, genericResponse);
      assert.equal(JSON.stringify(genericResponse.data), JSON.stringify(verifyDeathResponse));
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death/verify-date');
      done();
    });
  });

  describe(' postVerifyDeath function (POST /changes-and-enquiries/personal/death)', () => {
    it('should return view name when called with empty post with errors', () => {
      controller.postVerifyDeath(emptyPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(Object.keys(genericResponse.data.errors).length, 1);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death/verify-date');
      });
    });

    it('should return view with error when API returns 400 state', () => {
      nock('http://test-url/', reqHeaders).put(deathDetailsUpdateApiUri).reply(httpStatus.BAD_REQUEST, {});
      controller.postVerifyDeath(validYesPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.locals.logMessage, '400 - 400 - {} - Requested on api/award/record-death');
        assert.equal(genericResponse.data.globalError, errorMessages[400]);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death/verify-date');
      });
    });

    it('should return view with error when API returns 404 state', () => {
      nock('http://test-url/', reqHeaders).put(deathDetailsUpdateApiUri).reply(httpStatus.NOT_FOUND, {});
      controller.postVerifyDeath(validYesPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.locals.logMessage, '404 - 404 - {} - Requested on api/award/record-death');
        assert.equal(genericResponse.data.globalError, errorMessages[404]);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death/verify-date');
      });
    });

    it('should return view with error when API returns 500 state', () => {
      nock('http://test-url/', reqHeaders).put(deathDetailsUpdateApiUri).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
      controller.postVerifyDeath(validYesPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on api/award/record-death');
        assert.equal(genericResponse.data.globalError, errorMessages[500]);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death/verify-date');
      });
    });

    it('should return a redirect to personal when API returns 200 state with valid yes post', () => {
      nock('http://test-url/', reqHeaders).put(deathDetailsUpdateApiUri).reply(httpStatus.OK, {});
      controller.postVerifyDeath(validYesPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.address, '/changes-and-enquiries/personal');
      });
    });

    it('should return a redirect to verified date when API returns 200 state with valid no post', () => {
      nock('http://test-url/', reqHeaders).put(deathDetailsUpdateApiUri).reply(httpStatus.OK, {});
      controller.postVerifyDeath(validNoPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.address, '/changes-and-enquiries/personal/death/verified-date');
      });
    });
  });

  describe(' getAddVerifedDeath function (GET /changes-and-enquiries/personal/death/verified-date)', () => {
    it('should display form when requested', (done) => {
      controller.getAddVerifedDeath(verifyDeathRequest, genericResponse);
      assert.equal(JSON.stringify(genericResponse.data), JSON.stringify(verifiedResponse));
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death/enter-date-verified');
      done();
    });
  });

  describe(' postAddVerifedDeath function (POST /changes-and-enquiries/personal/death/verified-date)', () => {
    it('should return view name when called with empty post with errors', () => {
      controller.postAddVerifedDeath(emptyAddVerifedDeathPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(Object.keys(genericResponse.data.errors).length, 4);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death/enter-date-verified');
      });
    });

    it('should return view with error when API returns 400 state', () => {
      nock('http://test-url/', reqHeaders).put(deathDetailsUpdateApiUri).reply(httpStatus.BAD_REQUEST, {});
      controller.postAddVerifedDeath(validAddVerifedDeathPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.locals.logMessage, '400 - 400 - {} - Requested on api/award/record-death');
        assert.equal(genericResponse.data.globalError, errorMessages[400]);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death/enter-date-verified');
      });
    });

    it('should return view with error when API returns 404 state', () => {
      nock('http://test-url/', reqHeaders).put(deathDetailsUpdateApiUri).reply(httpStatus.NOT_FOUND, {});
      controller.postAddVerifedDeath(validAddVerifedDeathPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.locals.logMessage, '404 - 404 - {} - Requested on api/award/record-death');
        assert.equal(genericResponse.data.globalError, errorMessages[404]);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death/enter-date-verified');
      });
    });

    it('should return view with error when API returns 500 state', () => {
      nock('http://test-url/', reqHeaders).put(deathDetailsUpdateApiUri).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
      controller.postAddVerifedDeath(validAddVerifedDeathPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on api/award/record-death');
        assert.equal(genericResponse.data.globalError, errorMessages[500]);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death/enter-date-verified');
      });
    });

    it('should return a redirect when API returns 200 state with valid post', () => {
      nock('http://test-url/', reqHeaders).put(deathDetailsUpdateApiUri).reply(httpStatus.OK, {});
      controller.postAddVerifedDeath(validAddVerifedDeathPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.address, '/changes-and-enquiries/personal');
      });
    });
  });
});
