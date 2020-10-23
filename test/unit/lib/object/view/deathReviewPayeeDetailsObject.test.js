const { assert } = require('chai');

const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../../../config/i18next');

const deathReviewPayeeDetailsObject = require('../../../../../lib/objects/view/deathReviewPayeeDetailsObject');

const validPayeeDetailsObject = {
  fullName: 'Albert Trotter',
  phoneNumber: '01911234567',
  address: {
    buildingName: null,
    subBuildingName: null,
    buildingNumber: '1',
    thoroughfareName: 'Test Street',
    dependentThoroughfareName: null,
    dependentLocality: null,
    postTown: 'Test Town',
    postCode: 'NE1 1RT',
    uprn: '',
  },
};

describe('deathReviewPayeeDetailsObject ', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

  describe('formatter', () => {
    it('should return object correctly formatted', () => {
      const formatted = deathReviewPayeeDetailsObject.formatter(validPayeeDetailsObject);
      assert.isObject(formatted);
      assert.equal(formatted.name, 'Albert Trotter');
      assert.equal(formatted.phoneNumber, '01911234567');
      assert.equal(formatted.address, '1 Test Street<br />Test Town<br />NE1 1RT');
    });
  });

  describe('pageData', () => {
    it('should return default page object when status is undefined', () => {
      const formatted = deathReviewPayeeDetailsObject.pageData(validPayeeDetailsObject);
      assert.isObject(formatted);
      assert.equal(formatted.header, 'Check payee details');
      assert.equal(formatted.back, '/changes-and-enquiries/personal');
      assert.equal(formatted.button, '/changes-and-enquiries/personal/death/account-details');
      assert.equal(formatted.buttonText, 'Continue');
    });

    it('should return arrears page object when status is ARREARS', () => {
      const formatted = deathReviewPayeeDetailsObject.pageData(validPayeeDetailsObject, 'ARREARS');
      assert.isObject(formatted);
      assert.equal(formatted.header, 'Send BR330 form');
      assert.equal(formatted.back, '/changes-and-enquiries/personal/death/retry-calculation');
      assert.equal(formatted.button, '/changes-and-enquiries/personal/death/update');
      assert.equal(formatted.buttonText, 'Confirm');
    });

    it('should return payee review page object when status is ARREARS and section does not match', () => {
      const formatted = deathReviewPayeeDetailsObject.pageData(validPayeeDetailsObject, 'ARREARS', 'no-match');
      assert.isObject(formatted);
      assert.equal(formatted.header, 'Send BR330 form');
      assert.equal(formatted.back, '/changes-and-enquiries/personal/death/retry-calculation');
      assert.equal(formatted.button, '/changes-and-enquiries/personal/death/update');
      assert.equal(formatted.buttonText, 'Confirm');
    });

    it('should return payee review page object when status is ARREARS and section is retryCal', () => {
      const formatted = deathReviewPayeeDetailsObject.pageData(validPayeeDetailsObject, 'ARREARS', 'retryCal');
      assert.isObject(formatted);
      assert.equal(formatted.header, 'Send BR330 form');
      assert.equal(formatted.back, '/changes-and-enquiries/personal/death/retry-calculation');
      assert.equal(formatted.button, '/changes-and-enquiries/personal/death/update');
      assert.equal(formatted.buttonText, 'Confirm');
      assert.equal(formatted.status, 'ARREARS');
    });

    it('should return payee review page object when status is ARREARS and section is verifiedDateOfDeathYes', () => {
      const formatted = deathReviewPayeeDetailsObject.pageData(validPayeeDetailsObject, 'ARREARS', 'verifiedDateOfDeathYes');
      assert.isObject(formatted);
      assert.equal(formatted.header, 'Send BR330 form');
      assert.equal(formatted.back, '/changes-and-enquiries/personal/death/payment');
      assert.equal(formatted.button, '/changes-and-enquiries/personal/death/record');
      assert.equal(formatted.buttonText, 'Confirm');
      assert.equal(formatted.status, 'ARREARS');
    });

    it('should return payee review page object when status is ARREARS and section is reVerifiedDateOfDeath', () => {
      const formatted = deathReviewPayeeDetailsObject.pageData(validPayeeDetailsObject, 'ARREARS', 'reVerifiedDateOfDeath');
      assert.isObject(formatted);
      assert.equal(formatted.header, 'Send BR330 form');
      assert.equal(formatted.back, '/changes-and-enquiries/personal/death/payment');
      assert.equal(formatted.button, '/changes-and-enquiries/personal/death/record');
      assert.equal(formatted.buttonText, 'Confirm');
      assert.equal(formatted.status, 'ARREARS');
    });

    it('should return payee review page object when status is OVERPAYMENT and section is retryCal', () => {
      const formatted = deathReviewPayeeDetailsObject.pageData(validPayeeDetailsObject, 'OVERPAYMENT', 'retryCal');
      assert.isObject(formatted);
      assert.equal(formatted.header, 'Send letter');
      assert.equal(formatted.back, '/changes-and-enquiries/personal/death/retry-calculation');
      assert.equal(formatted.button, '/changes-and-enquiries/personal/death/update');
      assert.equal(formatted.buttonText, 'Send letter');
      assert.equal(formatted.status, 'OVERPAYMENT');
    });

    it('should return payee review page object when status is OVERPAYMENT and section is verifiedDateOfDeathYes', () => {
      const formatted = deathReviewPayeeDetailsObject.pageData(validPayeeDetailsObject, 'OVERPAYMENT', 'verifiedDateOfDeathYes');
      assert.isObject(formatted);
      assert.equal(formatted.header, 'Send letter');
      assert.equal(formatted.back, '/changes-and-enquiries/personal/death/payment');
      assert.equal(formatted.button, '/changes-and-enquiries/personal/death/record');
      assert.equal(formatted.buttonText, 'Send letter');
      assert.equal(formatted.status, 'OVERPAYMENT');
    });

    it('should return payee review page object when status is OVERPAYMENT and section is reVerifiedDateOfDeath', () => {
      const formatted = deathReviewPayeeDetailsObject.pageData(validPayeeDetailsObject, 'OVERPAYMENT', 'reVerifiedDateOfDeath');
      assert.isObject(formatted);
      assert.equal(formatted.header, 'Send letter');
      assert.equal(formatted.back, '/changes-and-enquiries/personal/death/payment');
      assert.equal(formatted.button, '/changes-and-enquiries/personal/death/record');
      assert.equal(formatted.buttonText, 'Send letter');
      assert.equal(formatted.status, 'OVERPAYMENT');
    });

    it('should return payee review page object when status is NOTHING_OWED and section is retryCalc', () => {
      const formatted = deathReviewPayeeDetailsObject.pageData(validPayeeDetailsObject, 'NOTHING_OWED', 'retryCalc');
      assert.isObject(formatted);
      assert.equal(formatted.header, 'Send letter');
      assert.equal(formatted.back, '/changes-and-enquiries/personal/death/retry-calculation');
      assert.equal(formatted.button, '/changes-and-enquiries/personal/death/update');
      assert.equal(formatted.buttonText, 'Send letter');
      assert.equal(formatted.status, 'NOTHING_OWED');
    });

    it('should return payee review page object when status is NOTHING_OWED and section is verifiedDateOfDeathYes', () => {
      const formatted = deathReviewPayeeDetailsObject.pageData(validPayeeDetailsObject, 'NOTHING_OWED', 'verifiedDateOfDeathYes');
      assert.isObject(formatted);
      assert.equal(formatted.header, 'Send letter');
      assert.equal(formatted.back, '/changes-and-enquiries/personal/death/payment');
      assert.equal(formatted.button, '/changes-and-enquiries/personal/death/record');
      assert.equal(formatted.buttonText, 'Send letter');
      assert.equal(formatted.status, 'NOTHING_OWED');
    });

    it('should return payee review page object when status is NOTHING_OWED and section is reVerifiedDateOfDeath', () => {
      const formatted = deathReviewPayeeDetailsObject.pageData(validPayeeDetailsObject, 'NOTHING_OWED', 'reVerifiedDateOfDeath');
      assert.isObject(formatted);
      assert.equal(formatted.header, 'Send letter');
      assert.equal(formatted.back, '/changes-and-enquiries/personal/death/payment');
      assert.equal(formatted.button, '/changes-and-enquiries/personal/death/record');
      assert.equal(formatted.buttonText, 'Send letter');
      assert.equal(formatted.status, 'NOTHING_OWED');
    });
  });
});
