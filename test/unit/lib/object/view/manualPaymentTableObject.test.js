const { assert } = require('chai');

const manualPaymentTableObject = require('../../../../../lib/objects/view/manualPaymentTableObject');

const formatted = {
  protectedPaymentAmount: '£10.00',
  cpsStatePensionAmount: '£20.00',
  totalAmount: '£30.00',
};

describe('manualPaymentTableObject', () => {
  describe('formatter', () => {
    it('should return false when "apiResponse" is undefined', () => {
      assert.isFalse(manualPaymentTableObject.formatter());
    });

    it('should return false when "protectedPaymentAmount" is undefined', () => {
      assert.isFalse(manualPaymentTableObject.formatter({ cpsStatePensionAmount: 20, totalAmount: 30 }));
    });

    it('should return false when "statePensionAmount" is undefined', () => {
      assert.isFalse(manualPaymentTableObject.formatter({ protectedPaymentAmount: 10, totalAmount: 30 }));
    });

    it('should return false when "totalAmount" is undefined', () => {
      assert.isFalse(manualPaymentTableObject.formatter({ protectedPaymentAmount: 10, cpsStatePensionAmount: 20 }));
    });

    it('should return false when passed string values', () => {
      const result = manualPaymentTableObject.formatter({ protectedPaymentAmount: '10', cpsStatePensionAmount: '20', totalAmount: '30' });
      assert.isFalse(result);
    });

    it('should return formatted manualPaymentTableObject when passed valid data (int)', () => {
      const result = manualPaymentTableObject.formatter({ protectedPaymentAmount: 10, cpsStatePensionAmount: 20, totalAmount: 30 });
      assert.deepEqual(result, formatted);
    });
  });
});
