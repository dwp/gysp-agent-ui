const assert = require('assert');
const validator = require('../../../../lib/validation/stopStatePension');

describe('Stop State Pension Validation', () => {
  describe('stopStatePension validator', () => {
    it('should return error when "form" is undefined', () => {
      const errors = validator.stopStatePension();
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors.reason.text, 'Select a reason for stopping the State Pension');
    });

    it('should return error when "reason" is undefined', () => {
      const errors = validator.stopStatePension({});
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors.reason.text, 'Select a reason for stopping the State Pension');
    });

    it('should return error when "reason" is empty', () => {
      const errors = validator.stopStatePension({ reason: 'other' });
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors.reason.text, 'Select a reason for stopping the State Pension');
    });

    it('should return error when "reason" is not "death", and not "deferral', () => {
      const errors = validator.stopStatePension({ reason: 'other' });
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors.reason.text, 'Select a reason for stopping the State Pension');
    });

    it('should return empty object when "reason" is "death"', () => {
      const errors = validator.stopStatePension({ reason: 'death' });
      assert.equal(Object.keys(errors).length, 0);
    });

    it('should return empty object when "reason" is "deferral"', () => {
      const errors = validator.stopStatePension({ reason: 'deferral' });
      assert.equal(Object.keys(errors).length, 0);
    });
  });
});
