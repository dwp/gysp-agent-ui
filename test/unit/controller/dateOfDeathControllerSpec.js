const { assert } = require('chai');
const nock = require('nock');
const httpStatus = require('http-status-codes');

nock.disableNetConnect();

const controller = require('../../../app/routes/changes-enquiries/death/functions');

const responseHelper = require('../../lib/responseHelper');
const claimData = require('../../lib/claimData');
const addressData = require('../../lib/addressData');

let testPromise;
let genericResponse = {};

let flash = { type: '', message: '' };
const flashMock = (type, message) => {
  flash.type = type;
  flash.message = message;
};

const errorMessage = {
  notFound: 'No address found with that postcode',
  other: 'Error - connection refused.',
};

const keyDetails = {
  fullName: 'Joe Bloggs', nino: 'AA 37 07 73 A', status: { text: 'RECEIVING STATE PENSION', class: 'active' }, dateOfBirth: null,
};

const enterDateOfDeathRequest = { session: { awardDetails: claimData.validClaim() } };
const enterDateOfDeathResponse = {
  keyDetails,
  awardDetails: claimData.validClaim(),
};

const dapGetNameRequest = { session: { awardDetails: claimData.validClaim(), death: { 'dap-name': { name: 'Margret Meldrew' } } } };

const dapPostNameInvalidRequest = { session: { awardDetails: claimData.validClaim() }, body: { name: '' } };
const dapPostNameValidRequest = { session: { awardDetails: claimData.validClaim() }, body: { name: 'Margret Meldrew' } };

const dapGetPhoneNumberRequest = { session: { awardDetails: claimData.validClaim(), death: { 'dap-name': { name: 'Margret Meldrew' }, 'dap-phone-number': { phoneNumber: '00000 000 000' } } } };

const dapPostPhoneNumberInvalidRequest = { session: { awardDetails: claimData.validClaim() }, body: { phoneNumber: '' } };
const dapPostPhoneNumberValidRequest = { session: { awardDetails: claimData.validClaim() }, body: { phoneNumber: '00000 000 000' } };

const dapGetPostcodeLookupRequest = { session: { awardDetails: claimData.validClaim(), death: { 'address-lookup': addressData.multipleAddresses(), 'dap-address': { address: '12123123123' } } }, body: { postcode: 'NE1 1ET' } };

const dapGetPostcodeLookupInvalidPost = { session: { awardDetails: claimData.validClaim() }, body: { postcode: '' } };
const postcodeValidPost = { session: { awardDetails: claimData.validClaim() }, body: { postcode: 'W1J 7NT' } };

const validSelectRequest = { session: { awardDetails: claimData.validClaim(), death: { 'address-lookup': addressData.multipleAddresses(), 'dap-postcode': { postcode: 'W1J 7NT' } } } };
const noAddressLookupSelectRequest = { session: { awardDetails: claimData.validClaim(), postcode: { postcode: 'W1J 7NT' } } };
const noPostcodeSelectRequest = { session: { awardDetails: claimData.validClaim(), addressLookup: addressData.multipleAddresses() } };

const validVSelectPostRequest = { user: { cis: { surname: 'User', givenname: 'Test' } }, session: { awardDetails: claimData.validClaim(), death: { 'date-of-death': { verification: 'V' }, 'address-lookup': addressData.multipleAddresses(), 'dap-postcode': { postcode: 'W1J 7NT' } } }, body: { address: '10091853817' } };
const validNVSelectPostRequest = { user: { cis: { surname: 'User', givenname: 'Test' } }, session: { awardDetails: claimData.validClaim(), death: { 'date-of-death': { verification: 'NV' }, 'address-lookup': addressData.multipleAddresses(), 'dap-postcode': { postcode: 'W1J 7NT' } } }, body: { address: '10091853817' } };
const invalidSelectPostRequest = { session: { awardDetails: claimData.validClaim(), death: { 'address-lookup': addressData.multipleAddresses(), 'dap-postcode': { postcode: 'W1J 7NT' } } }, body: { address: '' } };

const notFoundResponse = {
  addressResults: null,
  error: {
    message: 'No addresses could be found using the postcode:W1J 7NT',
    statusCode: 200,
  },
};

const verifyDeathRequest = { session: { awardDetails: claimData.validClaimWithDeathNotVerified() } };
const verifyDeathResponse = {
  keyDetails: {
    fullName: 'Joe Bloggs', nino: 'AA 37 07 73 A', status: { text: 'DEAD - NOT VERIFIED', class: 'dead' }, dateOfBirth: null,
  },
  awardDetails: claimData.validClaimWithDeathNotVerified(),
  dateOfDeath: '1 January 2019',
};

const verifiedResponse = {
  keyDetails: {
    fullName: 'Joe Bloggs', nino: 'AA 37 07 73 A', status: { text: 'DEAD - NOT VERIFIED', class: 'dead' }, dateOfBirth: null,
  },
  awardDetails: claimData.validClaimWithDeathNotVerified(),
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
      'dap-name': {
        name: 'Margaret Meldrew',
      },
      'dap-phone-number': {
        phoneNumber: '0000 000 000',
      },
      'dap-address': { address: '10091853817' },
      'address-lookup': addressData.multipleAddressesNoneEmpty(),
    },
  },
  flash: flashMock,
};

const paymentRequestNotVerified = {
  user: { cis: { surname: 'User', givenname: 'Test' } },
  session: {
    awardDetails: claimData.validClaim(),
    death: {
      'date-of-death': {
        dateYear: '2019', dateMonth: '01', dateDay: '01', verification: 'NV',
      },
      'dap-name': {
        name: 'Margaret Meldrew',
      },
      'dap-phone-number': {
        phoneNumber: '0000 000 000',
      },
      'death-payment': {
        amount: '-100.0',
      },
      'dap-address': { address: '10091853817' },
      'address-lookup': addressData.multipleAddressesNoneEmpty(),
    },
  },
  flash: flashMock,
};

const paymentRequestNotVerifiedArrears = {
  user: { cis: { surname: 'User', givenname: 'Test' } },
  session: {
    awardDetails: claimData.validClaim(),
    death: {
      'date-of-death': {
        dateYear: '2019', dateMonth: '01', dateDay: '01', verification: 'NV',
      },
      'dap-name': {
        name: 'Margaret Meldrew',
      },
      'dap-phone-number': {
        phoneNumber: '0000 000 000',
      },
      'death-payment': {
        amount: '100.0',
      },
      'dap-address': { address: '10091853817' },
      'address-lookup': addressData.multipleAddressesNoneEmpty(),
    },
  },
  flash: flashMock,
};

const retryCalculationRequest = {
  user: { cis: { surname: 'User', givenname: 'Test' } },
  session: {
    awardDetails: claimData.validClaimWithDeathVerified(),
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
      'dap-name': {
        name: 'Margaret Meldrew',
      },
      'dap-phone-number': {
        phoneNumber: '0000 000 000',
      },
      'dap-address': { address: '10091853817' },
      'address-lookup': addressData.multipleAddressesNoneEmpty(),
    },
  },
  flash: flashMock,
};

const updateDeathRequest = {
  user: { cis: { surname: 'User', givenname: 'Test' } },
  session: {
    awardDetails: claimData.validClaim(),
    death: {
      'death-payment': {
        amount: 100.0,
        startDate: '2019-01-01T00:00:00.000Z',
        endDate: '2019-01-01T00:00:00.000Z',
      },
    },
  },
  flash: flashMock,
};

const updateDeathNullPaymentRequest = {
  user: { cis: { surname: 'User', givenname: 'Test' } },
  session: {
    awardDetails: claimData.validClaim(),
    death: {
      'death-payment': {
        amount: null,
        startDate: null,
        endDate: null,
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
const postcodeLookupApiUri = '/addresses?postcode=W1J7NT';
const deathArrearsUpdateApiUri = '/api/award/update-death-calculation';

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

  describe('getAddDateDeath function (GET /changes-and-enquiries/personal/death)', () => {
    it('should display form when page when requested', (done) => {
      controller.getAddDateDeath(enterDateOfDeathRequest, genericResponse);
      assert.equal(JSON.stringify(genericResponse.data), JSON.stringify(enterDateOfDeathResponse));
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death/enter-date');
      done();
    });
  });

  describe('postAddDateDeath function (POST /changes-and-enquiries/personal/death)', () => {
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
        assert.equal(genericResponse.address, '/changes-and-enquiries/personal/death/name');
      });
    });

    it('should save to session and redirect to next screen when post is valid and verification is NV', () => {
      controller.postAddDateDeath(validNVPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(validNVPostRequest.session.death['date-of-death'].dateYear, validNVPostRequest.body.dateYear);
        assert.equal(validNVPostRequest.session.death['date-of-death'].dateMonth, validNVPostRequest.body.dateMonth);
        assert.equal(validNVPostRequest.session.death['date-of-death'].dateDay, validNVPostRequest.body.dateDay);
        assert.equal(validNVPostRequest.session.death['date-of-death'].verification, validNVPostRequest.body.verification);
        assert.equal(genericResponse.address, '/changes-and-enquiries/personal/death/name');
      });
    });
  });

  describe('getDapName function (GET /changes-and-enquiries/personal/death/name)', () => {
    it('should display form when requested', (done) => {
      controller.getDapName(dapGetNameRequest, genericResponse);
      assert.deepEqual(genericResponse.data.awardDetails, claimData.validClaim());
      assert.deepEqual(genericResponse.data.keyDetails, keyDetails);
      assert.deepEqual(genericResponse.data.details, { name: 'Margret Meldrew' });
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death/dap/name');
      done();
    });
  });

  describe('postDapName function (POST /changes-and-enquiries/personal/death/name)', () => {
    it('should return form again with error when invalid data supplied', (done) => {
      controller.postDapName(dapPostNameInvalidRequest, genericResponse);
      assert.deepEqual(genericResponse.data.awardDetails, claimData.validClaim());
      assert.deepEqual(genericResponse.data.keyDetails, keyDetails);
      assert.deepEqual(genericResponse.data.errors.name.text, 'death-dap:fields.name.errors.required');
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death/dap/name');
      done();
    });

    it('should return redirect and save data to session when valid data supplied', (done) => {
      controller.postDapName(dapPostNameValidRequest, genericResponse);
      assert.deepEqual(dapPostNameValidRequest.session.death['dap-name'], { name: 'Margret Meldrew' });
      assert.equal(genericResponse.address, '/changes-and-enquiries/personal/death/phone-number');
      done();
    });
  });

  describe('getDapPhoneNumber function (GET /changes-and-enquiries/personal/death/phone-number)', () => {
    it('should display form when requested', (done) => {
      controller.getDapPhoneNumber(dapGetPhoneNumberRequest, genericResponse);
      assert.deepEqual(genericResponse.data.awardDetails, claimData.validClaim());
      assert.deepEqual(genericResponse.data.keyDetails, keyDetails);
      assert.deepEqual(genericResponse.data.details, { phoneNumber: '00000 000 000' });
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death/dap/phone-number');
      done();
    });
  });

  describe('postDapName function (POST /changes-and-enquiries/personal/death/phone-number)', () => {
    it('should return form again with error when invalid data supplied', (done) => {
      controller.postDapPhoneNumber(dapPostPhoneNumberInvalidRequest, genericResponse);
      assert.deepEqual(genericResponse.data.awardDetails, claimData.validClaim());
      assert.deepEqual(genericResponse.data.keyDetails, keyDetails);
      assert.deepEqual(genericResponse.data.errors.phoneNumber.text, 'death-dap:fields.phone-number.errors.required');
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death/dap/phone-number');
      done();
    });

    it('should return redirect and save data to session when valid data supplied', (done) => {
      controller.postDapPhoneNumber(dapPostPhoneNumberValidRequest, genericResponse);
      assert.deepEqual(dapPostPhoneNumberValidRequest.session.death['dap-phone-number'], { phoneNumber: '00000 000 000' });
      assert.equal(genericResponse.address, '/changes-and-enquiries/personal/death/address');
      done();
    });
  });

  describe('getPostcodeLookup function (GET /changes-and-enquiries/personal/death/address)', () => {
    it('should return change address page', (done) => {
      controller.getDapPostcodeLookup(dapGetPostcodeLookupRequest, genericResponse);
      assert.isUndefined(dapGetPostcodeLookupRequest.session.death['address-lookup']);
      assert.isUndefined(dapGetPostcodeLookupRequest.session.death['dap-address']);
      assert.deepEqual(genericResponse.data.keyDetails, keyDetails);
      assert.deepEqual(genericResponse.data.awardDetails, claimData.validClaim());
      assert.deepEqual(genericResponse.data.keyDetails, keyDetails);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death/dap/postcode');
      done();
    });
  });

  describe('postPostcodeLookup function (POST /changes-and-enquiries/personal/death/address)', () => {
    it('should return validation error when postcode is empty', () => {
      controller.postDapPostcodeLookup(dapGetPostcodeLookupInvalidPost, genericResponse);
      assert.equal(Object.keys(genericResponse.data.errors).length, 1);
      assert.equal(genericResponse.data.errors.postcode.text, 'address:fields.postcode.errors.required');
      assert.deepEqual(genericResponse.data.awardDetails, claimData.validClaim());
      assert.deepEqual(genericResponse.data.keyDetails, keyDetails);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death/dap/postcode');
    });

    it('should return error when postcode does not exist', () => {
      nock('http://test-url/').get(postcodeLookupApiUri).reply(httpStatus.OK, notFoundResponse);
      controller.postDapPostcodeLookup(postcodeValidPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.globalError, errorMessage.notFound);
        assert.deepEqual(genericResponse.data.awardDetails, claimData.validClaim());
        assert.deepEqual(genericResponse.data.keyDetails, keyDetails);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death/dap/postcode');
      });
    });

    it('should return error when postcode lookup returns unauthorized', () => {
      nock('http://test-url/').get(postcodeLookupApiUri).reply(httpStatus.UNAUTHORIZED, {});
      controller.postDapPostcodeLookup(postcodeValidPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.globalError, errorMessage.other);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death/dap/postcode');
        assert.equal(genericResponse.locals.logMessage, '401 - 401 - {} - Requested on addresses?postcode=W1J7NT');
      });
    });

    it('should return error when postcode lookup returns forbidden', () => {
      nock('http://test-url/').get(postcodeLookupApiUri).reply(httpStatus.FORBIDDEN, {});
      controller.postDapPostcodeLookup(postcodeValidPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.globalError, errorMessage.other);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death/dap/postcode');
        assert.equal(genericResponse.locals.logMessage, '403 - 403 - {} - Requested on addresses?postcode=W1J7NT');
      });
    });

    it('should return error when postcode lookup returns bad request', () => {
      nock('http://test-url/').get(postcodeLookupApiUri).reply(httpStatus.BAD_REQUEST, {});
      controller.postDapPostcodeLookup(postcodeValidPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.globalError, errorMessage.other);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death/dap/postcode');
        assert.equal(genericResponse.locals.logMessage, '400 - 400 - {} - Requested on addresses?postcode=W1J7NT');
      });
    });

    it('should return error when postcode lookup returns not found', () => {
      nock('http://test-url/').get(postcodeLookupApiUri).reply(httpStatus.NOT_FOUND, {});
      controller.postDapPostcodeLookup(postcodeValidPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.globalError, errorMessage.notFound);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death/dap/postcode');
        assert.equal(genericResponse.locals.logMessage, '404 - 404 - {} - Requested on addresses?postcode=W1J7NT');
      });
    });

    it('should return addresses when postcode lookup return is success', () => {
      nock('http://test-url/').get(postcodeLookupApiUri).reply(httpStatus.OK, addressData.multipleAddresses());
      controller.postDapPostcodeLookup(postcodeValidPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(postcodeValidPost.session.death['dap-postcode'].postcode, 'W1J 7NT');
        assert.equal(JSON.stringify(postcodeValidPost.session.death['address-lookup']), JSON.stringify(addressData.multipleAddresses()));
        assert.equal(genericResponse.address, '/changes-and-enquiries/personal/death/address-select');
      });
    });
  });

  describe('getDapAddressSelect function (GET /changes-and-enquiries/personal/death/address-select)', () => {
    it('should return change address select page', (done) => {
      controller.getDapAddressSelect(validSelectRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death/dap/address-select');
      done();
    });

    it('should return error page when addressLookup not in session', (done) => {
      controller.getDapAddressSelect(noAddressLookupSelectRequest, genericResponse);
      assert.equal(genericResponse.data.status, '- Issue getting address data.');
      assert.equal(genericResponse.viewName, 'pages/error');
      done();
    });

    it('should return error page when postcode not in session', (done) => {
      controller.getDapAddressSelect(noPostcodeSelectRequest, genericResponse);
      assert.equal(genericResponse.data.status, '- Issue getting address data.');
      assert.equal(genericResponse.viewName, 'pages/error');
      done();
    });

    it('should return address select page when valid request supplied', (done) => {
      controller.getDapAddressSelect(validSelectRequest, genericResponse);
      assert.equal(JSON.stringify(genericResponse.data.postCodeDetails), '{"postcode":"W1J 7NT"}');
      assert.equal(JSON.stringify(genericResponse.data.addressList), JSON.stringify(addressData.multipleAddressesList()));
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death/dap/address-select');
      done();
    });
  });

  describe('postSelectAddress function (POST /changes-enquiries/address/select)', () => {
    it('should return validation error when address is empty', () => {
      controller.postDapAddressSelect(invalidSelectPostRequest, genericResponse);
      assert.equal(Object.keys(genericResponse.data.errors).length, 1);
      assert.equal(genericResponse.data.errors.address.text, 'address:fields.address.errors.required');
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death/dap/address-select');
    });

    it('should return a redirect to payment page and set relevant session data when date of death is V', () => {
      controller.postDapAddressSelect(validVSelectPostRequest, genericResponse);
      assert.equal(validVSelectPostRequest.session.death['dap-address'].address, validVSelectPostRequest.body.address);
      assert.equal(genericResponse.address, '/changes-and-enquiries/personal/death/payment');
    });

    it('should return a redirect to payment page and set relevant session data when date of death is NV', () => {
      controller.postDapAddressSelect(validNVSelectPostRequest, genericResponse);
      assert.equal(validNVSelectPostRequest.session.death['dap-address'].address, validNVSelectPostRequest.body.address);
      assert.equal(genericResponse.address, '/changes-and-enquiries/personal/death/record');
    });
  });

  describe('getDeathPayment function (GET /changes-and-enquiries/personal/death/payment)', () => {
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

  describe('getCheckDetails function (GET /changes-and-enquiries/personal/death/check-details)', () => {
    it('should return check details page for cannnot calculate', () => {
      controller.getCheckDetails(paymentRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death/check-details');
    });
    it('should return check details page for arrears', () => {
      controller.getCheckDetails(paymentRequestNotVerifiedArrears, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death/check-details');
    });
  });

  describe('getVerifyDeath function (GET /changes-and-enquiries/personal/death/verify)', () => {
    it('should display form when requested', (done) => {
      controller.getVerifyDeath(verifyDeathRequest, genericResponse);
      assert.equal(JSON.stringify(genericResponse.data), JSON.stringify(verifyDeathResponse));
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death/verify-date');
      done();
    });
  });

  describe('postVerifyDeath function (POST /changes-and-enquiries/personal/death)', () => {
    it('should return view name when called with empty post with errors', () => {
      controller.postVerifyDeath(emptyPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(Object.keys(genericResponse.data.errors).length, 1);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death/verify-date');
      });
    });

    it('should return a redirect to personal when API returns 200 state with valid yes post', () => {
      controller.postVerifyDeath(validYesPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.address, '/changes-and-enquiries/personal/death/payment');
      });
    });

    it('should return a redirect to verified date when API returns 200 state with valid no post', () => {
      controller.postVerifyDeath(validNoPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.address, '/changes-and-enquiries/personal/death/verified-date');
      });
    });
  });

  describe('getAddVerifedDeath function (GET /changes-and-enquiries/personal/death/verified-date)', () => {
    it('should display form when requested', (done) => {
      controller.getAddVerifedDeath(verifyDeathRequest, genericResponse);
      assert.equal(JSON.stringify(genericResponse.data), JSON.stringify(verifiedResponse));
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death/enter-date-verified');
      done();
    });
  });

  describe('postAddVerifedDeath function (POST /changes-and-enquiries/personal/death/verified-date)', () => {
    it('should return view name when called with empty post with errors', () => {
      controller.postAddVerifedDeath(emptyAddVerifedDeathPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(Object.keys(genericResponse.data.errors).length, 4);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death/enter-date-verified');
      });
    });

    it('should return a redirect when API returns 200 state with valid post', () => {
      controller.postAddVerifedDeath(validAddVerifedDeathPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.address, '/changes-and-enquiries/personal/death/payment');
      });
    });
  });

  describe('getRecordDeath function (GET /changes-and-enquiries/personal/death/record)', () => {
    it('should return view with error when API returns 400 state', () => {
      nock('http://test-url/', reqHeaders).put(deathDetailsUpdateApiUri).reply(httpStatus.BAD_REQUEST, {});
      controller.getRecordDeath(recordDeathRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(flash.type, 'error');
        assert.equal(flash.message, errorMessages[400]);
        assert.equal(genericResponse.address, 'back');
      });
    });

    it('should return view with error when API returns 404 state', () => {
      nock('http://test-url/', reqHeaders).put(deathDetailsUpdateApiUri).reply(httpStatus.NOT_FOUND, {});
      controller.getRecordDeath(recordDeathRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(flash.type, 'error');
        assert.equal(flash.message, errorMessages[404]);
        assert.equal(genericResponse.address, 'back');
      });
    });

    it('should return view with error when API returns 500 state', () => {
      nock('http://test-url/', reqHeaders).put(deathDetailsUpdateApiUri).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
      controller.getRecordDeath(recordDeathRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(flash.type, 'error');
        assert.equal(flash.message, errorMessages[500]);
        assert.equal(genericResponse.address, 'back');
      });
    });

    it('should return a redirect when API returns 200 with verified success message', () => {
      nock('http://test-url/', reqHeaders).put(deathDetailsUpdateApiUri).reply(httpStatus.OK, {});
      controller.getRecordDeath(paymentRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(flash.type, 'success');
        assert.equal(flash.message, 'death-record:messages.success.verified');
        assert.equal(genericResponse.address, '/changes-and-enquiries/personal');
      });
    });

    it('should return a redirect when API returns 200 with not verified success message', () => {
      nock('http://test-url/', reqHeaders).put(deathDetailsUpdateApiUri).reply(httpStatus.OK, {});
      controller.getRecordDeath(paymentRequestNotVerified, genericResponse);
      return testPromise.then(() => {
        assert.equal(flash.type, 'success');
        assert.equal(flash.message, 'death-record:messages.success.not-verified');
        assert.equal(genericResponse.address, '/changes-and-enquiries/personal');
      });
    });

    it('should return a redirect when API returns 200 with arrears success message', () => {
      nock('http://test-url/', reqHeaders).put(deathDetailsUpdateApiUri).reply(httpStatus.OK, {});
      controller.getRecordDeath(paymentRequestNotVerifiedArrears, genericResponse);
      return testPromise.then(() => {
        assert.equal(flash.type, 'success');
        assert.equal(flash.message, 'death-record:messages.success.arrears');
        assert.equal(genericResponse.address, '/changes-and-enquiries/personal');
      });
    });
  });

  describe('getRetryCalculation function (GET /changes-and-enquiries/personal/death/retry-calculation)', () => {
    const dateOfDeath = '2019-01-01';
    it('should return view with error when API returns 400 state', () => {
      nock('http://test-url/').get(deathArrearsApiUri)
        .query({ nino: retryCalculationRequest.session.awardDetails.nino, dateOfDeath })
        .reply(httpStatus.BAD_REQUEST, {});
      controller.getRetryCalculation(retryCalculationRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.locals.logMessage, '400 - 400 - {} - Requested on api/payment/death-arrears');
        assert.equal(flash.message, 'app:errors.api.bad-request');
        assert.equal(genericResponse.address, '/changes-and-enquiries/personal');
      });
    });

    it('should return view with error when API returns 500 state', () => {
      nock('http://test-url/').get(deathArrearsApiUri)
        .query({ nino: retryCalculationRequest.session.awardDetails.nino, dateOfDeath })
        .reply(httpStatus.INTERNAL_SERVER_ERROR, {});
      controller.getRetryCalculation(retryCalculationRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on api/payment/death-arrears');
        assert.equal(flash.message, 'app:errors.api.internal-server-error');
        assert.equal(genericResponse.address, '/changes-and-enquiries/personal');
      });
    });

    it('should display overpayment result when requested and API returns 200 with negative values', () => {
      nock('http://test-url/').get(deathArrearsApiUri)
        .query({ nino: retryCalculationRequest.session.awardDetails.nino, dateOfDeath })
        .reply(httpStatus.OK, deathArrearsResponses.overpayment);
      controller.getRetryCalculation(retryCalculationRequest, genericResponse);
      return testPromise.then(() => {
        assert.isDefined(genericResponse.data.details);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death/payment/overpayment');
      });
    });

    it('should display arrears result when requested and API returns 200 with positive values', () => {
      nock('http://test-url/').get(deathArrearsApiUri)
        .query({ nino: retryCalculationRequest.session.awardDetails.nino, dateOfDeath })
        .reply(httpStatus.OK, deathArrearsResponses.arrears);
      controller.getRetryCalculation(retryCalculationRequest, genericResponse);
      return testPromise.then(() => {
        assert.isDefined(genericResponse.data.details);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death/payment/arrears');
      });
    });

    it('should display nothing owed result when requested and API returns 200 with zero value', () => {
      nock('http://test-url/').get(deathArrearsApiUri)
        .query({ nino: retryCalculationRequest.session.awardDetails.nino, dateOfDeath })
        .reply(httpStatus.OK, deathArrearsResponses.nothingOwed);
      controller.getRetryCalculation(retryCalculationRequest, genericResponse);
      return testPromise.then(() => {
        assert.isDefined(genericResponse.data.details);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death/payment/nothing-owed');
      });
    });

    it('should display nothing owed result when requested and API returns 200 with null values', () => {
      nock('http://test-url/').get(deathArrearsApiUri)
        .query({ nino: retryCalculationRequest.session.awardDetails.nino, dateOfDeath })
        .reply(httpStatus.OK, deathArrearsResponses.cannotCalculate);
      controller.getRetryCalculation(retryCalculationRequest, genericResponse);
      return testPromise.then(() => {
        assert.isDefined(genericResponse.data.details);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/death/payment/cannot-calculate');
      });
    });
  });

  describe('getUpdateDeath function (GET /changes-and-enquiries/personal/death/update)', () => {
    it('should return a redirect when payment amount is null', () => {
      controller.getUpdateDeath(updateDeathNullPaymentRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.address, '/changes-and-enquiries/personal');
      });
    });
    it('should return view with error when API returns 400 state', () => {
      nock('http://test-url/', reqHeaders).put(deathArrearsUpdateApiUri).reply(httpStatus.BAD_REQUEST, {});
      controller.getUpdateDeath(updateDeathRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(flash.type, 'error');
        assert.equal(flash.message, errorMessages[400]);
        assert.equal(genericResponse.address, '/changes-and-enquiries/personal/death/retry-calculation');
      });
    });

    it('should return view with error when API returns 404 state', () => {
      nock('http://test-url/', reqHeaders).put(deathArrearsUpdateApiUri).reply(httpStatus.NOT_FOUND, {});
      controller.getUpdateDeath(updateDeathRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(flash.type, 'error');
        assert.equal(flash.message, errorMessages[404]);
        assert.equal(genericResponse.address, '/changes-and-enquiries/personal/death/retry-calculation');
      });
    });

    it('should return view with error when API returns 500 state', () => {
      nock('http://test-url/', reqHeaders).put(deathArrearsUpdateApiUri).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
      controller.getUpdateDeath(updateDeathRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(flash.type, 'error');
        assert.equal(flash.message, errorMessages[500]);
        assert.equal(genericResponse.address, '/changes-and-enquiries/personal/death/retry-calculation');
      });
    });

    it('should return a redirect when API returns 200', () => {
      nock('http://test-url/', reqHeaders).put(deathArrearsUpdateApiUri).reply(httpStatus.OK, {});
      controller.getUpdateDeath(updateDeathRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.address, '/changes-and-enquiries/personal');
      });
    });
  });
});
