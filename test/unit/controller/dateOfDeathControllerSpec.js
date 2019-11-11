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

let flash = { type: '', message: '' };
const flashMock = (type, message) => {
  flash.type = type;
  flash.message = message;
};

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
const validVPostRequest = {
  user: { cis: { surname: 'User', givenname: 'Test' } },
  session: { awardDetails: claimData.validClaim() },
  body: {
    dateDay: '01', dateMonth: '01', dateYear: '2019', verification: 'V',
  },
  flash: flashMock,
};

const validNVPostRequest = {
  user: { cis: { surname: 'User', givenname: 'Test' } },
  session: { awardDetails: claimData.validClaim() },
  body: {
    dateDay: '01', dateMonth: '01', dateYear: '2019', verification: 'NV',
  },
  flash: flashMock,
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

const paymentRequest = {
  user: { cis: { surname: 'User', givenname: 'Test' } },
  session: {
    awardDetails: claimData.validClaim(),
    death: {
      'date-of-death': {
        dateYear: '2019', dateMonth: '01', dateDay: '01', verification: 'V',
      },
    },
  },
  flash: flashMock,
};

const recordDeathRequest = {
  user: { cis: { surname: 'User', givenname: 'Test' } },
  session: {
    awardDetails: claimData.validClaim(),
    death: {
      'date-of-death': {
        dateYear: '2019', dateMonth: '01', dateDay: '01', verification: 'V',
      },
      'death-payment': {
        amount: 100.0,
        startDate: '2019-01-01T00:00:00.000Z',
        endDate: '2019-01-01T00:00:00.000Z',
      },
    },
  },
  flash: flashMock,
};

const emptyAddVerifedDeathPostRequest = { session: { awardDetails: claimData.validClaimWithDeathNotVerified() }, body: {} };
const validAddVerifedDeathPostRequest = {
  user: { cis: { surname: 'User', givenname: 'Test' } },
  session: { awardDetails: claimData.validClaimWithDeathNotVerified() },
  body: {
    dateDay: '01', dateMonth: '01', dateYear: '2019',
  },
};

const deathArrearsResponses = {
  overpayment: {
    amount: -100.0,
    endDate: '2019-11-06T14:00:16.444Z',
    startDate: '2020-13-06T14:00:16.444Z',
  },
  arrears: {
    amount: 102.11,
    endDate: '2019-11-06T14:00:16.444Z',
    startDate: '2020-13-06T14:00:16.444Z',
  },
  nothingOwed: {
    amount: 0,
    endDate: null,
    startDate: null,
  },
  cannotCalculate: {
    amount: null,
    endDate: null,
    startDate: null,
  },
};

const reqHeaders = { reqheaders: { agentRef: 'Test User' } };

const deathDetailsUpdateApiUri = '/api/award/record-death';
const deathArrearsApiUri = '/api/payment/death-arrears';

const errorMessages = {
  400: 'app:errors.api.bad-request',
  404: 'app:errors.api.not-found',
  500: 'app:errors.api.internal-server-error',
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

    flash = { type: '', message: '' };
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

    it('should save to session and redirect to next screen when post is valid and verification is V', () => {
      controller.postAddDateDeath(validVPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(validVPostRequest.session.death['date-of-death'].dateYear, validVPostRequest.body.dateYear);
        assert.equal(validVPostRequest.session.death['date-of-death'].dateMonth, validVPostRequest.body.dateMonth);
        assert.equal(validVPostRequest.session.death['date-of-death'].dateDay, validVPostRequest.body.dateDay);
        assert.equal(validVPostRequest.session.death['date-of-death'].verification, validVPostRequest.body.verification);
        assert.equal(genericResponse.address, '/changes-and-enquiries/personal/death/payment');
      });
    });

    it('should save to session and redirect to next screen when post is valid and verification is NV', () => {
      controller.postAddDateDeath(validNVPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(validNVPostRequest.session.death['date-of-death'].dateYear, validNVPostRequest.body.dateYear);
        assert.equal(validNVPostRequest.session.death['date-of-death'].dateMonth, validNVPostRequest.body.dateMonth);
        assert.equal(validNVPostRequest.session.death['date-of-death'].dateDay, validNVPostRequest.body.dateDay);
        assert.equal(validNVPostRequest.session.death['date-of-death'].verification, validNVPostRequest.body.verification);
        assert.equal(genericResponse.address, '/changes-and-enquiries/personal/death/record');
      });
    });
  });

  describe(' getDeathPayment function (GET /changes-and-enquiries/personal/death/payment)', () => {
    it('should return view with error when API returns 400 state', () => {
      const { dateYear, dateMonth, dateDay } = paymentRequest.session.death['date-of-death'];
      const dateOfDeath = `${dateYear}-${dateMonth}-${dateDay}`;
      nock('http://test-url/').get(deathArrearsApiUri)
        .query({ nino: paymentRequest.session.awardDetails.nino, dateOfDeath })
        .reply(httpStatus.BAD_REQUEST, {});
      controller.getDeathPayment(paymentRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.locals.logMessage, '400 - 400 - {} - Requested on api/payment/death-arrears');
        assert.equal(genericResponse.data.globalError, errorMessages[400]);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death/payment/index');
      });
    });

    it('should return view with error when API returns 500 state', () => {
      const { dateYear, dateMonth, dateDay } = paymentRequest.session.death['date-of-death'];
      const dateOfDeath = `${dateYear}-${dateMonth}-${dateDay}`;
      nock('http://test-url/').get(deathArrearsApiUri)
        .query({ nino: paymentRequest.session.awardDetails.nino, dateOfDeath })
        .reply(httpStatus.INTERNAL_SERVER_ERROR, {});
      controller.getDeathPayment(paymentRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on api/payment/death-arrears');
        assert.equal(genericResponse.data.globalError, errorMessages[500]);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death/payment/index');
      });
    });

    it('should display overpayment result when requested and API returns 200 with negative values', () => {
      const { dateYear, dateMonth, dateDay } = paymentRequest.session.death['date-of-death'];
      const dateOfDeath = `${dateYear}-${dateMonth}-${dateDay}`;
      nock('http://test-url/').get(deathArrearsApiUri)
        .query({ nino: paymentRequest.session.awardDetails.nino, dateOfDeath })
        .reply(httpStatus.OK, deathArrearsResponses.overpayment);
      controller.getDeathPayment(paymentRequest, genericResponse);
      return testPromise.then(() => {
        assert.isDefined(genericResponse.data.details);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death/payment/overpayment');
      });
    });

    it('should display arrears result when requested and API returns 200 with positive values', () => {
      const { dateYear, dateMonth, dateDay } = paymentRequest.session.death['date-of-death'];
      const dateOfDeath = `${dateYear}-${dateMonth}-${dateDay}`;
      nock('http://test-url/').get(deathArrearsApiUri)
        .query({ nino: paymentRequest.session.awardDetails.nino, dateOfDeath })
        .reply(httpStatus.OK, deathArrearsResponses.arrears);
      controller.getDeathPayment(paymentRequest, genericResponse);
      return testPromise.then(() => {
        assert.isDefined(genericResponse.data.details);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death/payment/arrears');
      });
    });

    it('should display nothing owed result when requested and API returns 200 with zero value', () => {
      const { dateYear, dateMonth, dateDay } = paymentRequest.session.death['date-of-death'];
      const dateOfDeath = `${dateYear}-${dateMonth}-${dateDay}`;
      nock('http://test-url/').get(deathArrearsApiUri)
        .query({ nino: paymentRequest.session.awardDetails.nino, dateOfDeath })
        .reply(httpStatus.OK, deathArrearsResponses.nothingOwed);
      controller.getDeathPayment(paymentRequest, genericResponse);
      return testPromise.then(() => {
        assert.isDefined(genericResponse.data.details);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death/payment/nothing-owed');
      });
    });

    it('should display nothing owed result when requested and API returns 200 with null values', () => {
      const { dateYear, dateMonth, dateDay } = paymentRequest.session.death['date-of-death'];
      const dateOfDeath = `${dateYear}-${dateMonth}-${dateDay}`;
      nock('http://test-url/').get(deathArrearsApiUri)
        .query({ nino: paymentRequest.session.awardDetails.nino, dateOfDeath })
        .reply(httpStatus.OK, deathArrearsResponses.cannotCalculate);
      controller.getDeathPayment(paymentRequest, genericResponse);
      return testPromise.then(() => {
        assert.isDefined(genericResponse.data.details);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death/payment/cannot-calculate');
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
        assert.equal(genericResponse.data.globalError, errorMessages[404].replace('<SERVICE>', 'award'));
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
        assert.equal(genericResponse.data.globalError, errorMessages[404].replace('<SERVICE>', 'award'));
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

  describe('getRecordDeath', () => {
    it('should return view with error when API returns 400 state', () => {
      nock('http://test-url/', reqHeaders).put(deathDetailsUpdateApiUri).reply(httpStatus.BAD_REQUEST, {});
      controller.getRecordDeath(recordDeathRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(flash.type, 'error');
        assert.equal(flash.message, errorMessages[400]);
        assert.equal(genericResponse.address, '/changes-and-enquiries/personal/death/payment');
      });
    });

    it('should return view with error when API returns 404 state', () => {
      nock('http://test-url/', reqHeaders).put(deathDetailsUpdateApiUri).reply(httpStatus.NOT_FOUND, {});
      controller.getRecordDeath(recordDeathRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(flash.type, 'error');
        assert.equal(flash.message, errorMessages[404]);
        assert.equal(genericResponse.address, '/changes-and-enquiries/personal/death/payment');
      });
    });

    it('should return view with error when API returns 500 state', () => {
      nock('http://test-url/', reqHeaders).put(deathDetailsUpdateApiUri).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
      controller.getRecordDeath(recordDeathRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(flash.type, 'error');
        assert.equal(flash.message, errorMessages[500]);
        assert.equal(genericResponse.address, '/changes-and-enquiries/personal/death/payment');
      });
    });

    it('should return a redirect when API returns 200', () => {
      nock('http://test-url/', reqHeaders).put(deathDetailsUpdateApiUri).reply(httpStatus.OK, {});
      controller.getRecordDeath(paymentRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.address, '/changes-and-enquiries/payment');
      });
    });
  });
});
