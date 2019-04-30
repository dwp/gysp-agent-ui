const assert = require('assert');

const validator = require('../../../../lib/customerFieldsValidator');
const formValidator = require('../../../../lib//formValidator');
const customerData = require('../../../lib/customerData');

const testDataField = customerData.fieldData();

const emptyUKAddress = customerData.emptyAddressUK();
const emptyAddressOverseas = customerData.emptyAddressOverseas();

describe('Form validation address line', () => {
  it('Should return error if field is empty', () => {
    const error = validator.isValidAddressLine(testDataField.empty, 'test');
    assert.equal(error, 'add:errors.test.required');
  });
  it('Should return error if field is more then 34 character', () => {
    const error = validator.isValidAddressLine(testDataField.seventyFourCharacters, 'test');
    assert.equal(error, 'add:errors.test.toLong');
  });
});

describe('Post code validation', () => {
  it('Should return error if field is empty', () => {
    const error = validator.isValidPostCode(testDataField.empty);
    assert.equal(error, 'add:errors.postcode.required');
  });
  it('Should return error if field is more then 8 character', () => {
    const error = validator.isValidPostCode(testDataField.seventyFourCharacters);
    assert.equal(error, 'add:errors.postcode.toLong');
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
