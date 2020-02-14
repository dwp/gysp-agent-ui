const { assert } = require('chai');

const srbAmountUpdateObject = require('../../../lib/objects/srbAmountUpdateObject');

const validJson = {
  inviteKey: 'SMI078957',
  entitlementDate: '2020-01-01',
  spAmount: 100.0,
  protectedAmount: 50.0,
  extraSpAmount: 0,
  inheritedExtraSpAmount: 0,
};

const validNullJson = {
  inviteKey: 'SMI078957',
  entitlementDate: null,
  spAmount: null,
  protectedAmount: null,
  extraSpAmount: 0,
  inheritedExtraSpAmount: 0,
};

const reviewAwardDate = {
  dateYear: '2020',
  dateMonth: '02',
  dateDay: '01',
};

const validJsonWithAssertedEntitlementDate = {
  inviteKey: 'SMI078957',
  entitlementDate: '2020-02-01T00:00:00.000Z',
  spAmount: 100.0,
  protectedAmount: 50.0,
  extraSpAmount: 0,
  inheritedExtraSpAmount: 0,
};

describe('srb amount update put object', () => {
  it('should return valid json when object is called with float values', () => {
    const json = srbAmountUpdateObject.putObject('SMI078957', { entitlementDate: '2020-01-01', newStatePensionAmount: 100.0, protectedPaymentAmount: 50.0 });
    assert.deepEqual(json, validJson);
  });
  it('should return valid json when object is called with string values', () => {
    const json = srbAmountUpdateObject.putObject('SMI078957', { entitlementDate: '2020-01-01', newStatePensionAmount: '100.00', protectedPaymentAmount: '50.00' });
    assert.deepEqual(json, validJson);
  });
  it('should return valid json when object is called with null values', () => {
    const json = srbAmountUpdateObject.putObject('SMI078957', { entitlementDate: null, newStatePensionAmount: null, protectedPaymentAmount: null });
    assert.deepEqual(json, validNullJson);
  });
  it('should return valid json when object is called and includes asserted entitlement date ', () => {
    const json = srbAmountUpdateObject.putObject('SMI078957', { entitlementDate: '2020-01-01', newStatePensionAmount: 100.0, protectedPaymentAmount: 50.0 }, reviewAwardDate);
    assert.deepEqual(json, validJsonWithAssertedEntitlementDate);
  });
});
