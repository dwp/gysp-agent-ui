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
  describe('checkIfValidMaritalStatusByStatus', () => {
    it('should return false when undefined', () => {
      assert.isFalse(helper.checkIfValidMaritalStatusByStatus());
    });
    it('should return false when invalid status supplied', () => {
      assert.isFalse(helper.checkIfValidMaritalStatusByStatus('bob'));
    });
    it('should return true when divorced status supplied and current status Married', () => {
      assert.isTrue(helper.checkIfValidMaritalStatusByStatus('divorced', 'Married'));
    });
    it('should return true when widowed status supplied and current status Married', () => {
      assert.isTrue(helper.checkIfValidMaritalStatusByStatus('widowed', 'Married'));
    });
    it('should return true when dissolved status supplied and current status Civil Partnership', () => {
      assert.isTrue(helper.checkIfValidMaritalStatusByStatus('dissolved', 'Civil Partnership'));
    });
    it('should return true when widowed status supplied and current status Civil Partnership', () => {
      assert.isTrue(helper.checkIfValidMaritalStatusByStatus('widowed', 'Civil Partnership'));
    });
    it('should return true when married status supplied and current status Single', () => {
      assert.isTrue(helper.checkIfValidMaritalStatusByStatus('married', 'Single'));
    });
    it('should return true when civil status supplied and current status Single', () => {
      assert.isTrue(helper.checkIfValidMaritalStatusByStatus('civil', 'Single'));
    });
    it('should return true when married status supplied and current status Divorced', () => {
      assert.isTrue(helper.checkIfValidMaritalStatusByStatus('married', 'Divorced'));
    });
    it('should return true when civil status supplied and current status Divorced', () => {
      assert.isTrue(helper.checkIfValidMaritalStatusByStatus('civil', 'Divorced'));
    });
    it('should return true when married status supplied and current status Dissolved', () => {
      assert.isTrue(helper.checkIfValidMaritalStatusByStatus('married', 'Dissolved'));
    });
    it('should return true when civil status supplied and current status Dissolved', () => {
      assert.isTrue(helper.checkIfValidMaritalStatusByStatus('civil', 'Dissolved'));
    });
    it('should return true when married status supplied and current status Widowed', () => {
      assert.isTrue(helper.checkIfValidMaritalStatusByStatus('married', 'Widowed'));
    });
    it('should return true when civil status supplied and current status Widowed', () => {
      assert.isTrue(helper.checkIfValidMaritalStatusByStatus('civil', 'Widowed'));
    });
  });
  describe('lowerCaseOrNull', () => {
    it('should return null when undefined', () => {
      assert.isNull(helper.lowerCaseOrNull());
    });
    it('should return null when empty', () => {
      assert.isNull(helper.lowerCaseOrNull(''));
    });
    it('should return lowercase string when string supplied', () => {
      assert.equal(helper.lowerCaseOrNull('TEST TEST'), 'test test');
    });
  });
  describe('checkNameCharacters', () => {
    it('should return false when blank', () => {
      assert.isFalse(helper.checkNameCharacters(''));
    });
    it('should return false when contains a invalid character', () => {
      assert.isFalse(helper.checkNameCharacters('Test!'));
    });
    it('should return true when contains a valid characters with space', () => {
      assert.isTrue(helper.checkNameCharacters('Test tester'));
    });
    it('should return true when contains a valid characters with fullstop', () => {
      assert.isTrue(helper.checkNameCharacters('Test.'));
    });
    it('should return true when contains a valid characters with dash', () => {
      assert.isTrue(helper.checkNameCharacters('Test-tester'));
    });
    it('should return true when contains a valid characters with all', () => {
      assert.isTrue(helper.checkNameCharacters('Joe Test-tester The First.'));
    });
  });
});
