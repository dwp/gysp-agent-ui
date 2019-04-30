const assert = require('assert');

const validator = require('../../../../lib/customerFieldsValidator');

describe('Form validation dob verification status', () => {
  it('Should return error if field is empty', () => {
    const error = validator.isValidDOBVerificationStatus();
    assert.equal(error, 'add:errors.generic.required');
  });
  it('Should return error if field is not V or NV', () => {
    const error = validator.isValidDOBVerificationStatus('test');
    assert.equal(error, 'add:errors.generic.required');
  });
  it('Should return no error if field is V', () => {
    const error = validator.isValidDOBVerificationStatus('V');
    assert.equal(error, undefined);
  });
  it('Should return no error if field is NV', () => {
    const error = validator.isValidDOBVerificationStatus('NV');
    assert.equal(error, undefined);
  });
});
