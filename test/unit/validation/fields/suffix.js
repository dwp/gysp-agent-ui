const assert = require('assert');

const validator = require('../../../../lib/formValidator');

const form = {};
const invalidSuffix = 'Ee';
const validSuffix = 'A';

describe('Form validation suffix', () => {
  it('Should return error if field is undefined', () => {
    const errors = validator.validateSuffixAndAmounts(form);
    assert.equal(errors.suffix.text, 'enter-amounts:errors.suffix.required');
  });

  it('Should return error if field is empty', () => {
    form.suffix = '';
    const errors = validator.validateSuffixAndAmounts(form);
    assert.equal(errors.suffix.text, 'enter-amounts:errors.suffix.required');
  });

  it('Should return error if suffix field is in an invalid format', () => {
    form.suffix = invalidSuffix;
    const errors = validator.validateSuffixAndAmounts(form);
    assert.equal(errors.suffix.text, 'enter-amounts:errors.suffix.format');
  });

  it('Should not return errors if suffix field is in a valid format', () => {
    form.suffix = validSuffix;
    const errors = validator.validateSuffixAndAmounts(form);
    assert.equal(errors.suffix, undefined);
  });
});
