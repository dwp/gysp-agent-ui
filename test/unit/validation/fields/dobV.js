const assert = require('assert');

const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../../config/i18next');

const validator = require('../../../../lib/customerFieldsValidator');

describe('Form validation dob verification status', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

  it('Should return error if field is empty', () => {
    const error = validator.isValidDOBVerificationStatus();
    assert.equal(error, 'Please complete.');
  });

  it('Should return error if field is not V or NV', () => {
    const error = validator.isValidDOBVerificationStatus('test');
    assert.equal(error, 'Please complete.');
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
