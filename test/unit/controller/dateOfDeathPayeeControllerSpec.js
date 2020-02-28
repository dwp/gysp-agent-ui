const { assert } = require('chai');
const nock = require('nock');
const httpStatus = require('http-status-codes');

nock.disableNetConnect();

const controller = require('../../../app/routes/changes-enquiries/death-payee/functions');

const responseHelper = require('../../lib/responseHelper');
const claimData = require('../../lib/claimData');

let genericResponse = {};

let flash = { type: '', message: '' };
const flashMock = (type, message) => {
  flash.type = type;
  flash.message = message;
};

const keyDetails = {
  fullName: 'Joe Bloggs', nino: 'AA 37 07 73 A', status: { text: 'RECEIVING STATE PENSION', class: 'active' }, dateOfBirth: null,
};

const payeDetailsValidResponse = {
  address: {
    buildingNumber: '1',
    postCode: 'Post code',
    postTown: 'Post town',
    thoroughfareName: 'Thoroughfare name',
    uprn: '2312323123213123',
  },
  fullName: 'Full name',
  phoneNumber: 'Phone number',
  arrearsAmount: 157.63,
  arrearsStartDate: '2020-01-28T08:04:31.377Z',
  arrearsEndDate: '2020-02-28T08:04:31.377Z',
};

const accountDetailsPageData = {
  header: 'payee-account:header',
  formAction: '/changes-and-enquiries/personal/death/account-details',
  back: '/changes-and-enquiries/personal/death/payee-details',
  buttonText: 'app:button.continue',
};

let checkPayeeDetailsRequest = { session: { awardDetails: claimData.validClaim() } };

const accountDetailsRequest = {
  session: {
    awardDetails: claimData.validClaim(),
    death: {
      'death-payee-account': payeDetailsValidResponse,
    },
  },
};

const accountDetails = { accountName: 'Derek Trotter', accountNumber: '12345678', sortCode: '112233' };

const payArrearsRequest = {
  session: {
    awardDetails: claimData.validClaim(),
    death: {
      'death-payee-account': accountDetails,
    },
    'death-payee-details': {
      BLOG123456: payeDetailsValidResponse,
    },
  },
  flash: flashMock,
};

const emptyPostRequest = { session: { awardDetails: claimData.validClaim() }, body: {} };
const validBankPostRequest = { user: { cis: { surname: 'User', givenname: 'Test' } }, session: { awardDetails: claimData.validClaim() }, body: accountDetails };

const payeeDetailsValidPageData = {
  header: 'death-check-payee-details:header',
  back: '/changes-and-enquiries/personal',
  button: '/changes-and-enquiries/personal/death/account-details',
  buttonText: 'app:button.continue',
  name: 'Full name',
  phoneNumber: 'Phone number',
  address: '1 Thoroughfare name<br />Post town<br />Post code',
};

const payArrearsDetailsValidPageData = {
  header: 'death-pay-arrears:header',
  back: '/changes-and-enquiries/personal/death/account-details',
  buttonHref: '/changes-and-enquiries/personal/death/process-arrears',
  buttonText: 'death-pay-arrears:button',
  paymentDetails: {
    amount: '£157.63',
    startDate: '28/01/2020',
    endDate: '28/02/2020',
  },
  accountDetails: {
    rows: [{
      key: { text: 'death-pay-arrears:accountDetails.account_holder' },
      value: { text: 'Derek Trotter' },
    }, {
      key: { text: 'death-pay-arrears:accountDetails.account_number' },
      value: { text: '12345678' },
    }, {
      key: { text: 'death-pay-arrears:accountDetails.sort_code' },
      value: { text: '11 22 33' },
    }],
  },
};

const deathPayeeDetailsApiUri = '/api/award/death-payee-details';
const deathPayeeAccountDetailsUpdateApiUri = '/api/award/death-payee-account-details';

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

    flash = { type: '', message: '' };

    checkPayeeDetailsRequest = { session: { awardDetails: claimData.validClaim() } };
  });
  afterEach(() => {
    nock.cleanAll();
  });

  describe('getCheckPayeeDetails function (GET /changes-and-enquiries/personal/death/payee-details)', () => {
    it('should return view when receive 200 response from API', async () => {
      nock('http://test-url/').get(`${deathPayeeDetailsApiUri}/BLOG123456`).reply(httpStatus.OK, payeDetailsValidResponse);
      await controller.getCheckPayeeDetails(checkPayeeDetailsRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death-payee/check-details');
      assert.deepEqual(genericResponse.data.keyDetails, keyDetails);
      assert.deepEqual(genericResponse.data.pageData, payeeDetailsValidPageData);
    });

    it('should return error view when receive 404 response from API', async () => {
      nock('http://test-url/').get(`${deathPayeeDetailsApiUri}/BLOG123456`).reply(httpStatus.NOT_FOUND);
      await controller.getCheckPayeeDetails(checkPayeeDetailsRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/error');
      assert.equal(genericResponse.data.status, '- There are no payee details.');
      assert.equal(genericResponse.locals.logMessage, '404 - 404 - undefined - Requested on /api/award/death-payee-details/BLOG123456');
    });

    it('should return error view when receive 500 response from API', async () => {
      nock('http://test-url/').get(`${deathPayeeDetailsApiUri}/BLOG123456`).reply(httpStatus.INTERNAL_SERVER_ERROR);
      await controller.getCheckPayeeDetails(checkPayeeDetailsRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/error');
      assert.equal(genericResponse.data.status, '- There are no payee details.');
      assert.equal(genericResponse.locals.logMessage, '500 - 500 - undefined - Requested on /api/award/death-payee-details/BLOG123456');
    });
  });

  describe('getAccountDetails function (GET /changes-and-enquiries/personal/death/account-details)', () => {
    it('should return view when requested', () => {
      controller.getAccountDetails(accountDetailsRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death-payee/account-details');
      assert.deepEqual(genericResponse.data.keyDetails, keyDetails);
      assert.deepEqual(genericResponse.data.pageData, accountDetailsPageData);
      assert.deepEqual(genericResponse.data.details, accountDetailsRequest.session.death['death-payee-account']);
    });
  });

  describe('postAccountDetails function (POST /changes-and-enquiries/personal/death/account-details)', () => {
    it('should return error view when called with empty post with errors', () => {
      controller.postAccountDetails(emptyPostRequest, genericResponse);
      assert.equal(Object.keys(genericResponse.data.errors).length, 3);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death-payee/account-details');
    });

    it('should return redirect when called with valid post', () => {
      controller.postAccountDetails(validBankPostRequest, genericResponse);
      assert.equal(genericResponse.address, '/changes-and-enquiries/personal/death/payee-arrears');
      assert.deepEqual(validBankPostRequest.session.death['death-payee-account'], validBankPostRequest.body);
    });
  });

  describe('getPayArrears function (GET /changes-and-enquiries/personal/death/payee-arrears)', () => {
    it('should return view when requested', () => {
      controller.getPayArrears(payArrearsRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death-payee/pay-arrears');
      assert.deepEqual(genericResponse.data.keyDetails, keyDetails);
      assert.deepEqual(genericResponse.data.pageData, payArrearsDetailsValidPageData);
    });
  });

  describe('getProcessArrears function (GET /changes-and-enquiries/personal/death/process-arrears)', () => {
    it('should return view when receive 404 response from API', async () => {
      nock('http://test-url/').put(deathPayeeAccountDetailsUpdateApiUri).reply(httpStatus.NOT_FOUND);
      await controller.getProcessArrears(payArrearsRequest, genericResponse);
      assert.equal(genericResponse.address, '/changes-and-enquiries/personal/death/payee-arrears');
      assert.equal(flash.type, 'error');
      assert.equal(flash.message, 'app:errors.api.not-found');
    });

    it('should return view when receive 400 response from API', async () => {
      nock('http://test-url/').put(deathPayeeAccountDetailsUpdateApiUri).reply(httpStatus.BAD_REQUEST);
      await controller.getProcessArrears(payArrearsRequest, genericResponse);
      assert.equal(genericResponse.address, '/changes-and-enquiries/personal/death/payee-arrears');
      assert.equal(flash.type, 'error');
      assert.equal(flash.message, 'app:errors.api.bad-request');
    });

    it('should return view when receive 500 response from API', async () => {
      nock('http://test-url/').put(deathPayeeAccountDetailsUpdateApiUri).reply(httpStatus.INTERNAL_SERVER_ERROR);
      await controller.getProcessArrears(payArrearsRequest, genericResponse);
      assert.equal(genericResponse.address, '/changes-and-enquiries/personal/death/payee-arrears');
      assert.equal(flash.type, 'error');
      assert.equal(flash.message, 'app:errors.api.internal-server-error');
    });

    it('should return view when receive 200 response from API', async () => {
      nock('http://test-url/').put(deathPayeeAccountDetailsUpdateApiUri).reply(httpStatus.OK);
      await controller.getProcessArrears(payArrearsRequest, genericResponse);
      assert.equal(genericResponse.address, '/changes-and-enquiries/personal');
      assert.equal(flash.type, 'success');
      assert.equal(flash.message, 'death-process-arrears:messages.success');
      assert.isUndefined(payArrearsRequest.session.death);
      assert.isUndefined(payArrearsRequest.session['death-payee-details']);
    });
  });
});
