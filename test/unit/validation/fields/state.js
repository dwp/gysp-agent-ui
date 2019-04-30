const { assert } = require('chai');

const validator = require('../../../../lib/customerFieldsValidator');

const validStates = ['ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA'];
const InvalidStates = ['CAT', 'UNI', 'ILIKEHAN'];

describe('state validation', () => {
  validStates.forEach((state) => {
    it(`Should accept state if is valid (${state})`, () => {
      const error = validator.isValidState(state);
      assert.isUndefined(error);
    });
  });

  InvalidStates.forEach((state) => {
    it(`Should not accept state if is valid (${state})`, () => {
      const error = validator.isValidState(state);
      assert(error, 'add:errors.state.valid');
    });
  });
});
