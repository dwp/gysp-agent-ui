const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const nock = require('nock');
const { StatusCodes } = require('http-status-codes');

const { assert } = chai;
chai.use(chaiAsPromised);

const helper = require('../../../../lib/helpers/locationServiceHelper');

const responseHelper = require('../../../lib/responseHelper');

const postcodeLookupApiUri = 'address?excludeBusiness=true&showSourceData=true&postcode=';

let genericResponse = {};

describe('locationServiceHelper', () => {
  beforeEach(() => {
    genericResponse = responseHelper.genericResponse();
    genericResponse.locals = responseHelper.localResponse(genericResponse);
  });

  describe('getPostCodeAddressLookup', () => {
    it('should reject promise when status code is 404', () => {
      nock('http://test-url/').get(`/${postcodeLookupApiUri}POSTCODE`).reply(StatusCodes.NOT_FOUND, {});
      return assert.isRejected(helper.getPostCodeAddressLookup(genericResponse, 'POSTCODE'), Error);
    });

    it('should return info log message when status code is 404', async () => {
      nock('http://test-url/').get(`/${postcodeLookupApiUri}POSTCODE`).reply(StatusCodes.NOT_FOUND, {});
      try {
        await helper.getPostCodeAddressLookup(genericResponse, 'POSTCODE');
        return new Error();
      } catch (err) {
        return assert.equal(genericResponse.locals.infoLogMessage, '404 - 404 - {} - Requested on address?excludeBusiness=true&showSourceData=true&postcode=POSTCODE');
      }
    });

    it('should reject promise when status code is 500', () => {
      nock('http://test-url/').get(`/${postcodeLookupApiUri}POSTCODE`).reply(StatusCodes.INTERNAL_SERVER_ERROR, {});
      return assert.isRejected(helper.getPostCodeAddressLookup(genericResponse, 'POSTCODE'), Error);
    });

    it('should return error log message when status code is 500', async () => {
      nock('http://test-url/').get(`/${postcodeLookupApiUri}POSTCODE`).reply(StatusCodes.INTERNAL_SERVER_ERROR, {});
      try {
        await helper.getPostCodeAddressLookup(genericResponse, 'POSTCODE');
        return new Error();
      } catch (err) {
        return assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on address?excludeBusiness=true&showSourceData=true&postcode=POSTCODE');
      }
    });

    it('should reject promise when data does not exist', () => {
      nock('http://test-url/').get(`/${postcodeLookupApiUri}POSTCODE`).reply(StatusCodes.OK, {});
      return assert.isRejected(helper.getPostCodeAddressLookup(genericResponse, 'POSTCODE'), Error, 'address data not supplied');
    });

    it('should return info log message when status code is 200 but data does not exist', async () => {
      nock('http://test-url/').get(`/${postcodeLookupApiUri}POSTCODE`).reply(StatusCodes.OK, {});
      try {
        await helper.getPostCodeAddressLookup(genericResponse, 'POSTCODE');
        return new Error();
      } catch (err) {
        return assert.equal(genericResponse.locals.infoLogMessage, '404 - address data not supplied - Requested on address?excludeBusiness=true&showSourceData=true&postcode=POSTCODE');
      }
    });

    it('should resolve promise when 200 and data is present', () => {
      nock('http://test-url/').get(`/${postcodeLookupApiUri}POSTCODE`).reply(StatusCodes.OK, { data: [{ foo: 'bar' }] });
      return assert.becomes(helper.getPostCodeAddressLookup(genericResponse, 'POSTCODE'), { data: [{ foo: 'bar' }] });
    });
  });
});
