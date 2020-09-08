const assert = require('assert');

const validator = require('../../../../lib/customerFieldsValidator');
const customerData = require('../../../lib/customerData');

const testDataField = customerData.fieldData();

describe('Form validation firstName', () => {
  it('Should return error if field is empty', () => {
    const error = validator.isValidFirstName(testDataField.empty);
    assert.equal(error, 'add:errors.firstname.required');
  });
  it('Should return error if field is more then 70 character', () => {
    const error = validator.isValidFirstName(testDataField.seventyFourCharacters);
    assert.equal(error, 'add:errors.firstname.toLong');
  });
  it('Should return error if field starts with lower case', () => {
    const error = validator.isValidFirstName(testDataField.invalidStart);
    assert.equal(error, 'add:errors.firstname.invalidStart');
  });
  it('Should return error if field contains any non bad character (@)', () => {
    const error = validator.isValidFirstName(testDataField.invalidCharacter);
    assert.equal(error, 'add:errors.firstname.format');
  });
});
