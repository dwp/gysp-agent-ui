const { assert } = require('chai');
const maritalNinoValidation = require('../../../lib/validation/maritalNinoValidation');

const maritalStatuses = ['married', 'civil'];

describe('Validation: marital nino', () => {
  maritalStatuses.forEach((maritalStatus) => {
    it(`should return error when post is empty and maritalStatus is ${maritalStatus}`, () => {
      const errors = maritalNinoValidation({}, maritalStatus);
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors.partnerNino.text, `entitlement-partner-nino:fields.${maritalStatus}.partnerNino.errors.required`);
    });

    it(`should return error when partnerNino is blank and maritalStatus is ${maritalStatus}`, () => {
      const errors = maritalNinoValidation({ partnerNino: '' }, maritalStatus);
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors.partnerNino.text, `entitlement-partner-nino:fields.${maritalStatus}.partnerNino.errors.required`);
    });

    it(`should return error when partnerNino is invalid and maritalStatus is ${maritalStatus}`, () => {
      const errors = maritalNinoValidation({ partnerNino: 'ZZ123456C' }, maritalStatus);
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors.partnerNino.text, `entitlement-partner-nino:fields.${maritalStatus}.partnerNino.errors.format`);
    });

    it(`should return error when partnerNino length is 7 and maritalStatus is ${maritalStatus}`, () => {
      const errors = maritalNinoValidation({ partnerNino: 'AA12345' }, maritalStatus);
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors.partnerNino.text, `entitlement-partner-nino:fields.${maritalStatus}.partnerNino.errors.length`);
    });

    it(`should return error when partnerNino length is 10 and maritalStatus is ${maritalStatus}`, () => {
      const errors = maritalNinoValidation({ partnerNino: 'AA12345678' }, maritalStatus);
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors.partnerNino.text, `entitlement-partner-nino:fields.${maritalStatus}.partnerNino.errors.length`);
    });

    it(`should return no errors when partnerNino valid and maritalStatus is ${maritalStatus}`, () => {
      const errors = maritalNinoValidation({ partnerNino: 'AA123456C' });
      assert.equal(Object.keys(errors).length, 0);
    });
  });
});
