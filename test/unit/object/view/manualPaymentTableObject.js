const { assert } = require('chai');

const manualPaymentTableObject = require('../../../../lib/objects/view/manualPaymentTableObject');

const formatted = {
  protectedPaymentAmount: '£10.00',
  statePensionAmount: '£20.00',
  totalAmount: '£30.00',
};

describe('manualPaymentTableObject', () => {
  describe('formatter', () => {
    it('should return false when "apiResponse" is undefined', () => {
      assert.isFalse(manualPaymentTableObject.formatter());
    });

    it('should return false when "protectedPaymentAmount" is undefined', () => {
      assert.isFalse(manualPaymentTableObject.formatter({ statePensionAmount: 20, totalAmount: 30 }));
    });

    it('should return false when "statePensionAmount" is undefined', () => {
      assert.isFalse(manualPaymentTableObject.formatter({ protectedPaymentAmount: 10, totalAmount: 30 }));
    });

    it('should return false when "totalAmount" is undefined', () => {
      assert.isFalse(manualPaymentTableObject.formatter({ protectedPaymentAmount: 10, statePensionAmount: 20 }));
    });

    it('should return formatted manualPaymentTableObject when passed valid data (int)', () => {
      const result = manualPaymentTableObject.formatter({ protectedPaymentAmount: 10, statePensionAmount: 20, totalAmount: 30 });
      assert.deepEqual(result, formatted);
    });

    it('should return formatted manualPaymentTableObject when passed valid data (string)', () => {
      const result = manualPaymentTableObject.formatter({ protectedPaymentAmount: '10', statePensionAmount: '20', totalAmount: '30' });
      assert.deepEqual(result, formatted);
    });
  });
});
