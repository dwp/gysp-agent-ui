const { assert } = require('chai');

const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../../config/i18next');

const validator = require('../../../../lib/customerFieldsValidator');

const validStates = ['ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA'];
const InvalidStates = ['CAT', 'UNI', 'ILIKEHAN'];

describe('state validation', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

  validStates.forEach((state) => {
    it(`Should accept state if is valid (${state})`, () => {
      const error = validator.isValidState(state);
      assert.isUndefined(error);
    });
  });

  InvalidStates.forEach((state) => {
    it(`Should not accept state if is valid (${state})`, () => {
      const error = validator.isValidState(state);
      assert.equal(error, 'State can only be ACT, NSW, NT, QLD, SA, TAS, VIC or WA');
    });
  });
});
