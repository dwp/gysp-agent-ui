const assert = require('assert');

const validator = require('../../../../lib/formValidator');

const form = {};
const invalidNSPAmount = '123';
const validNSPAmount = '123.45';

describe('Form validation New State Pension amount', () => {
  it('Should return error if field is undefined', () => {
    const errors = validator.validateSuffixAndAmounts(form);
    assert.equal(errors.nsp.text, 'enter-amounts:errors.nsp.required');
  });

  it('Should return error if field is empty', () => {
    form.nsp = '';
    const errors = validator.validateSuffixAndAmounts(form);
    assert.equal(errors.nsp.text, 'enter-amounts:errors.nsp.required');
  });

  it('Should return error if NSP field is in an invalid format', () => {
    form.nsp = invalidNSPAmount;
    const errors = validator.validateSuffixAndAmounts(form);
    assert.equal(errors.nsp.text, 'enter-amounts:errors.nsp.format');
  });

  it('Should not return errors if NSP field is in a valid format', () => {
    form.nsp = validNSPAmount;
    const errors = validator.validateSuffixAndAmounts(form);
    assert.equal(errors.nsp, undefined);
  });
});
