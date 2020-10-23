const assert = require('assert');

const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../../config/i18next');

const validator = require('../../../../lib/customerFieldsValidator');

describe('Form validation gender', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

  it('Should return error if field is undefined', () => {
    const error = validator.isValidGender(undefined);
    assert.equal(error, 'Gender is required');
  });

  it('Should return error if field is empty', () => {
    const error = validator.isValidGender('');
    assert.equal(error, 'Gender is required');
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
