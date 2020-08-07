const { assert } = require('chai');

const verificationStatusIcon = require('../../../utils/verificationStatusIcon');

const verified = '<span class="govuk-!-font-weight-bold govuk-!-padding-left-5 govuk-!-padding-right-2 gysp-secondary-text-colour gysp-status gysp-status--active">      app:verification-status.verified  </span>';
const notVerified = '<span class="govuk-!-font-weight-bold govuk-!-padding-left-5 govuk-!-padding-right-2 gysp-secondary-text-colour gysp-status gysp-status--active">      app:verification-status.verified  </span>';

describe('accountDetailsObject object', () => {
  it('should be a function', () => {
    assert.isFunction(verificationStatusIcon);
  });
  it('should be return verified html', () => {
    assert.equal(verificationStatusIcon(true).replace(/\r?\n|\r/g, '').trim(), verified);
  });
  it('should be return not verified html', () => {
    assert.equal(verificationStatusIcon(true).replace(/\r?\n|\r/g, '').trim(), notVerified);
  });
});
