const assert = require('assert');

const validator = require('../../../../lib/customerFieldsValidator');
const customerData = require('../../../lib/customerData');

const invalidTitles = ['', 'MR', 'MISS'];
const titles = customerData.validTitles();

describe('Form validation title', () => {
  invalidTitles.forEach((title) => {
    it(`Should throw error when invalid title is supplied (${title})`, () => {
      const error = validator.isValidTitle(title, titles);
      assert.equal(error, 'add:errors.generic.required');
    });
  });

  it('Should give no errors when valid title is supplied', () => {
    const error = validator.isValidTitle('Mr', titles);
    assert.equal(error, undefined);
  });
});
