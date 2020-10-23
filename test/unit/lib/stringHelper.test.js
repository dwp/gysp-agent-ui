const { assert } = require('chai');
const helper = require('../../../lib/stringHelper');

describe('string helper', () => {
  describe('extractNumbers', () => {
    it('should extract numbers from alpha-numeric string', () => {
      assert.equal(helper.extractNumbers('abc38h89jg8940'), '38898940');
    });
    it('should extract numbers and ignore other chars from string', () => {
      assert.equal(helper.extractNumbers('aaa+1-1789sdsd8'), '117898');
    });
  });
});
