const { assert } = require('chai');

const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../config/i18next');

const verificationStatusIcon = require('../../../utils/verificationStatusIcon');

const verified = '<span class="govuk-!-font-weight-bold govuk-!-padding-left-5 govuk-!-padding-right-2 gysp-secondary-text-colour gysp-status gysp-status--active">      Verified  </span>';
const notVerified = '<span class="govuk-!-font-weight-bold govuk-!-padding-left-5 govuk-!-padding-right-2 gysp-secondary-text-colour gysp-status gysp-status--inactive">      Not verified  </span>';

describe('accountDetailsObject object', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

  it('should be a function', () => {
    assert.isFunction(verificationStatusIcon);
  });

  it('should be return verified html', () => {
    assert.equal(verificationStatusIcon(true).replace(/\r?\n|\r/g, '').trim(), verified);
  });

  it('should be return not verified html', () => {
    assert.equal(verificationStatusIcon(false).replace(/\r?\n|\r/g, '').trim(), notVerified);
  });
});
