const assert = require('assert');

const validator = require('../../../../lib/formValidator');

const form = {};
const invalidProtectedPaymentAmount = '123';
const validProtectedPaymentAmount = '12.45';

describe('Form validation Protected Payment amount', () => {
  it('Should return error if Protected Payment field is in an invalid format', () => {
    form.protectedPayment = invalidProtectedPaymentAmount;
    const errors = validator.validateSuffixAndAmounts(form);
    assert.equal(errors.protectedPayment.text, 'enter-amounts:errors.protected_payment.format');
  });

  it('Should not return errors if Protected Payment field is in a valid format', () => {
    form.protectedPayment = validProtectedPaymentAmount;
    const errors = validator.validateSuffixAndAmounts(form);
    assert.equal(errors.protectedPayment, undefined);
  });
});
