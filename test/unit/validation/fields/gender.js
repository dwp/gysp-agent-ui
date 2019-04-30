const assert = require('assert');

const validator = require('../../../../lib/customerFieldsValidator');

describe('Form validation gender', () => {
  it('Should return error if field is undefined', () => {
    const error = validator.isValidGender(undefined);
    assert.equal(error, 'add:errors.gender.required');
  });
  it('Should return error if field is empty', () => {
    const error = validator.isValidGender('');
    assert.equal(error, 'add:errors.gender.required');
  });
  it('Should return no error if field is Male', () => {
    const error = validator.isValidGender('Male');
    assert.equal(error, undefined);
  });
  it('Should return no error if field is Female', () => {
    const error = validator.isValidGender('Female');
    assert.equal(error, undefined);
  });
});
