const { assert } = require('chai');

const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../../config/i18next');

const validator = require('../../../../lib/customerFieldsValidator');
const customerData = require('../../../lib/customerData');

const testDataField = customerData.fieldData();

describe('Address line', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

  describe('Form validation isValidAddressLineAndAlpha', () => {
    it('Should return error if contains invalid characters but is the correct size', () => {
      const error = validator.isValidAddressLineAndAlpha('Test Field with a dollar $', 'streetAddress');
      assert.equal(error, 'Street Address Can only include A-z, 1-9 and spaces');
    });

    it('Should return no error with number is supplied that is less then 35 characters long', () => {
      const error = validator.isValidAddressLineAndAlpha('This is a test', 'addressLine1');
      assert.isUndefined(error);
    });
  });

  describe('Form validation isValidOptionalAddressLine', () => {
    it('Should return error if contains too many characters', () => {
      const error = validator.isValidOptionalAddressLine(testDataField.seventyFourCharacters, 'addressLine1');
      assert.equal(error, 'Address Line 1 must be thirty-five characters or less');
    });
  });

  describe('Form validation isValidConditionalAddressLine', () => {
    it('Should return error when both values are empty', () => {
      const error = validator.isValidConditionalAddressLine(testDataField.empty, testDataField.empty, 'addressLine1');
      assert.equal(error, 'Address Line 1 is required');
    });

    it('Should return no error when first value is populated', () => {
      const error = validator.isValidConditionalAddressLine(testDataField.oneCharacter, testDataField.empty, 'addressLine1');
      assert.isUndefined(error);
    });

    it('Should return no error when second value is populated', () => {
      const error = validator.isValidConditionalAddressLine(testDataField.empty, testDataField.oneCharacter, 'addressLine1');
      assert.isUndefined(error);
    });

    it('Should return no error when both values are populated', () => {
      const error = validator.isValidConditionalAddressLine(testDataField.oneCharacter, testDataField.oneCharacter, 'addressLine1');
      assert.isUndefined(error);
    });
  });
});
