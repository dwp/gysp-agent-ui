const { assert } = require('chai');

const srbAmountUpdateObject = require('../../../lib/objects/srbAmountUpdateObject');

const validJson = {
  inviteKey: 'SMI078957',
  spAmount: 100.0,
  protectedAmount: 50.0,
};

const validNullJson = {
  inviteKey: 'SMI078957',
  spAmount: null,
  protectedAmount: null,
};

describe('srb amount update put object', () => {
  it('should return valid json when object is called with float values', () => {
    const json = srbAmountUpdateObject.putObject('SMI078957', 100.0, 50.0);
    assert.deepEqual(json, validJson);
  });

  it('should return valid json when object is called with string values', () => {
    const json = srbAmountUpdateObject.putObject('SMI078957', '100.00', '50.00');
    assert.deepEqual(json, validJson);
  });
  it('should return valid json when object is called with null values', () => {
    const json = srbAmountUpdateObject.putObject('SMI078957', null, null);
    assert.deepEqual(json, validNullJson);
  });
  it('should return valid json when object is called with undefined values', () => {
    const json = srbAmountUpdateObject.putObject('SMI078957', undefined, undefined);
    assert.deepEqual(json, validNullJson);
  });
});
