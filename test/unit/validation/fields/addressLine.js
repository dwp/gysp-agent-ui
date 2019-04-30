const { assert } = require('chai');

const validator = require('../../../../lib/customerFieldsValidator');
const customerData = require('../../../lib/customerData');

const testDataField = customerData.fieldData();

describe('Form validation isValidAddressLineAndAlpha', () => {
  it('Should return error if contains invalid characters but is the correct size', () => {
    const error = validator.isValidAddressLineAndAlpha('Test Field with a dollar $', 'address');
    assert.equal(error, 'add:errors.address.invalidAlphaNum');
  });

  it('Should return no error with number is supplied that is less then 35 characters long', () => {
    const error = validator.isValidAddressLineAndAlpha('This is a test', 'address');
    assert.isUndefined(error);
  });
});

describe('Form validation isValidOptionalAddressLine', () => {
  it('Should return error if contains to many characters', () => {
    const error = validator.isValidOptionalAddressLine(testDataField.seventyFourCharacters, 'address');
    assert.equal(error, 'add:errors.address.toLong');
  });
});

describe('Form validation isValidConditionalAddressLine', () => {
  it('Should return error when both values are empty', () => {
    const error = validator.isValidConditionalAddressLine(testDataField.empty, testDataField.empty, 'address');
    assert.equal(error, 'add:errors.address.required');
  });
  it('Should return no error when first value is populated', () => {
    const error = validator.isValidConditionalAddressLine(testDataField.oneCharacter, testDataField.empty, 'address');
    assert.isUndefined(error);
  });
  it('Should return no error when second value is populated', () => {
    const error = validator.isValidConditionalAddressLine(testDataField.empty, testDataField.oneCharacter, 'address');
    assert.isUndefined(error);
  });
  it('Should return no error when both values are populated', () => {
    const error = validator.isValidConditionalAddressLine(testDataField.oneCharacter, testDataField.oneCharacter, 'address');
    assert.isUndefined(error);
  });
});
