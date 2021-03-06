const { assert } = require('chai');
const nock = require('nock');
const httpStatus = require('http-status-codes');

const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../../config/i18next');

nock.disableNetConnect();

const changeAccountDetailsController = require('../../../../app/routes/changes-enquiries/account/functions');

const responseHelper = require('../../../lib/responseHelper');
const claimData = require('../../../lib/claimData');
const { promiseWait } = require('../../../lib/unitHelper');
const kongData = require('../../../lib/kongData');
const requestKongHeaderData = require('../../../lib/requestKongHeaderData');

let testPromise;
let genericResponse = {};

// Mocks
let flash = { type: '', message: '' };
const flashMock = (type, message) => {
  flash.type = type;
  flash.message = message;
};

const accountChangeRequest = { session: { awardDetails: claimData.validClaim() } };

const emptyPostRequest = { session: { awardDetails: claimData.validClaim() }, body: {} };

const validBankPostRequest = {
  ...kongData(),
  session: {
    awardDetails: claimData.validClaim(),
  },
  body: {
    accountName: 'Derek Trotter',
    accountNumber: '12345678',
    sortCode: '112233',
  },
  flash: flashMock,
};

const validBuildingSocietyPostRequest = {
  ...kongData(),
  session: {
    awardDetails: claimData.validClaim(),
  },
  body: {
    accountName: 'Derek Trotter',
    accountNumber: '87654321',
    sortCode: '445566',
    referenceNumber: '2863547',
  },
  flash: flashMock,
};

const reqHeaders = requestKongHeaderData();

const paymentDetailsUpdateApiUri = '/api/award/payee';

const errorMessages = {
  400: 'Error - connection refused.',
  404: 'Error - payment schedule not found.',
  500: 'Error - could not save data.',
};

describe('Change circumstances contact controller ', () => {
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

    flash = { type: '', message: '' };

    testPromise = promiseWait();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe(' getChangeBankBuildingAccountDetails function (GET /changes-and-enquiries/payment/account)', () => {
    it('should display change bank or building account details page when requested', (done) => {
      changeAccountDetailsController.getChangeBankBuildingAccountDetails(accountChangeRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/account/index');
      done();
    });
  });

  describe(' postChangeBankBuildingAccountDetails function (POST /payment/account)', () => {
    it('should return view name when called with empty post with errors', () => {
      changeAccountDetailsController.postChangeBankBuildingAccountDetails(emptyPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(Object.keys(genericResponse.data.errors).length, 3);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/account/index');
      });
    });

    it('should return view with error when API returns 400 state', () => {
      nock('http://test-url/', reqHeaders).put(paymentDetailsUpdateApiUri).reply(httpStatus.BAD_REQUEST, {});
      changeAccountDetailsController.postChangeBankBuildingAccountDetails(validBankPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.locals.logMessage, '400 - 400 - {} - Requested on api/award/payee');
        assert.equal(genericResponse.data.globalError, errorMessages[400]);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/account/index');
      });
    });

    it('should return view with error when API returns 404 state', () => {
      nock('http://test-url/', reqHeaders).put(paymentDetailsUpdateApiUri).reply(httpStatus.NOT_FOUND, {});
      changeAccountDetailsController.postChangeBankBuildingAccountDetails(validBankPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.locals.logMessage, '404 - 404 - {} - Requested on api/award/payee');
        assert.equal(genericResponse.data.globalError, errorMessages[404]);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/account/index');
      });
    });

    it('should return view with error when API returns 500 state', () => {
      nock('http://test-url/', reqHeaders).put(paymentDetailsUpdateApiUri).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
      changeAccountDetailsController.postChangeBankBuildingAccountDetails(validBankPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on api/award/payee');
        assert.equal(genericResponse.data.globalError, errorMessages[500]);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/account/index');
      });
    });

    it('should return a redirect when API returns 200 state with valid bank post', () => {
      nock('http://test-url/', reqHeaders).put(paymentDetailsUpdateApiUri).reply(httpStatus.OK, {});
      changeAccountDetailsController.postChangeBankBuildingAccountDetails(validBankPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.address, '/changes-and-enquiries/payment');
      });
    });

    it('should return a redirect when API returns 200 state with valid building society post', () => {
      nock('http://test-url/', reqHeaders).put(paymentDetailsUpdateApiUri).reply(httpStatus.OK, {});
      changeAccountDetailsController.postChangeBankBuildingAccountDetails(validBuildingSocietyPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.address, '/changes-and-enquiries/payment');
      });
    });
  });
});
