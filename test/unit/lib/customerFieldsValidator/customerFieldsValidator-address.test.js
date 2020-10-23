const assert = require('assert');

const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../../config/i18next');

const validator = require('../../../../lib/customerFieldsValidator');
const formValidator = require('../../../../lib/formValidator');
const customerData = require('../../../lib/customerData');

const testDataField = customerData.fieldData();

const emptyUKAddress = customerData.emptyAddressUK();
const emptyAddressOverseas = customerData.emptyAddressOverseas();

describe('Form validation address line', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

  it('Should return error if field is empty', () => {
    const error = validator.isValidAddressLine(testDataField.empty, 'addressLine1');
    assert.equal(error, 'Address Line 1 is required');
  });

  it('Should return error if field is more then 34 character', () => {
    const error = validator.isValidAddressLine(testDataField.seventyFourCharacters, 'addressLine1');
    assert.equal(error, 'Address Line 1 must be thirty-five characters or less');
  });
});

describe('Post code validation', () => {
  it('Should return error if field is empty', () => {
    const error = validator.isValidPostCode(testDataField.empty);
    assert.equal(error, 'Post code is required');
  });

  it('Should return error if field is more then 8 character', () => {
    const error = validator.isValidPostCode(testDataField.seventyFourCharacters);
    assert.equal(error, 'Post code must eight characters or less');
  });
});

describe('formValidator addressValidation', () => {
  it('should trigger valid UK validation when UK is supplied', () => {
    const error = formValidator.addressValidation(emptyUKAddress);
    assert.equal(Object.keys(error).length, 3);
  });

  it('should trigger UK validation when UK is supplied and all fields are wrong', () => {
    const error = formValidator.addressValidation(customerData.longAddressEU());
    assert.equal(Object.keys(error).length, 8);
  });

  it('should trigger Overseas validation when Overseas is supplied', () => {
    const error = formValidator.addressValidation(emptyAddressOverseas);
    assert.equal(Object.keys(error).length, 2);
  });

  it('should trigger Overseas validation when Overseas is supplied and all fields are wrong', () => {
    const error = formValidator.addressValidation(customerData.longAddressOverseas());
    assert.equal(Object.keys(error).length, 8);
  });
});
