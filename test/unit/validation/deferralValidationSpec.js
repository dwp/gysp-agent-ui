const assert = require('assert');
const validator = require('../../../lib/validation/deferralValidation');

describe('Deferral Validation', () => {
  describe('dateRequestReceived validator', () => {
    it('should return error when "form" is undefined', () => {
      const errors = validator.dateRequestReceived();
      assert.equal(Object.keys(errors).length, 4);
      assert.equal(errors.date.text, 'deferral-date-request-received:fields.date.errors.required');
      assert.ok(errors.day);
      assert.ok(errors.month);
      assert.ok(errors.year);
    });

    it('should return error when "day", "month", and "year" are undefined', () => {
      const errors = validator.dateRequestReceived({});
      assert.equal(Object.keys(errors).length, 4);
      assert.equal(errors.date.text, 'deferral-date-request-received:fields.date.errors.required');
      assert.ok(errors.day);
      assert.ok(errors.month);
      assert.ok(errors.year);
    });

    it('should return error when "day", "month", and "year" are empty', () => {
      const errors = validator.dateRequestReceived({ day: '', month: '', year: '' });
      assert.equal(Object.keys(errors).length, 4);
      assert.equal(errors.date.text, 'deferral-date-request-received:fields.date.errors.required');
      assert.ok(errors.day);
      assert.ok(errors.month);
      assert.ok(errors.year);
    });

    it('should return error when "day" is less than 1', () => {
      const errors = validator.dateRequestReceived({ day: '0', month: '1', year: '2000' });
      assert.equal(Object.keys(errors).length, 2);
      assert.equal(errors.date.text, 'deferral-date-request-received:fields.date.errors.invalid');
      assert.ok(errors.day);
    });

    it('should return error when "year" is 2004, "month" is 2, and "day" is more than 29 (leap year)', () => {
      const errors = validator.dateRequestReceived({ day: '30', month: '2', year: '2004' });
      assert.equal(Object.keys(errors).length, 2);
      assert.equal(errors.date.text, 'deferral-date-request-received:fields.date.errors.invalid');
      assert.ok(errors.day);
    });

    it('should return error when "year" is 2001, "month" is 2, and "day" is more than 28 (normal year)', () => {
      const errors = validator.dateRequestReceived({ day: '29', month: '2', year: '2001' });
      assert.equal(Object.keys(errors).length, 2);
      assert.equal(errors.date.text, 'deferral-date-request-received:fields.date.errors.invalid');
      assert.ok(errors.day);
    });

    it('should return error when "month" is 4, and "day" is more than 30', () => {
      const errors = validator.dateRequestReceived({ day: '31', month: '4', year: '2000' });
      assert.equal(Object.keys(errors).length, 2);
      assert.equal(errors.date.text, 'deferral-date-request-received:fields.date.errors.invalid');
      assert.ok(errors.day);
    });

    it('should return error when "month" is 1, and "day" is more than 31', () => {
      const errors = validator.dateRequestReceived({ day: '32', month: '1', year: '2000' });
      assert.equal(Object.keys(errors).length, 2);
      assert.equal(errors.date.text, 'deferral-date-request-received:fields.date.errors.invalid');
      assert.ok(errors.day);
    });

    it('should return error when "month" is less than 1', () => {
      const errors = validator.dateRequestReceived({ day: '1', month: '0', year: '2000' });
      assert.equal(Object.keys(errors).length, 2);
      assert.equal(errors.date.text, 'deferral-date-request-received:fields.date.errors.invalid');
      assert.ok(errors.month);
    });

    it('should return error when "month" is more than 12', () => {
      const errors = validator.dateRequestReceived({ day: '1', month: '13', year: '2000' });
      assert.equal(Object.keys(errors).length, 2);
      assert.equal(errors.date.text, 'deferral-date-request-received:fields.date.errors.invalid');
      assert.ok(errors.month);
    });

    it('should return error when "year" less than 4 characters', () => {
      const errors = validator.dateRequestReceived({ day: '1', month: '1', year: '200' });
      assert.equal(Object.keys(errors).length, 2);
      assert.equal(errors.date.text, 'deferral-date-request-received:fields.date.errors.invalid');
      assert.ok(errors.year);
    });

    it('should return error when "year" more than 4 characters', () => {
      const errors = validator.dateRequestReceived({ day: '1', month: '1', year: '20000' });
      assert.equal(Object.keys(errors).length, 2);
      assert.equal(errors.date.text, 'deferral-date-request-received:fields.date.errors.invalid');
      assert.ok(errors.year);
    });

    it('should return error when date is in the future', () => {
      const date = new Date();
      const errors = validator.dateRequestReceived({
        day: `${date.getDate() + 1}`,
        month: `${date.getMonth() + 1}`,
        year: `${date.getFullYear()}`,
      });
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors.date.text, 'deferral-date-request-received:fields.date.errors.future');
    });

    it('should return empty object when "day" contains leading leading zero', () => {
      const errors = validator.dateRequestReceived({ day: '01', month: '1', year: '2000' });
      assert.equal(Object.keys(errors).length, 0);
    });

    it('should return empty object when "month" contains leading leading zero', () => {
      const errors = validator.dateRequestReceived({ day: '1', month: '01', year: '2000' });
      assert.equal(Object.keys(errors).length, 0);
    });

    it('should return empty object when "year" is 2004, "month" is 2, and "day" is 29 (leap year)', () => {
      const errors = validator.dateRequestReceived({ day: '29', month: '2', year: '2004' });
      assert.equal(Object.keys(errors).length, 0);
    });

    it('should return empty object when "year" is 2000, "month" is 2, and "day" is 28 (skipped leap year)', () => {
      const errors = validator.dateRequestReceived({ day: '28', month: '2', year: '2000' });
      assert.equal(Object.keys(errors).length, 0);
    });

    it('should return empty object when "year" is 2001, "month" is 2, and "day" is 28 (normal year)', () => {
      const errors = validator.dateRequestReceived({ day: '28', month: '2', year: '2001' });
      assert.equal(Object.keys(errors).length, 0);
    });

    it('should return empty object when "month" is 4, and "day" is 30', () => {
      const errors = validator.dateRequestReceived({ day: '30', month: '1', year: '2000' });
      assert.equal(Object.keys(errors).length, 0);
    });

    it('should return empty object when "month" is 1, and "day" is 31', () => {
      const errors = validator.dateRequestReceived({ day: '31', month: '1', year: '2000' });
      assert.equal(Object.keys(errors).length, 0);
    });
  });

  describe('defaultDate validator', () => {
    it('should return error when "form" is undefined', () => {
      const errors = validator.defaultDate();
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors['default-date'].text, 'deferral-default-date:fields.defaultDate.errors.required');
    });

    it('should return error when "default-date" is undefined', () => {
      const errors = validator.defaultDate({});
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors['default-date'].text, 'deferral-default-date:fields.defaultDate.errors.required');
    });

    it('should return error when "default-date" is empty', () => {
      const errors = validator.defaultDate({ 'default-date': '' });
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors['default-date'].text, 'deferral-default-date:fields.defaultDate.errors.required');
    });

    it('should return error when "default-date" is not "yes", and not "no', () => {
      const errors = validator.defaultDate({ 'default-date': 'other' });
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors['default-date'].text, 'deferral-default-date:fields.defaultDate.errors.required');
    });

    it('should return empty object when "default-date" is "yes"', () => {
      const errors = validator.defaultDate({ 'default-date': 'yes' });
      assert.equal(Object.keys(errors).length, 0);
    });

    it('should return empty object when "default-date" is "no"', () => {
      const errors = validator.defaultDate({ 'default-date': 'no' });
      assert.equal(Object.keys(errors).length, 0);
    });
  });
});
