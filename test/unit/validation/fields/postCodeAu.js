const { assert } = require('chai');

const validator = require('../../../../lib/customerFieldsValidator');

const valid = ['1234', '0123', '0000', '1111', '1', '22', '333', '4444'];
const invalid = ['Az', 'A111', '123456', 'AAAAAAAA'];

describe('state au post code', () => {
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
        assert.equal(error, 'add:errors.postcodeAU.toLong');
      } else {
        assert.equal(error, 'add:errors.postcodeAU.number');
      }
    });
  });
});
