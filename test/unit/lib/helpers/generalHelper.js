const { assert } = require('chai');

const helper = require('../../../../lib/helpers/general');

describe('General Helper ', () => {
  describe('removeNullFromArray', () => {
    it('should return array with nulls removed then nulls are present', () => {
      assert.deepEqual(helper.removeNullFromArray(['test', 'test', null, 'test', null]), ['test', 'test', 'test']);
    });
    it('should return array with modification when there are no nulls present', () => {
      assert.deepEqual(helper.removeNullFromArray(['test', 'test', 'test']), ['test', 'test', 'test']);
    });
    it('should return empty array when all items are nulls', () => {
      assert.deepEqual(helper.removeNullFromArray([null, null]), []);
    });
  });
  describe('formatNinoWithSpaces', () => {
    it('should return string with spaces every 2 characters when a string with more than 2 characters is supplied', () => {
      assert.equal(helper.formatNinoWithSpaces('ZZ887755'), 'ZZ 88 77 55');
    });
    it('should return string with no spaces when a string with 2 characters is supplied', () => {
      assert.equal(helper.formatNinoWithSpaces('ZZ'), 'ZZ');
    });
    it('should return string with no spaces when a string with less than 2 characters is supplied', () => {
      assert.equal(helper.formatNinoWithSpaces('Z'), 'Z');
    });
  });
  describe('formatSortCode', () => {
    it('should return string with spaces every 2 characters when a string with more than 2 characters is supplied', () => {
      assert.equal(helper.formatSortCode('887755'), '88 77 55');
    });
    it('should return string with no spaces when a string with 2 characters is supplied', () => {
      assert.equal(helper.formatSortCode('00'), '00');
    });
    it('should return string with no spaces when a string with less than 2 characters is supplied', () => {
      assert.equal(helper.formatSortCode('0'), '0');
    });
    it('should return string with dashes removed and spaces every 2 characters when a string with dashes is supplied', () => {
      assert.equal(helper.formatSortCode('88-77-55'), '88 77 55');
    });
    it('should return string with only spaces every 2 characters when a string with spaces is supplied', () => {
      assert.equal(helper.formatSortCode('88 77 55'), '88 77 55');
    });
    it('should return string with only spaces every 2 characters when a string with spaces and dashes are supplied', () => {
      assert.equal(helper.formatSortCode('88-77 55'), '88 77 55');
    });
  });
  describe('removeSpacesAndHyphens', () => {
    it('should return string with no spaces or hyphens', () => {
      assert.equal(helper.removeSpacesAndHyphens('00  -00-  00-00   '), '00000000');
    });
  });
});
