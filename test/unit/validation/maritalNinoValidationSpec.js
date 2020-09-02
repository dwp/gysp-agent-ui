const { assert } = require('chai');

const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../config/i18next');

const maritalNinoValidation = require('../../../lib/validation/maritalNinoValidation');

const maritalStatuses = ['married', 'civil'];

describe('Validation: marital nino', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

  maritalStatuses.forEach((maritalStatus) => {
    it(`should return error when post is empty and maritalStatus is ${maritalStatus}`, () => {
      const errors = maritalNinoValidation({}, maritalStatus);
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors.partnerNino.text, 'Enter a National Insurance number');
    });

    it(`should return error when partnerNino is blank and maritalStatus is ${maritalStatus}`, () => {
      const errors = maritalNinoValidation({ partnerNino: '' }, maritalStatus);
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors.partnerNino.text, 'Enter a National Insurance number');
    });

    it(`should return error when partnerNino is invalid and maritalStatus is ${maritalStatus}`, () => {
      const errors = maritalNinoValidation({ partnerNino: 'ZZ123456C' }, maritalStatus);
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors.partnerNino.text, 'Enter a National Insurance number in the correct format, like QQ123456C');
    });

    it(`should return error when partnerNino length is 7 and maritalStatus is ${maritalStatus}`, () => {
      const errors = maritalNinoValidation({ partnerNino: 'AA12345' }, maritalStatus);
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors.partnerNino.text, 'National Insurance number must be 9 characters or less');
    });

    it(`should return error when partnerNino length is 10 and maritalStatus is ${maritalStatus}`, () => {
      const errors = maritalNinoValidation({ partnerNino: 'AA12345678' }, maritalStatus);
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors.partnerNino.text, 'National Insurance number must be 9 characters or less');
    });

    it(`should return no errors when partnerNino valid and maritalStatus is ${maritalStatus}`, () => {
      const errors = maritalNinoValidation({ partnerNino: 'AA123456C' });
      assert.equal(Object.keys(errors).length, 0);
    });
  });
});
