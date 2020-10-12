const { assert } = require('chai');
const nock = require('nock');
const httpStatus = require('http-status-codes');

const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../../config/i18next');

const helper = require('../../../../lib/helpers/deathHelper');
const responseHelper = require('../../../lib/responseHelper');

let genericResponse = {};

const blankSession = { session: {} };

const deathPayeeDetailsApiUri = '/api/award/death-payee-details';

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
};

describe('death helper', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

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
      nock('http://test-url/').get(`${deathPayeeDetailsApiUri}/BLOG123456`).reply(httpStatus.OK, payeeDetailsValidResponse);
      assert.deepEqual(await helper.payeeDetails(blankSession, genericResponse, 'BLOG123456'), payeeDetailsValidResponse);
    });

    it('should return cached object when already exists in session', async () => {
      assert.deepEqual(await helper.payeeDetails(blankSession, genericResponse, 'BLOG123456'), payeeDetailsValidResponse);
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

  describe('isCalDeathNotVerified', () => {
    it('should return false when status is null', () => {
      assert.isFalse(helper.isCalDeathNotVerified(null));
    });

    it('should return false when status is undefined', () => {
      assert.isFalse(helper.isCalDeathNotVerified(undefined));
    });

    it('should return false when status is string', () => {
      assert.isFalse(helper.isCalDeathNotVerified('string'));
    });

    it('should return true when status is DEATH_NOT_VERIFIED', () => {
      assert.isTrue(helper.isCalDeathNotVerified('DEATH_NOT_VERIFIED'));
    });
  });

  describe('isNullOrCannotCalculate', () => {
    it('should return false when status is null', () => {
      assert.isTrue(helper.isNullOrCannotCalculate(null));
    });

    it('should return false when status is undefined', () => {
      assert.isFalse(helper.isNullOrCannotCalculate(undefined));
    });

    it('should return false when status is string', () => {
      assert.isFalse(helper.isNullOrCannotCalculate('string'));
    });

    it('should return true when status is CANNOT_CALCULATE', () => {
      assert.isTrue(helper.isNullOrCannotCalculate('CANNOT_CALCULATE'));
    });
  });

  describe('isRetryCalc', () => {
    it('should return false as section does not match when no-match supplied', () => {
      assert.isFalse(helper.isRetryCalc('no-match'));
    });

    it('should return true as section is does match when retryCalc is supplied', () => {
      assert.isTrue(helper.isRetryCalc('retryCalc'));
    });
  });

  describe('isOriginCanVerifyDateOfDeath', () => {
    it('should return false when status is null', () => {
      assert.isFalse(helper.isOriginCanVerifyDateOfDeath(null));
    });

    it('should return false when status is undefined', () => {
      assert.isFalse(helper.isOriginCanVerifyDateOfDeath(undefined));
    });

    it('should return false when status is string', () => {
      assert.isFalse(helper.isOriginCanVerifyDateOfDeath('string'));
    });

    it('should return true when status is canVerifyDateOfDeath', () => {
      assert.isTrue(helper.isOriginCanVerifyDateOfDeath('canVerifyDateOfDeath'));
    });
  });

  describe('isAllSection', () => {
    it('should return false as section does not match when no-match supplied', () => {
      assert.isFalse(helper.isAllSection('no-match'));
    });

    it('should return true as section is does match when retryCalc is supplied', () => {
      assert.isTrue(helper.isAllSection('retryCalc'));
    });

    it('should return true as section is does match when verifiedDateOfDeathYes is supplied', () => {
      assert.isTrue(helper.isAllSection('verifiedDateOfDeathYes'));
    });

    it('should return true as section is does match when reVerifiedDateOfDeath is supplied', () => {
      assert.isTrue(helper.isAllSection('reVerifiedDateOfDeath'));
    });
  });

  describe('isDateOfDeathSection', () => {
    it('should return false as section does not match when no-match supplied', () => {
      assert.isFalse(helper.isDateOfDeathSection('no-match'));
    });

    it('should return false as section is does match when retryCalc is supplied', () => {
      assert.isFalse(helper.isDateOfDeathSection('retryCalc'));
    });

    it('should return true as section is does match when verifiedDateOfDeathYes is supplied', () => {
      assert.isTrue(helper.isDateOfDeathSection('verifiedDateOfDeathYes'));
    });

    it('should return true as section is does match when reVerifiedDateOfDeath is supplied', () => {
      assert.isTrue(helper.isDateOfDeathSection('reVerifiedDateOfDeath'));
    });
  });

  describe('statusLocalesKey', () => {
    it('should return default when status is null', () => {
      assert.equal(helper.statusLocalesKey(null), 'default');
    });

    it('should return default when status is undefined', () => {
      assert.equal(helper.statusLocalesKey(undefined), 'default');
    });

    it('should return default when status is string', () => {
      assert.equal(helper.statusLocalesKey('string'), 'default');
    });

    it('should return arrears when status is ARREARS', () => {
      assert.equal(helper.statusLocalesKey('ARREARS'), 'arrears');
    });

    it('should return overpayment when status is OVERPAYMENT', () => {
      assert.equal(helper.statusLocalesKey('OVERPAYMENT'), 'overpayment');
    });
  });

  describe('successMessage', () => {
    it('should return not-verified when all is undefined', () => {
      assert.equal(helper.successMessage(), 'Date of death - not verified');
    });

    it('should return not-verified when all is null', () => {
      assert.equal(helper.successMessage(null, null), 'Date of death - not verified');
    });

    it('should return arrears when verification is V and status ARREARS', () => {
      assert.equal(helper.successMessage('V', 'ARREARS'), 'Arrears calculated - awaiting payee details');
    });

    it('should return arrears when verification is NV and status ARREARS', () => {
      assert.equal(helper.successMessage('NV', 'ARREARS'), 'Arrears calculated - awaiting payee details');
    });

    it('should return overpayment when verification is V and status OVERPAYMENT', () => {
      assert.equal(helper.successMessage('V', 'OVERPAYMENT'), 'Verified date of death - account closed');
    });

    it('should return overpayment when verification is NV and status OVERPAYMENT', () => {
      assert.equal(helper.successMessage('NV', 'OVERPAYMENT'), 'Verified date of death - account closed');
    });

    it('should return account closed when verification is V, status OVERPAYMENT and section retryCalc', () => {
      assert.equal(helper.successMessage('V', 'OVERPAYMENT', 'retryCalc'), 'Final payment calculated - account closed');
    });

    it('should return account closed when verification is V, status OVERPAYMENT and section dapOnly', () => {
      assert.equal(helper.successMessage('V', 'OVERPAYMENT', 'dapOnly'), 'Final payment calculated - account closed');
    });

    it('should return account closed when verification is V and status NOTHING_OWED', () => {
      assert.equal(helper.successMessage('V', 'NOTHING_OWED'), 'Verified date of death - account closed');
    });

    it('should return overpayment when verification is NV and status NOTHING_OWED', () => {
      assert.equal(helper.successMessage('NV', 'NOTHING_OWED'), 'Verified date of death - account closed');
    });

    it('should return account closed when verification is V, status NOTHING_OWED and section retryCalc', () => {
      assert.equal(helper.successMessage('V', 'NOTHING_OWED', 'retryCalc'), 'Final payment calculated - account closed');
    });

    it('should return account closed when verification is V, status NOTHING_OWED and section dapOnly', () => {
      assert.equal(helper.successMessage('V', 'NOTHING_OWED', 'dapOnly'), 'Final payment calculated - account closed');
    });

    it('should return arrears when verification is NV, status DEATH_NOT_VERIFIED and section canVerifyDateOfDeath', () => {
      assert.equal(helper.successMessage('NV', 'DEATH_NOT_VERIFIED', 'canVerifyDateOfDeath'), 'Recorded details of person dealing with the estate');
    });

    it('should return verified when verification is V and status is undefined', () => {
      assert.equal(helper.successMessage('V'), 'Date of death - verified');
    });

    it('should return verified when verification is NV and status is undefined', () => {
      assert.equal(helper.successMessage('NV'), 'Date of death - not verified');
    });
  });

  describe('deathPaymentView', () => {
    it('should return cannot-calculate file path when status is null', () => {
      assert.equal(helper.deathPaymentView(null), 'pages/changes-enquiries/death/payment/cannot-calculate');
    });

    it('should return cannot-calculate file path when status is undefined', () => {
      assert.equal(helper.deathPaymentView(undefined), 'pages/changes-enquiries/death/payment/cannot-calculate');
    });

    it('should return cannot-calculate file path when status is string', () => {
      assert.equal(helper.deathPaymentView('string'), 'pages/changes-enquiries/death/payment/cannot-calculate');
    });

    it('should return arrears file path when status is ARREARS', () => {
      assert.equal(helper.deathPaymentView('ARREARS'), 'pages/changes-enquiries/death/payment/arrears');
    });

    it('should return overpayment file path when status is OVERPAYMENT', () => {
      assert.equal(helper.deathPaymentView('OVERPAYMENT'), 'pages/changes-enquiries/death/payment/overpayment');
    });

    it('should return overpayment file path when status is NOTHING_OWED', () => {
      assert.equal(helper.deathPaymentView('NOTHING_OWED'), 'pages/changes-enquiries/death/payment/nothing-owed');
    });
  });

  describe('isOriginDapOnly', () => {
    it('should return false when no origin passed', () => {
      assert.isFalse(helper.isOriginDapOnly());
    });

    it('should return false when null is passed', () => {
      assert.isFalse(helper.isOriginDapOnly(null));
    });

    it('should return false when undefined is passed', () => {
      assert.isFalse(helper.isOriginDapOnly(undefined));
    });

    it('should return false when no matching string is passed', () => {
      assert.isFalse(helper.isOriginDapOnly('string'));
    });

    it('should return true when dapOnly string is passed', () => {
      assert.isTrue(helper.isOriginDapOnly('dapOnly'));
    });
  });

  describe('isDeathVerified', () => {
    it('should return false when no request passed', () => {
      assert.isFalse(helper.isDeathVerified());
    });

    it('should return false when null request passed', () => {
      assert.isFalse(helper.isDeathVerified(null));
    });

    it('should return false when blank object passed', () => {
      assert.isFalse(helper.isDeathVerified({ }));
    });

    it('should return false when deathDetail not in object passed', () => {
      assert.isFalse(helper.isDeathVerified({ foo: 'bar' }));
    });

    it('should return false when deathDetail in object but does not include dateOfDeathVerification', () => {
      assert.isFalse(helper.isDeathVerified({ deathDetail: { } }));
    });

    it('should return false when dateOfDeathVerification is not NV', () => {
      assert.isFalse(helper.isDeathVerified({ deathDetail: { dateOfDeathVerification: 'NV' } }));
    });

    it('should return true when dateOfDeathVerification is V', () => {
      assert.isTrue(helper.isDeathVerified({ deathDetail: { dateOfDeathVerification: 'V' } }));
    });
  });

  describe('isDeathNotVerified', () => {
    it('should return false when no request passed', () => {
      assert.isFalse(helper.isDeathNotVerified());
    });

    it('should return false when null request passed', () => {
      assert.isFalse(helper.isDeathNotVerified(null));
    });

    it('should return false when blank object passed', () => {
      assert.isFalse(helper.isDeathNotVerified({ }));
    });

    it('should return false when deathDetail not in object passed', () => {
      assert.isFalse(helper.isDeathNotVerified({ foo: 'bar' }));
    });

    it('should return false when deathDetail in object but does not include dateOfDeathVerification', () => {
      assert.isFalse(helper.isDeathNotVerified({ deathDetail: { } }));
    });

    it('should return false when dateOfDeathVerification is not V', () => {
      assert.isFalse(helper.isDeathNotVerified({ deathDetail: { dateOfDeathVerification: 'V' } }));
    });

    it('should return true when dateOfDeathVerification is NV', () => {
      assert.isTrue(helper.isDeathNotVerified({ deathDetail: { dateOfDeathVerification: 'NV' } }));
    });
  });
});
