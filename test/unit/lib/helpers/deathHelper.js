const { assert } = require('chai');
const nock = require('nock');
const httpStatus = require('http-status-codes');

const helper = require('../../../../lib/helpers/deathHelper');
const responseHelper = require('../../../lib/responseHelper');

let genericResponse = {};

const blankSession = { session: {} };

const deathPayeeDetailsApiUri = '/api/award/death-payee-details';

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
};

describe('death helper', () => {
  beforeEach(() => {
    genericResponse = responseHelper.genericResponse();
    genericResponse.locals = responseHelper.localResponse(genericResponse);
  });
  describe('payeeDetails', () => {
    it('should return false when session data present', async () => {
      assert.isFalse(await helper.payeeDetails(blankSession, genericResponse, 'BLOG123456', { session: { foo: 'bar' } }));
    });
    it('should throw a 404 error when cannot be found', async () => {
      nock('http://test-url/').get(`${deathPayeeDetailsApiUri}/BLOG123456`).reply(httpStatus.NOT_FOUND);
      try {
        await helper.payeeDetails(blankSession, genericResponse, 'BLOG123456');
      } catch (err) {
        assert.equal(err, 'StatusCodeError: 404 - undefined');
      }
    });
    it('should throw a 500 error when there is an internal server error', async () => {
      nock('http://test-url/').get(`${deathPayeeDetailsApiUri}/BLOG123456`).reply(httpStatus.INTERNAL_SERVER_ERROR);
      try {
        await helper.payeeDetails(blankSession, genericResponse, 'BLOG123456');
      } catch (err) {
        assert.equal(err, 'StatusCodeError: 500 - undefined');
      }
    });
    it('should return object when state code is 200 ', async () => {
      nock('http://test-url/').get(`${deathPayeeDetailsApiUri}/BLOG123456`).reply(httpStatus.OK, payeDetailsValidResponse);
      assert.deepEqual(await helper.payeeDetails(blankSession, genericResponse, 'BLOG123456'), payeDetailsValidResponse);
    });
    it('should return cached object when already exists in session', async () => {
      assert.deepEqual(await helper.payeeDetails(blankSession, genericResponse, 'BLOG123456'), payeDetailsValidResponse);
    });
  });
  describe('deathPaymentStatus', () => {
    it('should return CANNOT_CALCULATE status when amount it null', () => {
      assert.equal(helper.deathPaymentStatus(null), 'CANNOT_CALCULATE');
    });
    it('should return OVERPAYMENT status when amount is less than zero', () => {
      assert.equal(helper.deathPaymentStatus(-101.0), 'OVERPAYMENT');
    });
    it('should return ARREARS status when amount is more than zero', () => {
      assert.equal(helper.deathPaymentStatus(12.45), 'ARREARS');
    });
    it('should return NOTHING_OWED status when amount is zero', () => {
      assert.equal(helper.deathPaymentStatus(0), 'NOTHING_OWED');
    });
    it('should return null when amount is undefined', () => {
      assert.isNull(helper.deathPaymentStatus(undefined));
    });
  });
  describe('isCannotCalculate', () => {
    it('should return false when status is null', () => {
      assert.isFalse(helper.isCannotCalculate(null));
    });
    it('should return false when status is undefined', () => {
      assert.isFalse(helper.isCannotCalculate(undefined));
    });
    it('should return false when status is string', () => {
      assert.isFalse(helper.isCannotCalculate('string'));
    });
    it('should return true when status is CANNOT_CALCULATE', () => {
      assert.isTrue(helper.isCannotCalculate('CANNOT_CALCULATE'));
    });
  });
  describe('isOverPayment', () => {
    it('should return false when status is null', () => {
      assert.isFalse(helper.isOverPayment(null));
    });
    it('should return false when status is undefined', () => {
      assert.isFalse(helper.isOverPayment(undefined));
    });
    it('should return false when status is string', () => {
      assert.isFalse(helper.isOverPayment('string'));
    });
    it('should return true when status is OVERPAYMENT', () => {
      assert.isTrue(helper.isOverPayment('OVERPAYMENT'));
    });
  });
  describe('isArrears', () => {
    it('should return false when status is null', () => {
      assert.isFalse(helper.isArrears(null));
    });
    it('should return false when status is undefined', () => {
      assert.isFalse(helper.isArrears(undefined));
    });
    it('should return false when status is string', () => {
      assert.isFalse(helper.isArrears('string'));
    });
    it('should return true when status is ARREARS', () => {
      assert.isTrue(helper.isArrears('ARREARS'));
    });
  });
  describe('isNothingOwed', () => {
    it('should return false when status is null', () => {
      assert.isFalse(helper.isNothingOwed(null));
    });
    it('should return false when status is undefined', () => {
      assert.isFalse(helper.isNothingOwed(undefined));
    });
    it('should return false when status is string', () => {
      assert.isFalse(helper.isNothingOwed('string'));
    });
    it('should return true when status is NOTHING_OWED', () => {
      assert.isTrue(helper.isNothingOwed('NOTHING_OWED'));
    });
  });
});
