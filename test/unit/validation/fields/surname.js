const assert = require('assert');

const validator = require('../../../../lib/customerFieldsValidator');
const customerData = require('../../../lib/customerData');

const testDataField = customerData.fieldData();

describe('Form validation surname', () => {
  it('Should return error if field is empty', () => {
    const error = validator.isValidSurname(testDataField.empty);
    assert.equal(error, 'add:errors.surname.required');
  });
  it('Should return error if field is one character', () => {
    const error = validator.isValidSurname(testDataField.oneCharacter);
    assert.equal(error, 'add:errors.surname.toShort');
  });
  it('Should return error if field is more then 70 character', () => {
    const error = validator.isValidSurname(testDataField.seventyFourCharacters);
    assert.equal(error, 'add:errors.surname.toLong');
  });
  it('Should return error if field has none A-z start character', () => {
    const error = validator.isValidSurname(testDataField.invalidStart);
    assert.equal(error, 'add:errors.surname.invalidStart');
  });
  it('Should return error if field contains any non bad character (@)', () => {
    const error = validator.isValidSurname(testDataField.invalidCharacter);
    assert.equal(error, 'add:errors.surname.format');
  });
});
