const { assert } = require('chai');

const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../../config/i18next');

const validator = require('../../../../lib/customerFieldsValidator');

const valid = ['1234', '0123', '0000', '1111', '1', '22', '333', '4444'];
const invalid = ['Az', 'A111', '123456', 'AAAAAAAA'];

describe('state au post code', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

  valid.forEach((state) => {
    it(`Should accept state if is valid (${state})`, () => {
      const error = validator.isValidPostCodeAU(state);
      assert.isUndefined(error);
    });
  });

  invalid.forEach((state) => {
    it(`Should not accept state if is valid (${state})`, () => {
      const error = validator.isValidPostCodeAU(state);
      assert.isDefined(error);
      if (state.length > 4) {
        assert.equal(error, 'Post code must four characters or less');
      } else {
        assert.equal(error, 'Post code can only be numeric');
      }
    });
  });
});
