const { assert } = require('chai');
const nock = require('nock');
const httpStatus = require('http-status-codes');

nock.disableNetConnect();

const controller = require('../../../app/routes/changes-enquiries/death-payee/functions');

const responseHelper = require('../../lib/responseHelper');
const claimData = require('../../lib/claimData');
const addressData = require('../../lib/addressData');

let genericResponse = {};

let flash = { type: '', message: '' };
const flashMock = (type, message) => {
  flash.type = type;
  flash.message = message;
};

const payeeDetailsValidResponse = {
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
const checkPayeeUpdateDetailsRequest = {
  session: {
    awardDetails: claimData.validClaim(),
    death: {
      'dap-name': { name: 'Rodney Trotter' },
    },
    'death-payee-details-updated': {
      'dap-name': { name: 'Rodney Trotter' },
      'dap-phone-number': { phoneNumber: '000000' },
      'dap-address': { address: '10091853817' },
      'dap-postcode': { postcode: 'NE1 1RT' },
      'address-lookup': addressData.multipleAddressesNoneEmpty(),
    },
  },
};
const checkPayeeDetailsWithArrearsPaymentStatusRequest = { session: { awardDetails: claimData.validClaim(), 'death-payment-details': { amount: 100.0 } } };

const accountDetailsRequest = {
  session: {
    awardDetails: claimData.validClaim(),
    death: {
      'death-payee-account': payeeDetailsValidResponse,
    },
  },
};

const accountDetails = { accountName: 'Derek Trotter', accountNumber: '12345678', sortCode: '112233' };
const contactDetails = {
  'dap-name': { name: 'Rodney Trotter' },
  'dap-phone-number': { phoneNumber: '000000' },
  'dap-address': { address: '10091853817' },
  'dap-postcode': { postcode: 'NE1 1RT' },
  'address-lookup': addressData.multipleAddressesNoneEmpty(),
};

const payArrearsRequest = {
  session: {
    awardDetails: claimData.validClaim(),
    death: {
      'death-payee-account': accountDetails,
    },
    'death-payee-details': {
      BLOG123456: payeeDetailsValidResponse,
    },
  },
  flash: flashMock,
};

const payArrearsWithUpdatedContactDetailsRequest = {
  session: {
    awardDetails: claimData.validClaim(),
    death: {
      'death-payee-account': accountDetails,
    },
    'death-payee-details': {
      BLOG123456: payeeDetailsValidResponse,
    },
    'death-payee-details-updated': contactDetails,
  },
  flash: flashMock,
};

const emptyPostRequest = { session: { awardDetails: claimData.validClaim() }, body: {} };
const validBankPostRequest = { user: { cis: { surname: 'User', givenname: 'Test' } }, session: { awardDetails: claimData.validClaim() }, body: accountDetails };

const dapGetNameRequest = { session: { awardDetails: claimData.validClaim(), death: { } } };
const dapGetNamePopulatedRequest = { session: { awardDetails: claimData.validClaim(), death: { 'dap-name': { name: 'Margret Meldrew' } } } };

const dapPostNameInvalidRequest = { session: { awardDetails: claimData.validClaim() }, body: { name: '' } };
const dapPostNameValidRequest = { session: { awardDetails: claimData.validClaim() }, body: { name: 'Margret Meldrew' } };

const dapGetPhoneNumberRequest = { session: { awardDetails: claimData.validClaim(), death: { 'dap-name': { name: 'Margret Meldrew' } } } };
const dapGetPhoneNumberPopulatedRequest = { session: { awardDetails: claimData.validClaim(), death: { 'dap-name': { name: 'Margret Meldrew' }, 'dap-phone-number': { phoneNumber: '00000 000 000' } } } };

const dapPostPhoneNumberInvalidRequest = { session: { awardDetails: claimData.validClaim() }, body: { phoneNumber: '' } };
const dapPostPhoneNumberValidRequest = { session: { awardDetails: claimData.validClaim() }, body: { phoneNumber: '00000 000 000' } };

const dapGetPostcodeLookupRequest = { session: { awardDetails: claimData.validClaim() } };
const dapGetPostcodeLookupPopulatedRequest = { session: { awardDetails: claimData.validClaim(), death: { 'dap-postcode': { postcode: 'W1J 7NT' } } } };

const dapPostDapPostcodeLookupInvalidPost = { session: { awardDetails: claimData.validClaim() }, body: { postcode: '' } };
const postcodeValidPost = { session: { awardDetails: claimData.validClaim() }, body: { postcode: 'W1J 7NT' } };

const validSelectRequest = { session: { awardDetails: claimData.validClaim(), death: { 'address-lookup': addressData.multipleAddresses(), 'dap-postcode': { postcode: 'W1J 7NT' } } } };
const noAddressLookupSelectRequest = { session: { awardDetails: claimData.validClaim(), postcode: { postcode: 'W1J 7NT' } } };
const noPostcodeSelectRequest = { session: { awardDetails: claimData.validClaim(), addressLookup: addressData.multipleAddresses() } };

const validSelectPostRequest = { user: { cis: { surname: 'User', givenname: 'Test' } }, session: { awardDetails: claimData.validClaim(), death: { 'address-lookup': addressData.multipleAddresses(), 'dap-postcode': { postcode: 'W1J 7NT' } } }, body: { address: '10091853817' } };
const invalidSelectPostRequest = { session: { awardDetails: claimData.validClaim(), death: { 'address-lookup': addressData.multipleAddresses(), 'dap-postcode': { postcode: 'W1J 7NT' } } }, body: { address: '' } };
const validSelectPostSession = { 'address-lookup': addressData.multipleAddresses(), 'dap-postcode': { postcode: 'W1J 7NT' }, 'dap-address': { address: '10091853817' } };

const payeeDetailsValidPageData = {
  header: 'death-check-payee-details:header.default',
  back: '/changes-and-enquiries/personal',
  button: '/changes-and-enquiries/personal/death/account-details',
  buttonText: 'app:button.continue',
  name: 'Full name',
  phoneNumber: 'Phone number',
  address: '1 Thoroughfare name<br />Post town<br />Post code',
  enableChange: true,
};

const payeeDetailsUpdaterValidPageData = {
  header: 'death-check-payee-details:header.default',
  back: '/changes-and-enquiries/personal',
  button: '/changes-and-enquiries/personal/death/account-details',
  buttonText: 'app:button.continue',
  name: 'Rodney Trotter',
  phoneNumber: '000000',
  address: '148 PICCADILLY<br /> LONDON<br /> W1J 7NT',
  enableChange: true,
};

const payeeDetailsValidArrearsPageData = {
  header: 'death-check-payee-details:header.arrears',
  back: '/changes-and-enquiries/personal/death/retry-calculation',
  button: '/changes-and-enquiries/personal/death/update',
  buttonText: 'app:button.confirm',
  name: 'Full name',
  phoneNumber: 'Phone number',
  address: '1 Thoroughfare name<br />Post town<br />Post code',
  status: 'ARREARS',
};

const payArrearsDetailsValidPageData = {
  header: 'death-pay-arrears:header',
  back: '/changes-and-enquiries/personal/death/account-details',
  buttonHref: '/changes-and-enquiries/personal/death/process-arrears',
  buttonText: 'death-pay-arrears:button',
  paymentDetails: {
    amount: '£157.63',
    startDate: '28 January 2020',
    endDate: '28 February 2020',
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

const notFoundResponse = {
  data: [],
};

const errorMessage = {
  notFound: 'No address found with that postcode',
  other: 'Error - connection refused.',
};

const deathPayeeDetailsApiUri = '/api/award/death-payee-details';
const deathPayeeAccountDetailsUpdateApiUri = '/api/award/death-payee-account-details';
const deathPayeeContactDetailsUpdateApiUri = '/api/award/death-contact-details';
const postcodeLookupApiUri = '/address?excludeBusiness=true&showSourceData=true&postcode=W1J7NT';

let testPromise;

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

    testPromise = new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 30);
    });
  });
  afterEach(() => {
    nock.cleanAll();
  });

  describe('getCheckPayeeDetails function (GET /changes-and-enquiries/personal/death/payee-details)', () => {
    it('should return view with change data stored in session with cleared form data', async () => {
      await controller.getCheckPayeeDetails(checkPayeeUpdateDetailsRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death-payee/check-details');
      assert.deepEqual(genericResponse.data.pageData, payeeDetailsUpdaterValidPageData);
      assert.isUndefined(checkPayeeUpdateDetailsRequest.session.death);
    });

    it('should return view when receive 200 response from API', async () => {
      nock('http://test-url/').get(`${deathPayeeDetailsApiUri}/BLOG123456`).reply(httpStatus.OK, payeeDetailsValidResponse);
      await controller.getCheckPayeeDetails(checkPayeeDetailsRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death-payee/check-details');
      assert.deepEqual(genericResponse.data.pageData, payeeDetailsValidPageData);
    });

    it('should return view when receive 200 response from API with arrears payment status', async () => {
      nock('http://test-url/').get(`${deathPayeeDetailsApiUri}/BLOG123456`).reply(httpStatus.OK, payeeDetailsValidResponse);
      await controller.getCheckPayeeDetails(checkPayeeDetailsWithArrearsPaymentStatusRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death-payee/check-details');
      assert.deepEqual(genericResponse.data.pageData, payeeDetailsValidArrearsPageData);
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
      assert.deepEqual(genericResponse.data.pageData, payArrearsDetailsValidPageData);
    });
  });

  describe('getProcessArrears function (GET /changes-and-enquiries/personal/death/process-arrears)', () => {
    describe('no updated payee contact details', () => {
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
    describe('updated payee contact details', () => {
      it('should return view when receive 404 response from contact update from API', async () => {
        nock('http://test-url/').put(deathPayeeContactDetailsUpdateApiUri).reply(httpStatus.NOT_FOUND);
        nock('http://test-url/').put(deathPayeeAccountDetailsUpdateApiUri).reply(httpStatus.NOT_FOUND);
        await controller.getProcessArrears(payArrearsWithUpdatedContactDetailsRequest, genericResponse);
        assert.equal(genericResponse.address, '/changes-and-enquiries/personal/death/payee-arrears');
        assert.equal(flash.type, 'error');
        assert.equal(flash.message, 'app:errors.api.not-found');
      });
      it('should return view when receive 400 response from contact update from API', async () => {
        nock('http://test-url/').put(deathPayeeContactDetailsUpdateApiUri).reply(httpStatus.BAD_REQUEST);
        nock('http://test-url/').put(deathPayeeAccountDetailsUpdateApiUri).reply(httpStatus.OK);
        await controller.getProcessArrears(payArrearsWithUpdatedContactDetailsRequest, genericResponse);
        assert.equal(genericResponse.address, '/changes-and-enquiries/personal/death/payee-arrears');
        assert.equal(flash.type, 'error');
        assert.equal(flash.message, 'app:errors.api.bad-request');
      });
      it('should return view when receive 500 response from contact update from API', async () => {
        nock('http://test-url/').put(deathPayeeContactDetailsUpdateApiUri).reply(httpStatus.INTERNAL_SERVER_ERROR);
        nock('http://test-url/').put(deathPayeeAccountDetailsUpdateApiUri).reply(httpStatus.OK);
        await controller.getProcessArrears(payArrearsWithUpdatedContactDetailsRequest, genericResponse);
        assert.equal(genericResponse.address, '/changes-and-enquiries/personal/death/payee-arrears');
        assert.equal(flash.type, 'error');
        assert.equal(flash.message, 'app:errors.api.internal-server-error');
      });
      it('should return view when receive 200 response from contact update from API', async () => {
        nock('http://test-url/').put(deathPayeeContactDetailsUpdateApiUri).reply(httpStatus.OK);
        nock('http://test-url/').put(deathPayeeAccountDetailsUpdateApiUri).reply(httpStatus.OK);
        await controller.getProcessArrears(payArrearsWithUpdatedContactDetailsRequest, genericResponse);
        assert.equal(genericResponse.address, '/changes-and-enquiries/personal');
        assert.equal(flash.type, 'success');
        assert.equal(flash.message, 'death-process-arrears:messages.success');
        assert.isUndefined(payArrearsWithUpdatedContactDetailsRequest.session.death);
        assert.isUndefined(payArrearsWithUpdatedContactDetailsRequest.session['death-payee-details-updated']);
        assert.isUndefined(payArrearsWithUpdatedContactDetailsRequest.session['death-payee-details']);
      });
    });
  });

  describe('getDapName function (GET /changes-and-enquiries/personal/death/payee-details/name)', () => {
    it('should display blank form when requested', (done) => {
      controller.getPayeeName(dapGetNameRequest, genericResponse);
      assert.deepEqual(genericResponse.data.awardDetails, claimData.validClaim());
      assert.isUndefined(genericResponse.data.details);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death-payee/dap/name');
      done();
    });
    it('should display populated form when requested', (done) => {
      controller.getPayeeName(dapGetNamePopulatedRequest, genericResponse);
      assert.deepEqual(genericResponse.data.awardDetails, claimData.validClaim());
      assert.deepEqual(genericResponse.data.details, { name: 'Margret Meldrew' });
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death-payee/dap/name');
      done();
    });
  });

  describe('postPayeeName function (POST /changes-and-enquiries/personal/death/payee-details/name)', () => {
    it('should return form again with error when invalid data supplied', (done) => {
      controller.postPayeeName(dapPostNameInvalidRequest, genericResponse);
      assert.deepEqual(genericResponse.data.awardDetails, claimData.validClaim());
      assert.deepEqual(genericResponse.data.errors.name.text, 'death-dap:fields.name.errors.required');
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death-payee/dap/name');
      done();
    });

    it('should return redirect and save data to session when valid data supplied', (done) => {
      controller.postPayeeName(dapPostNameValidRequest, genericResponse);
      assert.deepEqual(dapPostNameValidRequest.session.death['dap-name'], { name: 'Margret Meldrew' });
      assert.equal(genericResponse.address, '/changes-and-enquiries/personal/death/payee-details/phone-number');
      done();
    });
  });

  describe('getPayeePhoneNumber function (GET /changes-and-enquiries/personal/death/payee-details/phone-number)', () => {
    it('should display blank form when requested', (done) => {
      controller.getPayeePhoneNumber(dapGetPhoneNumberRequest, genericResponse);
      assert.deepEqual(genericResponse.data.awardDetails, claimData.validClaim());
      assert.isUndefined(genericResponse.data.details);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death-payee/dap/phone-number');
      done();
    });

    it('should display populated form when requested', (done) => {
      controller.getPayeePhoneNumber(dapGetPhoneNumberPopulatedRequest, genericResponse);
      assert.deepEqual(genericResponse.data.awardDetails, claimData.validClaim());
      assert.deepEqual(genericResponse.data.details, { phoneNumber: '00000 000 000' });
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death-payee/dap/phone-number');
      done();
    });
  });

  describe('postPayeePhoneNumber function (POST /changes-and-enquiries/personal/death/payee-details/phone-number)', () => {
    it('should return form again with error when invalid data supplied', (done) => {
      controller.postPayeePhoneNumber(dapPostPhoneNumberInvalidRequest, genericResponse);
      assert.deepEqual(genericResponse.data.awardDetails, claimData.validClaim());
      assert.deepEqual(genericResponse.data.errors.phoneNumber.text, 'death-dap:fields.phone-number.errors.required');
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death-payee/dap/phone-number');
      done();
    });

    it('should return redirect and save data to session when valid data supplied', (done) => {
      controller.postPayeePhoneNumber(dapPostPhoneNumberValidRequest, genericResponse);
      assert.deepEqual(dapPostPhoneNumberValidRequest.session.death['dap-phone-number'], { phoneNumber: '00000 000 000' });
      assert.equal(genericResponse.address, '/changes-and-enquiries/personal/death/payee-details/address');
      done();
    });
  });

  describe('getPayeePostcodeLookup function (GET /changes-and-enquiries/personal/death/payee-details/address)', () => {
    it('display blank form when requested', (done) => {
      controller.getPayeePostcodeLookup(dapGetPostcodeLookupRequest, genericResponse);
      assert.deepEqual(genericResponse.data.awardDetails, claimData.validClaim());
      assert.isUndefined(genericResponse.data.details);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death-payee/dap/postcode');
      done();
    });
    it('display populated form when requested', (done) => {
      controller.getPayeePostcodeLookup(dapGetPostcodeLookupPopulatedRequest, genericResponse);
      assert.deepEqual(genericResponse.data.awardDetails, claimData.validClaim());
      assert.deepEqual(genericResponse.data.details, dapGetPostcodeLookupPopulatedRequest.session.death['dap-postcode']);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death-payee/dap/postcode');
      done();
    });
  });

  describe('postPayeePostcodeLookup function (POST /changes-and-enquiries/personal/death/payee-details/address)', () => {
    it('should return validation error when postcode is empty', () => {
      controller.postPayeePostcodeLookup(dapPostDapPostcodeLookupInvalidPost, genericResponse);
      assert.equal(Object.keys(genericResponse.data.errors).length, 1);
      assert.equal(genericResponse.data.errors.postcode.text, 'address:fields.postcode.errors.required');
      assert.deepEqual(genericResponse.data.awardDetails, claimData.validClaim());
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death-payee/dap/postcode');
    });

    it('should return error when postcode does not exist', () => {
      nock('http://test-url/').get(postcodeLookupApiUri).reply(httpStatus.OK, notFoundResponse);
      controller.postPayeePostcodeLookup(postcodeValidPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.globalError, errorMessage.notFound);
        assert.deepEqual(genericResponse.data.awardDetails, claimData.validClaim());
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death-payee/dap/postcode');
      });
    });

    it('should return error when postcode lookup returns unauthorized', () => {
      nock('http://test-url/').get(postcodeLookupApiUri).reply(httpStatus.UNAUTHORIZED, {});
      controller.postPayeePostcodeLookup(postcodeValidPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.globalError, errorMessage.other);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death-payee/dap/postcode');
        assert.equal(genericResponse.locals.logMessage, '401 - undefined - Requested on address?excludeBusiness=true&showSourceData=true&postcode=W1J7NT');
      });
    });

    it('should return error when postcode lookup returns forbidden', () => {
      nock('http://test-url/').get(postcodeLookupApiUri).reply(httpStatus.FORBIDDEN, {});
      controller.postPayeePostcodeLookup(postcodeValidPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.globalError, errorMessage.other);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death-payee/dap/postcode');
        assert.equal(genericResponse.locals.logMessage, '403 - undefined - Requested on address?excludeBusiness=true&showSourceData=true&postcode=W1J7NT');
      });
    });

    it('should return error when postcode lookup returns bad request', () => {
      nock('http://test-url/').get(postcodeLookupApiUri).reply(httpStatus.BAD_REQUEST, {});
      controller.postPayeePostcodeLookup(postcodeValidPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.globalError, errorMessage.other);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death-payee/dap/postcode');
        assert.equal(genericResponse.locals.logMessage, '400 - undefined - Requested on address?excludeBusiness=true&showSourceData=true&postcode=W1J7NT');
      });
    });

    it('should return error when postcode lookup returns not found', () => {
      nock('http://test-url/').get(postcodeLookupApiUri).reply(httpStatus.NOT_FOUND, {});
      controller.postPayeePostcodeLookup(postcodeValidPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.globalError, errorMessage.notFound);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death-payee/dap/postcode');
        assert.equal(genericResponse.locals.logMessage, '404 - undefined - Requested on address?excludeBusiness=true&showSourceData=true&postcode=W1J7NT');
      });
    });

    it('should return addresses when postcode lookup return is success', () => {
      nock('http://test-url/').get(postcodeLookupApiUri).reply(httpStatus.OK, addressData.multipleAddresses());
      controller.postPayeePostcodeLookup(postcodeValidPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(postcodeValidPost.session.death['dap-postcode'].postcode, 'W1J 7NT');
        assert.equal(JSON.stringify(postcodeValidPost.session.death['address-lookup']), JSON.stringify(addressData.multipleAddresses()));
        assert.equal(genericResponse.address, '/changes-and-enquiries/personal/death/payee-details/address-select');
      });
    });
  });

  describe('getPayeeAddressSelect function (GET /changes-and-enquiries/personal/death/payee-details/address-select)', () => {
    it('should return change address select page', (done) => {
      controller.getPayeeAddressSelect(validSelectRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death-payee/dap/address-select');
      done();
    });

    it('should return error page when addressLookup not in session', (done) => {
      controller.getPayeeAddressSelect(noAddressLookupSelectRequest, genericResponse);
      assert.equal(genericResponse.data.status, '- Issue getting address data.');
      assert.equal(genericResponse.viewName, 'pages/error');
      done();
    });

    it('should return error page when postcode not in session', (done) => {
      controller.getPayeeAddressSelect(noPostcodeSelectRequest, genericResponse);
      assert.equal(genericResponse.data.status, '- Issue getting address data.');
      assert.equal(genericResponse.viewName, 'pages/error');
      done();
    });

    it('should return address select page when valid request supplied', (done) => {
      controller.getPayeeAddressSelect(validSelectRequest, genericResponse);
      assert.equal(JSON.stringify(genericResponse.data.postCodeDetails), '{"postcode":"W1J 7NT"}');
      assert.equal(JSON.stringify(genericResponse.data.addressList), JSON.stringify(addressData.multipleAddressesList()));
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death-payee/dap/address-select');
      done();
    });
  });

  describe('postPayeeAddressSelect function (POST /changes-and-enquiries/personal/death/payee-details/address-select)', () => {
    it('should return validation error when address is empty', () => {
      controller.postPayeeAddressSelect(invalidSelectPostRequest, genericResponse);
      assert.equal(Object.keys(genericResponse.data.errors).length, 1);
      assert.equal(genericResponse.data.errors.address.text, 'address:fields.address.errors.required');
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death-payee/dap/address-select');
    });

    it('should return a redirect to payment page and set relevant session data', () => {
      controller.postPayeeAddressSelect(validSelectPostRequest, genericResponse);
      assert.isUndefined(validSelectPostRequest.session.death);
      assert.deepEqual(validSelectPostRequest.session['death-payee-details-updated'], validSelectPostSession);
      assert.equal(genericResponse.address, '/changes-and-enquiries/personal/death/payee-details');
    });
  });
});
