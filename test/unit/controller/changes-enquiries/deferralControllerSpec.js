const { assert } = require('chai');

const nock = require('nock');
const httpStatus = require('http-status-codes');

const controller = require('../../../../app/routes/changes-enquiries/deferral/functions');

const claimData = require('../../../lib/claimData');
const responseHelper = require('../../../lib/responseHelper');
const { promiseWait } = require('../../../lib/unitHelper');

const awardDetails = { session: { awardDetails: claimData.validClaim() } };

let genericResponse;
let testPromise;

const getRequest = { ...awardDetails };

const getDateRequestReceivedResponse = {
  backLink: '/changes-and-enquiries/personal/stop-state-pension',
  formAction: '/changes-and-enquiries/personal/deferral/date-request-received',
};

const postRequestEmpty = { ...awardDetails, body: {} };

const postDateRequestReceivedRequestDate = { ...awardDetails, body: { day: '1', month: '1', year: '2000' } };

const getDefaultDateResponse = {
  backLink: '/changes-and-enquiries/personal/deferral/date-request-received',
  formAction: '/changes-and-enquiries/personal/deferral/deferral-date',
  statePensionDate: '9 November 2018',
};

const postDefaultDateRequestYes = { ...awardDetails, body: { 'default-date': 'yes' } };

const postDefaultDateRequestNo = { ...awardDetails, body: { 'default-date': 'no' } };

const getConfirmResponse = {
  backLink: '/changes-and-enquiries/personal/deferral/deferral-date',
  button: '/changes-and-enquiries/personal/deferral/update',
};

const reqHeaders = { reqheaders: { agentRef: 'Test User' } };

const recordDeferralApiUri = '/api/award/record-deferral';

let flash = { type: '', message: '' };

const getUpdateRequest = {
  session: {
    awardDetails: claimData.validClaim(),
    deferral: {
      'from-date': Date.now(),
      'date-request-received': { year: '2020', month: '1', day: '1' },
    },
  },
  user: { cis: { surname: 'User', givenname: 'Test' } },
  flash: (type, message) => {
    flash.type = type;
    flash.message = message;
  },
};

const errorMessages = {
  400: 'There has been a problem with the service, please go back and try again. This has been logged.',
  404: 'There has been a problem - award not found. This has been logged.',
  500: 'There has been a problem with the service, please try again. This has been logged.',
};

describe('Deferral controller', () => {
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

    flash = { type: '', message: '' };
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('getDateRequestReceived function (GET /changes-and-enquiries/personal/deferral/date-request-received)', () => {
    it('should return correct data and page when requested', () => {
      controller.getDateRequestReceived(getRequest, genericResponse);
      assert.equal(JSON.stringify(genericResponse.data), JSON.stringify(getDateRequestReceivedResponse));
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/deferral/date-request-received');
    });
  });

  describe('postDateRequestReceived function (POST /changes-and-enquiries/personal/deferral/date-request-received)', () => {
    it('should return the same data and page, with errors, when requested with an empty form', () => {
      controller.postDateRequestReceived(postRequestEmpty, genericResponse);
      return testPromise.then(() => {
        assert.equal(Object.keys(genericResponse.data.errors).length, 4);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/deferral/date-request-received');
      });
    });

    it('should save to session and redirect to the /default-date', () => {
      controller.postDateRequestReceived(postDateRequestReceivedRequestDate, genericResponse);
      return testPromise.then(() => {
        const { day, month, year } = postDateRequestReceivedRequestDate.session.deferral['date-request-received'];
        assert.equal(day, postDateRequestReceivedRequestDate.body.day);
        assert.equal(month, postDateRequestReceivedRequestDate.body.month);
        assert.equal(year, postDateRequestReceivedRequestDate.body.year);
        assert.equal(genericResponse.address, '/changes-and-enquiries/personal/deferral/deferral-date');
      });
    });
  });

  describe('getDefaultDate function (GET /changes-and-enquiries/personal/deferral/default-date)', () => {
    it('should return correct data and page when requested', () => {
      controller.getDefaultDate(getRequest, genericResponse);
      assert.equal(JSON.stringify(genericResponse.data), JSON.stringify(getDefaultDateResponse));
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/deferral/default-date');
    });
  });

  describe('postDefaultDate function (POST /changes-and-enquiries/personal/deferral/default-date)', () => {
    it('should return the same data and page, with an error, when requested with an empty form', () => {
      controller.postDefaultDate(postRequestEmpty, genericResponse);
      return testPromise.then(() => {
        assert.equal(Object.keys(genericResponse.data.errors).length, 1);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/deferral/default-date');
      });
    });

    it('should save to session and redirect to the /confirm page if using the default date (State Pension date)', () => {
      controller.postDefaultDate(postDefaultDateRequestYes, genericResponse);
      return testPromise.then(() => {
        const defaultDate = postDefaultDateRequestYes.session.deferral['default-date'];
        assert.equal(defaultDate, postDefaultDateRequestYes.body['default-date']);
        assert.equal(genericResponse.address, '/changes-and-enquiries/personal/deferral/confirm');
      });
    });

    it('should save to session and redirect to the /from-date page if not using the default date (State Pension date)', () => {
      controller.postDefaultDate(postDefaultDateRequestNo, genericResponse);
      return testPromise.then(() => {
        const defaultDate = postDefaultDateRequestYes.session.deferral['default-date'];
        assert.equal(defaultDate, postDefaultDateRequestNo.body['default-date']);
        assert.equal(genericResponse.address, '/changes-and-enquiries/personal/deferral/from-date');
      });
    });
  });

  describe('getConfirm function (GET /changes-and-enquiries/personal/deferral/confirm)', () => {
    it('should return correct data and page when requested', () => {
      controller.getConfirm(getRequest, genericResponse);
      assert.equal(JSON.stringify(genericResponse.data), JSON.stringify(getConfirmResponse));
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/deferral/confirm');
    });
  });

  describe('getUpdate function (GET /changes-and-enquiries/personal/deferral/update)', () => {
    it('should return the same data and page, with an error, when the API returns a 400 state', () => {
      nock('http://test-url/', reqHeaders).put(recordDeferralApiUri).reply(httpStatus.BAD_REQUEST, {});
      controller.getUpdate(getUpdateRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(flash.type, 'error');
        assert.equal(flash.message, errorMessages[400]);
        assert.equal(genericResponse.address, '/changes-and-enquiries/personal/deferral/confirm');
      });
    });

    it('should return the same data and page, with an error, when the API returns a 404 state', () => {
      nock('http://test-url/', reqHeaders).put(recordDeferralApiUri).reply(httpStatus.NOT_FOUND, {});
      controller.getUpdate(getUpdateRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(flash.type, 'error');
        assert.equal(flash.message, errorMessages[404]);
        assert.equal(genericResponse.address, '/changes-and-enquiries/personal/deferral/confirm');
      });
    });

    it('should return the same data and page, with an error, when the API returns a 500 state', () => {
      nock('http://test-url/', reqHeaders).put(recordDeferralApiUri).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
      controller.getUpdate(getUpdateRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(flash.type, 'error');
        assert.equal(flash.message, errorMessages[500]);
        assert.equal(genericResponse.address, '/changes-and-enquiries/personal/deferral/confirm');
      });
    });

    it('should clear the deferral section from the session and redirect to the /personal page when the API returns a 200 state', () => {
      nock('http://test-url/', reqHeaders).put(recordDeferralApiUri).reply(httpStatus.OK, {});
      controller.getUpdate(getUpdateRequest, genericResponse);
      return testPromise.then(() => {
        assert.isUndefined(getUpdateRequest.session.deferral);
        assert.equal(flash.type, 'success');
        assert.equal(flash.message, 'State Pension deferred - payments stopped');
        assert.equal(genericResponse.address, '/changes-and-enquiries/personal');
      });
    });
  });
});
