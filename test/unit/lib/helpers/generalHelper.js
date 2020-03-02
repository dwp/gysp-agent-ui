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
});
