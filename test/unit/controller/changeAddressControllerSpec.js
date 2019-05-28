const { assert } = require('chai');
const nock = require('nock');
const httpStatus = require('http-status-codes');

nock.disableNetConnect();

const addressController = require('../../../app/routes/changes-enquiries/address/functions');

const responseHelper = require('../../lib/responseHelper');
const claimData = require('../../lib/claimData');
const addressData = require('../../lib/addressData');

let testPromise;
let genericResponse = {};
const validRequest = { session: { awardDetails: claimData.validClaim() } };
const postcodeValidPost = { session: { awardDetails: claimData.validClaim() }, body: { postcode: 'W1J 7NT' } };
const postcodeInvalidPost = { session: { awardDetails: claimData.validClaim() }, body: { postcode: '' } };

const validSelectRequest = { session: { awardDetails: claimData.validClaim(), addressLookup: addressData.multipleAddresses(), postcode: { postcode: 'W1J 7NT' } } };
const noAddressLookupSelectRequest = { session: { awardDetails: claimData.validClaim(), postcode: { postcode: 'W1J 7NT' } } };
const noPostcodeSelectRequest = { session: { awardDetails: claimData.validClaim(), addressLookup: addressData.multipleAddresses() } };

const validSelectPostRequest = { user: { cis: { surname: 'User', givenname: 'Test' } }, session: { awardDetails: claimData.validClaim(), addressLookup: addressData.multipleAddresses(), postcode: { postcode: 'W1J 7NT' } }, body: { address: '10091853817' } };
const invalidSelectPostRequest = { session: { awardDetails: claimData.validClaim(), addressLookup: addressData.multipleAddresses(), postcode: { postcode: 'W1J 7NT' } }, body: { address: '' } };

const notFoundResponse = {
  addressResults: null,
  error: {
    message: 'No addresses could be found using the postcode:W1J 7NT',
    statusCode: 200,
  },
};

const errorMessage = {
  notFound: 'No address found with that postcode',
  other: 'Error - connection refused.',
};

const updateErrorMessages = {
  400: 'Error - connection refused.',
  404: 'Error - award not found.',
  500: 'Error - could not save data.',
};

const reqHeaders = { reqheaders: { agentRef: 'Test User' } };

const postcodeLookupApiUri = '/addresses?postcode=W1J7NT';
const awardDetailsUpdateApiUri = '/api/award/updateaddressdetails';

describe('Change address controller ', () => {
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
      }, 100);
    });
  });
  afterEach(() => {
    nock.cleanAll();
  });

  describe('getPostcodeLookup function (GET /changes-enquiries/address)', () => {
    it('should return change address page', (done) => {
      addressController.getPostcodeLookup(validRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/address/index');
      done();
    });
  });

  describe('postPostcodeLookup function (POST /changes-enquiries/address)', () => {
    it('should return validation error when postcode is empty', () => {
      addressController.postPostcodeLookup(postcodeInvalidPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(Object.keys(genericResponse.data.errors).length, 1);
        assert.equal(genericResponse.data.errors.postcode.text, 'address:fields.postcode.errors.required');
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/address/index');
      });
    });

    it('should return error when postcode does not exist', () => {
      nock('http://test-url/').get(postcodeLookupApiUri).reply(httpStatus.OK, notFoundResponse);
      addressController.postPostcodeLookup(postcodeValidPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.globalError, errorMessage.notFound);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/address/index');
      });
    });

    it('should return error when postcode lookup returns unauthorized', () => {
      nock('http://test-url/').get(postcodeLookupApiUri).reply(httpStatus.UNAUTHORIZED, {});
      addressController.postPostcodeLookup(postcodeValidPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.globalError, errorMessage.other);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/address/index');
        assert.equal(genericResponse.locals.logMessage, '401 - 401 - {} - Requested on addresses?postcode=W1J7NT');
      });
    });

    it('should return error when postcode lookup returns forbidden', () => {
      nock('http://test-url/').get(postcodeLookupApiUri).reply(httpStatus.FORBIDDEN, {});
      addressController.postPostcodeLookup(postcodeValidPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.globalError, errorMessage.other);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/address/index');
        assert.equal(genericResponse.locals.logMessage, '403 - 403 - {} - Requested on addresses?postcode=W1J7NT');
      });
    });

    it('should return error when postcode lookup returns bad request', () => {
      nock('http://test-url/').get(postcodeLookupApiUri).reply(httpStatus.BAD_REQUEST, {});
      addressController.postPostcodeLookup(postcodeValidPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.globalError, errorMessage.other);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/address/index');
        assert.equal(genericResponse.locals.logMessage, '400 - 400 - {} - Requested on addresses?postcode=W1J7NT');
      });
    });

    it('should return error when postcode lookup returns not found', () => {
      nock('http://test-url/').get(postcodeLookupApiUri).reply(httpStatus.NOT_FOUND, {});
      addressController.postPostcodeLookup(postcodeValidPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.globalError, errorMessage.notFound);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/address/index');
        assert.equal(genericResponse.locals.logMessage, '404 - 404 - {} - Requested on addresses?postcode=W1J7NT');
      });
    });

    it('should return addresses when postcode lookup return is success', () => {
      nock('http://test-url/').get(postcodeLookupApiUri).reply(httpStatus.OK, addressData.multipleAddresses());
      addressController.postPostcodeLookup(postcodeValidPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(postcodeValidPost.session.postcode.postcode, 'W1J 7NT');
        assert.equal(JSON.stringify(postcodeValidPost.session.addressLookup), JSON.stringify(addressData.multipleAddresses()));
        assert.equal(genericResponse.address, '/changes-and-enquiries/address/select');
      });
    });
  });

  describe('getSelectAddress function (GET /changes-enquiries/address/select)', () => {
    it('should return change address select page', (done) => {
      addressController.getSelectAddress(validSelectRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/address/select');
      done();
    });

    it('should return error page when addressLookup not in session', (done) => {
      addressController.getSelectAddress(noAddressLookupSelectRequest, genericResponse);
      assert.equal(genericResponse.data.status, '- Issue getting address data.');
      assert.equal(genericResponse.viewName, 'pages/error');
      done();
    });

    it('should return error page when postcode not in session', (done) => {
      addressController.getSelectAddress(noPostcodeSelectRequest, genericResponse);
      assert.equal(genericResponse.data.status, '- Issue getting address data.');
      assert.equal(genericResponse.viewName, 'pages/error');
      done();
    });

    it('should return address select page when valid request supplied', (done) => {
      addressController.getSelectAddress(validSelectRequest, genericResponse);
      assert.equal(JSON.stringify(genericResponse.data.postCodeDetails), '{"postcode":"W1J 7NT"}');
      assert.equal(JSON.stringify(genericResponse.data.addressList), JSON.stringify(addressData.multipleAddressesList()));
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/address/select');
      done();
    });
  });

  describe('postSelectAddress function (POST /changes-enquiries/address/select)', () => {
    it('should return validation error when address is empty', () => {
      addressController.postSelectAddress(invalidSelectPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(Object.keys(genericResponse.data.errors).length, 1);
        assert.equal(genericResponse.data.errors.address.text, 'address:fields.address.errors.required');
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/address/select');
      });
    });

    it('should return view with error when API returns 400 state', () => {
      nock('http://test-url/', reqHeaders).put(awardDetailsUpdateApiUri).reply(httpStatus.BAD_REQUEST, {});
      addressController.postSelectAddress(validSelectPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.locals.logMessage, '400 - 400 - {} - Requested on api/award/updateaddressdetails');
        assert.equal(genericResponse.data.globalError, updateErrorMessages[400]);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/address/select');
      });
    });

    it('should return view with error when API returns 404 state', () => {
      nock('http://test-url/', reqHeaders).put(awardDetailsUpdateApiUri).reply(httpStatus.NOT_FOUND, {});
      addressController.postSelectAddress(validSelectPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.locals.logMessage, '404 - 404 - {} - Requested on api/award/updateaddressdetails');
        assert.equal(genericResponse.data.globalError, updateErrorMessages[404]);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/address/select');
      });
    });

    it('should return view with error when API returns 500 state', () => {
      nock('http://test-url/', reqHeaders).put(awardDetailsUpdateApiUri).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
      addressController.postSelectAddress(validSelectPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on api/award/updateaddressdetails');
        assert.equal(genericResponse.data.globalError, updateErrorMessages[500]);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/address/select');
      });
    });

    it('should return a redirect to contact and clear relevant session data when API returns 200', () => {
      nock('http://test-url/', reqHeaders).put(awardDetailsUpdateApiUri).reply(httpStatus.OK, {});
      addressController.postSelectAddress(validSelectPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(validSelectPostRequest.session.addressLookup, undefined);
        assert.equal(validSelectPostRequest.session.postcode, undefined);
        assert.equal(genericResponse.address, '/changes-and-enquiries/contact');
      });
    });
  });
});
