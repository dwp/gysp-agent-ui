const { assert } = require('chai');

const nock = require('nock');
const httpStatus = require('http-status-codes');

const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');
const i18nextConfig = require('../../../../config/i18next');

const controller = require('../../../../app/routes/changes-enquiries/name-change/functions');

const claimData = require('../../../lib/claimData');
const responseHelper = require('../../../lib/responseHelper');
const { promiseWait } = require('../../../lib/unitHelper');

let genericResponse;
let testPromise;
let flash = { type: '', message: '' };

const reqHeaders = { reqheaders: { agentRef: 'Test User' } };
const changeNameApiUri = '/api/award/update-name-details';

const awardDetails = { session: { awardDetails: claimData.validClaim() } };

const getRequest = {
  ...awardDetails,
};
const postRequestEmpty = {
  ...awardDetails,
  body: {},
};
const postRequestNameChange = {
  ...awardDetails,
  body: { firstName: 'Rick', lastName: 'Sanchez' },
  user: { cis: { surname: 'User', givenname: 'Test' } },
  flash: (type, message) => {
    flash.type = type;
    flash.message = message;
  },
};

describe('Name Change Controller', () => {
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

    flash = { type: '', message: '' };
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('getNameChange function (GET /change-enquiries/personal/name-change)', () => {
    it('should display the /name-change page when requested', (done) => {
      controller.getNameChange(getRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/personal/name-change');
      done();
    });
  });

  describe('postNameChange function (POST /change-enquiries/personal/name-change)', () => {
    it('should display the /name-change page, with errors, when requested with an empty form', () => {
      controller.postNameChange(postRequestEmpty, genericResponse);
      return testPromise.then(() => {
        assert.equal(Object.keys(genericResponse.data.errors).length, 1);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/personal/name-change');
      });
    });

    it('should display the /name-change page, with an error, when the API returns a 400 state', () => {
      nock('http://test-url/', reqHeaders).put(changeNameApiUri).reply(httpStatus.BAD_REQUEST, {});
      controller.postNameChange(postRequestNameChange, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.globalError, 'Error - connection refused.');
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/personal/name-change');
      });
    });

    it('should display the /name-change page, with an error, when the API returns a 404 state', () => {
      nock('http://test-url/', reqHeaders).put(changeNameApiUri).reply(httpStatus.NOT_FOUND, {});
      controller.postNameChange(postRequestNameChange, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.globalError, 'Error - award not found.');
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/personal/name-change');
      });
    });

    it('should display the /name-change page, with an error, when the API returns a 500 state', () => {
      nock('http://test-url/', reqHeaders).put(changeNameApiUri).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
      controller.postNameChange(postRequestNameChange, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.globalError, 'Error - could not save data.');
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/personal/name-change');
      });
    });

    it('should display the /personal page when the API returns a 200 state', () => {
      nock('http://test-url/', reqHeaders).put(changeNameApiUri).reply(httpStatus.OK, {});
      controller.postNameChange(postRequestNameChange, genericResponse);
      return testPromise.then(() => {
        assert.equal(flash.type, 'success');
        assert.equal(flash.message, 'Name changed');
        assert.equal(genericResponse.address, '/changes-and-enquiries/personal');
      });
    });
  });
});
