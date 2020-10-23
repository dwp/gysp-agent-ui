const { assert } = require('chai');

const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../../../config/i18next');

const deathCheckPayeeDetailsObject = require('../../../../../lib/objects/view/deathCheckPayeeDetailsObject');

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

describe('deathCheckPayeeDetailsObject ', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

  describe('formatter', () => {
    it('should return object correctly formatted', () => {
      const formatted = deathCheckPayeeDetailsObject.formatter(validPayeeDetailsObject);
      assert.isObject(formatted);
      assert.equal(formatted.name, 'Albert Trotter');
      assert.equal(formatted.phoneNumber, '01911234567');
      assert.equal(formatted.address, '1 Test Street<br />Test Town<br />NE1 1RT');
    });
  });

  describe('pageData', () => {
    it('should return default page object when status is undefined', () => {
      const formatted = deathCheckPayeeDetailsObject.pageData(validPayeeDetailsObject);
      assert.isObject(formatted);
      assert.equal(formatted.header, 'Check payee details');
      assert.equal(formatted.back, '/changes-and-enquiries/personal');
      assert.equal(formatted.button, '/changes-and-enquiries/personal/death/account-details');
      assert.equal(formatted.buttonText, 'Continue');
    });

    it('should return arrears page object when status is ARREARS', () => {
      const formatted = deathCheckPayeeDetailsObject.pageData(validPayeeDetailsObject, 'ARREARS');
      assert.isObject(formatted);
      assert.equal(formatted.header, 'Send BR330 form');
      assert.equal(formatted.back, '/changes-and-enquiries/personal/death/retry-calculation');
      assert.equal(formatted.button, '/changes-and-enquiries/personal/death/update');
      assert.equal(formatted.buttonText, 'Confirm');
    });
  });
});
