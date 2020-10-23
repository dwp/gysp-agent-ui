const assert = require('assert');

const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../../config/i18next');

const validator = require('../../../../lib/formValidator');
const customerData = require('../../../lib/customerData');

const fullCustomerData = customerData.validPost();

const invalidNino = ['AA', 'ZZ123456C', 'AA123456', 'AA123456Z', 'AAAAAAAAA'];

const titles = customerData.validTitles();

describe('Form validation nino', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

  invalidNino.forEach((nino) => {
    it(`Should throw format error when invalid is supplied (${nino})`, () => {
      fullCustomerData.nino = nino;
      const errors = validator.customerDetails(fullCustomerData, titles);
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors.nino.text, 'National Insurance number must be valid format');
    });
  });
});
