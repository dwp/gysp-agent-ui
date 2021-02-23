const { assert } = require('chai');

const nock = require('nock');
const httpStatus = require('http-status-codes');

const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');
const i18nextConfig = require('../../../../config/i18next');

const addressController = require('../../../../app/routes/changes-enquiries/address/functions');

const responseHelper = require('../../../lib/responseHelper');
const claimData = require('../../../lib/claimData');
const addressData = require('../../../lib/addressData');
const { promiseWait } = require('../../../lib/unitHelper');
const kongData = require('../../../lib/kongData');
const requestKongHeaderData = require('../../../lib/requestKongHeaderData');

nock.disableNetConnect();

let genericResponse = {};
let testPromise;
let flash = { type: '', message: '' };

const flashMock = (type, message) => {
  flash.type = type;
  flash.message = message;
};

const reqHeaders = requestKongHeaderData();
const postcodeLookupApiUri = '/address?excludeBusiness=true&showSourceData=true&postcode=W1J7NT';
const updateAddressDetailsApiUri = '/api/award/updateaddressdetails';
const updateOverseasAddressApiUri = '/api/award/update-overseas-address';

const awardDetails = { session: { awardDetails: claimData.validClaim() } };

const validRequest = {
  ...awardDetails,
  body: { },
};
const postcodeValidPost = {
  session: { awardDetails: claimData.validClaim() },
  body: { postcode: 'W1J 7NT' },
};
const postcodeInvalidPost = {
  session: { awardDetails: claimData.validClaim() },
  body: { postcode: '' },
};

const validSelectRequest = {
  session: { awardDetails: claimData.validClaim(), addressLookup: addressData.multipleAddresses(), postcode: { postcode: 'W1J 7NT' } },
};
const noAddressLookupSelectRequest = {
  session: { awardDetails: claimData.validClaim(), postcode: { postcode: 'W1J 7NT' } },
};
const noPostcodeSelectRequest = {
  session: { awardDetails: claimData.validClaim(), addressLookup: addressData.multipleAddresses() },
};

const validSelectPostRequest = {
  ...kongData(),
  session: { awardDetails: claimData.validClaim(), addressLookup: addressData.multipleAddresses(), postcode: { postcode: 'W1J 7NT' } },
  body: { address: '10091853817' },
  flash: flashMock,
};
const invalidSelectPostRequest = {
  session: { awardDetails: claimData.validClaim(), addressLookup: addressData.multipleAddresses(), postcode: { postcode: 'W1J 7NT' } },
  body: { address: '' },
};

const postRequestEmpty = {
  ...awardDetails,
  body: {},
};

const postRequestInternationalAddress = {
  ...awardDetails,
  body: {
    'address-line-1': '1675',
    'address-line-2': 'Benik Road',
    'address-line-3': 'La Habra Heights',
    'address-line-4': 'California',
    'address-line-5': '90631',
    country: 'USA:United States of America',
  },
  ...kongData(),
  flash: flashMock,
};

const notFoundResponse = {
  data: [],
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

describe('Change address controller ', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

  beforeEach(() => {
    genericResponse = responseHelper.genericResponse();
    genericResponse.locals = responseHelper.localResponse(genericResponse);

    testPromise = promiseWait();

    flash = { type: '', message: '' };
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
        assert.equal(genericResponse.data.errors.postcode.text, 'You must enter a postcode');
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
        assert.equal(genericResponse.locals.logMessage, '401 - 401 - {} - Requested on address?excludeBusiness=true&showSourceData=true&postcode=W1J7NT');
      });
    });

    it('should return error when postcode lookup returns forbidden', () => {
      nock('http://test-url/').get(postcodeLookupApiUri).reply(httpStatus.FORBIDDEN, {});
      addressController.postPostcodeLookup(postcodeValidPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.globalError, errorMessage.other);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/address/index');
        assert.equal(genericResponse.locals.logMessage, '403 - 403 - {} - Requested on address?excludeBusiness=true&showSourceData=true&postcode=W1J7NT');
      });
    });

    it('should return error when postcode lookup returns bad request', () => {
      nock('http://test-url/').get(postcodeLookupApiUri).reply(httpStatus.BAD_REQUEST, {});
      addressController.postPostcodeLookup(postcodeValidPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.globalError, errorMessage.other);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/address/index');
        assert.equal(genericResponse.locals.logMessage, '400 - 400 - {} - Requested on address?excludeBusiness=true&showSourceData=true&postcode=W1J7NT');
      });
    });

    it('should return error when postcode lookup returns not found', () => {
      nock('http://test-url/').get(postcodeLookupApiUri).reply(httpStatus.NOT_FOUND, {});
      addressController.postPostcodeLookup(postcodeValidPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.globalError, errorMessage.notFound);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/address/index');
        assert.equal(genericResponse.locals.infoLogMessage, '404 - 404 - {} - Requested on address?excludeBusiness=true&showSourceData=true&postcode=W1J7NT');
      });
    });

    it('should return error when postcode lookup returns OK but data is empty', () => {
      nock('http://test-url/').get(postcodeLookupApiUri).reply(httpStatus.OK, addressData.emptyAddresses());
      addressController.postPostcodeLookup(postcodeValidPost, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.data.globalError, errorMessage.notFound);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/address/index');
        assert.equal(genericResponse.locals.infoLogMessage, '404 - address data not supplied - Requested on address?excludeBusiness=true&showSourceData=true&postcode=W1J7NT');
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
        assert.equal(genericResponse.data.errors.address.text, 'Select an address from the list');
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/address/select');
      });
    });

    it('should return view with error when API returns 400 state', () => {
      nock('http://test-url/', reqHeaders).put(updateAddressDetailsApiUri).reply(httpStatus.BAD_REQUEST, {});
      addressController.postSelectAddress(validSelectPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.locals.logMessage, '400 - 400 - {} - Requested on api/award/updateaddressdetails');
        assert.equal(genericResponse.data.globalError, updateErrorMessages[400]);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/address/select');
      });
    });

    it('should return view with error when API returns 404 state', () => {
      nock('http://test-url/', reqHeaders).put(updateAddressDetailsApiUri).reply(httpStatus.NOT_FOUND, {});
      addressController.postSelectAddress(validSelectPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.locals.logMessage, '404 - 404 - {} - Requested on api/award/updateaddressdetails');
        assert.equal(genericResponse.data.globalError, updateErrorMessages[404]);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/address/select');
      });
    });

    it('should return view with error when API returns 500 state', () => {
      nock('http://test-url/', reqHeaders).put(updateAddressDetailsApiUri).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
      addressController.postSelectAddress(validSelectPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on api/award/updateaddressdetails');
        assert.equal(genericResponse.data.globalError, updateErrorMessages[500]);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/address/select');
      });
    });

    it('should return a redirect to contact and clear relevant session data when API returns 200', () => {
      nock('http://test-url/', reqHeaders).put(updateAddressDetailsApiUri).reply(httpStatus.OK, {});
      addressController.postSelectAddress(validSelectPostRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(validSelectPostRequest.session.addressLookup, undefined);
        assert.equal(validSelectPostRequest.session.postcode, undefined);
        assert.equal(flash.type, 'success');
        assert.equal(flash.message, 'Address changed');
        assert.equal(genericResponse.address, '/changes-and-enquiries/contact');
      });
    });
  });

  describe('getInternationalAddress function (GET /changes-enquiries/address/international-address', () => {
    it('should display the /international-addresspage when requested', (done) => {
      addressController.getInternationalAddress(validRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/changes-enquiries/address/international-address');
      done();
    });
  });

  describe('postInternationalAddress function (POST /changes-enquiries/address/international-address', () => {
    it('should display the /international-addresspage, with errors, when requested with an empty form', () => {
      addressController.postInternationalAddress(postRequestEmpty, genericResponse);
      return testPromise.then(() => {
        assert.equal(Object.keys(genericResponse.data.errors).length, 3);
        assert.equal(genericResponse.data.errors['address-line-1'].text, 'Enter the first line of the address');
        assert.equal(genericResponse.data.errors['address-line-2'].text, 'Enter the second line of the address');
        assert.equal(genericResponse.data.errors.country.text, 'Enter a country name');
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/address/international-address');
      });
    });

    it('should display the /international-addresspage, with an error, when the API returns a 400 state', () => {
      nock('http://test-url/', reqHeaders).put(updateOverseasAddressApiUri).reply(httpStatus.BAD_REQUEST, {});
      addressController.postInternationalAddress(postRequestInternationalAddress, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.locals.logMessage, '400 - 400 - {} - Requested on api/award/update-overseas-address');
        assert.equal(genericResponse.data.globalError, updateErrorMessages[400]);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/address/international-address');
      });
    });

    it('should display the /international-addresspage, with an error, when the API returns a 404 state', () => {
      nock('http://test-url/', reqHeaders).put(updateOverseasAddressApiUri).reply(httpStatus.NOT_FOUND, {});
      addressController.postInternationalAddress(postRequestInternationalAddress, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.locals.logMessage, '404 - 404 - {} - Requested on api/award/update-overseas-address');
        assert.equal(genericResponse.data.globalError, updateErrorMessages[404]);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/address/international-address');
      });
    });

    it('should display the /international-addresspage, with an error, when the API returns a 500 state', () => {
      nock('http://test-url/', reqHeaders).put(updateOverseasAddressApiUri).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
      addressController.postInternationalAddress(postRequestInternationalAddress, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on api/award/update-overseas-address');
        assert.equal(genericResponse.data.globalError, updateErrorMessages[500]);
        assert.equal(genericResponse.viewName, 'pages/changes-enquiries/address/international-address');
      });
    });

    it('should display the /contact page when the API returns a 200 state', () => {
      nock('http://test-url/', reqHeaders).put(updateOverseasAddressApiUri).reply(httpStatus.OK, {});
      addressController.postInternationalAddress(postRequestInternationalAddress, genericResponse);
      return testPromise.then(() => {
        assert.equal(flash.type, 'success');
        assert.equal(flash.message, 'Address changed');
        assert.equal(genericResponse.address, '/changes-and-enquiries/contact');
      });
    });
  });
});
