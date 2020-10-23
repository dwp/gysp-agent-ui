const assert = require('assert');

const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../../config/i18next');

const validator = require('../../../../lib/customerFieldsValidator');
const customerData = require('../../../lib/customerData');

const invalidTitles = ['', 'MR', 'MISS'];
const titles = customerData.validTitles();

describe('Form validation title', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

  invalidTitles.forEach((title) => {
    it(`Should throw error when invalid title is supplied (${title})`, () => {
      const error = validator.isValidTitle(title, titles);
      assert.equal(error, 'Please complete.');
    });
  });

  it('Should give no errors when valid title is supplied', () => {
    const error = validator.isValidTitle('Mr', titles);
    assert.equal(error, undefined);
  });
});
