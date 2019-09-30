const assert = require('assert');
const awardAmounts = require('../../../lib/awardAmounts');
const claimData = require('../../lib/claimData');

const validResponse = {
  totalAmount: '110.00',
  weeklyStatePensionAmount: '100.00',
  weeklyProtectedPaymentAmount: '10.00',
  weeklyExtraStatePensionAmount: '0.00',
  weeklyInheritedExtraStatePensionAmount: '0.00',
};

describe('change of circumstances overview ', () => {
  describe('formatter', () => {
    it('should return formatted object with numbers as strings', () => {
      assert.equal(JSON.stringify(awardAmounts.formatter(claimData.validCurrentAmountDetails())), JSON.stringify(validResponse));
    });
  });
});
