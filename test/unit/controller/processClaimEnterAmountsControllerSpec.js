const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const httpStatus = require('http-status-codes');
const nock = require('nock');
const enterAmountsController = require('../../../app/routes/process-claim/enter-amounts/functions.js');
const responseHelper = require('../../lib/responseHelper');
const dataStore = require('../../../lib/dataStore');

let testPromise;
let genericResponse;

chai.use(chaiAsPromised);

nock.disableNetConnect();

const { assert } = chai;

const validRequest = {
  body: {
    inviteKey: 'INVITEKEY01',
    suffix: 'a',
    protectedPayment: 11.11,
    nsp: 111.11,
  },
  session: {
    processClaim: {
      claimDetail: {
        nino: 'AA370773A',
        dob: '1953-01-15T00:00:00.000Z',
        firstName: 'Joe',
        surname: 'Bloggs',
      },
    },
  },
};

const enterAmountsURI = '/api/award/updatepaymentdetails/';

describe('Enter amounts controller ', () => {
  genericResponse = responseHelper.genericResponse();

  beforeEach(() => {
    testPromise = new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 50);
    });
  });

  describe(' getEnterAmounts function ', () => {
    it('should return enter-amounts view when requested by the user', () => {
      enterAmountsController.getEnterAmounts(validRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/process-claim/enter-amounts/index');
    });
  });

  describe(' postEnterAmounts function ', () => {
    it('should return error view when API returns 404 state', () => {
      nock('http://test-url/').put(enterAmountsURI, validRequest).reply(httpStatus.NOT_FOUND, {});
      enterAmountsController.postEnterAmounts(validRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/error');
      });
    });

    it('should return error view when API returns 400 state', () => {
      nock('http://test-url/').put(enterAmountsURI, validRequest).reply(httpStatus.BAD_REQUEST, {});
      enterAmountsController.postEnterAmounts(validRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/error');
      });
    });

    it('should return error view when API returns 500 state', () => {
      nock('http://test-url/').put(enterAmountsURI, validRequest).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
      enterAmountsController.postEnterAmounts(validRequest, genericResponse);
      return testPromise.then(() => {
        assert.equal(genericResponse.viewName, 'pages/error');
      });
    });

    it('should set session enteramounts', () => {
      nock('http://test-url/').put(enterAmountsURI, validRequest).reply(200, {});
      enterAmountsController.postEnterAmounts(validRequest, genericResponse);
      return testPromise.then(() => {
        const sessionData = dataStore.get(validRequest, 'enteramounts');
        assert.equal(sessionData, validRequest.body);
        assert.equal(genericResponse.viewName, 'pages/error');
      });
    });
  });
});
