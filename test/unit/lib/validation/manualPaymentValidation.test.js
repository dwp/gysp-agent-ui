const assert = require('assert');

const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');
const i18nextConfig = require('../../../../config/i18next');

const validator = require('../../../../lib/validation/manualPaymentValidation');

const {
  dayIs28MonthIs2YearIs2000,
  dayIs29MonthIs2YearIs2004,
  dayIs28MonthIs2YearIs2001,
  dayIs30MonthIs4,
  dayIs31MonthIs1,
  dayIsLessThan1,
  dayIsMoreThan28MonthIs2YearIs2001,
  dayIsMoreThan29MonthIs2YearIs2004,
  dayIsMoreThan30MonthIs4,
  dayIsMoreThan31MonthIs1,
  empty,
  leadingZeros,
  monthIsLessThan1,
  monthIsMoreThan12,
  toDateBeforeFromDate,
  yearIsLessThanFourCharacters,
  yearIsMoreThanFourCharacters,
} = require('../../../lib/manualPaymentData');

describe('Manual Payment Validation', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

  describe('details validator', () => {
    const assertAll = (errors) => {
      assert.equal(Object.keys(errors).length, 12);
      assert.equal(errors.fromDate.text, 'Enter a payment period \'from\' date');
      assert.equal(errors.toDate.text, 'Enter a payment period \'to\' date');
      assert.equal(errors.paymentDate.text, 'Enter a payment date');
      assert.ok(errors.fromDay);
      assert.ok(errors.fromMonth);
      assert.ok(errors.fromYear);
      assert.ok(errors.toDay);
      assert.ok(errors.toMonth);
      assert.ok(errors.toYear);
      assert.ok(errors.paymentDay);
      assert.ok(errors.paymentMonth);
      assert.ok(errors.paymentYear);
    };

    const assertDay = (errors) => {
      assert.equal(Object.keys(errors).length, 6);
      assert.equal(errors.fromDate.text, 'Enter a real date, like 12 8 2020');
      assert.ok(errors.fromDay);
      assert.equal(errors.toDate.text, 'Enter a real date, like 12 8 2020');
      assert.ok(errors.toDay);
      assert.equal(errors.paymentDate.text, 'Enter a real date, like 12 8 2020');
      assert.ok(errors.paymentDay);
    };

    const assertMonth = (errors) => {
      assert.equal(Object.keys(errors).length, 6);
      assert.equal(errors.fromDate.text, 'Enter a real date, like 12 8 2020');
      assert.ok(errors.fromMonth);
      assert.equal(errors.toDate.text, 'Enter a real date, like 12 8 2020');
      assert.ok(errors.toMonth);
      assert.equal(errors.paymentDate.text, 'Enter a real date, like 12 8 2020');
      assert.ok(errors.paymentMonth);
    };

    const assertYear = (errors) => {
      assert.equal(Object.keys(errors).length, 6);
      assert.equal(errors.fromDate.text, 'Enter a real date, like 12 8 2020');
      assert.ok(errors.fromYear);
      assert.equal(errors.toDate.text, 'Enter a real date, like 12 8 2020');
      assert.ok(errors.toYear);
      assert.equal(errors.paymentDate.text, 'Enter a real date, like 12 8 2020');
      assert.ok(errors.paymentYear);
    };

    const assertNo = (errors) => {
      assert.equal(Object.keys(errors).length, 0);
    };

    it('should return errors when "form" is undefined', () => {
      const errors = validator.details();
      assertAll(errors);
    });

    it('should return errors when all form fields are undefined', () => {
      const errors = validator.details({});
      assertAll(errors);
    });

    it('should return errors when all form fields are empty', () => {
      const errors = validator.details(empty);
      assertAll(errors);
    });

    it('should return errors when each day is less than 1', () => {
      const errors = validator.details(dayIsLessThan1);
      assertDay(errors);
    });

    it('should return errors when each year is 2004, each month is 2, and each day is more than 29 (leap year)', () => {
      const errors = validator.details(dayIsMoreThan29MonthIs2YearIs2004);
      assertDay(errors);
    });

    it('should return errors when each year is 2001, each month is 2, and each day is more than 28 (normal year)', () => {
      const errors = validator.details(dayIsMoreThan28MonthIs2YearIs2001);
      assertDay(errors);
    });

    it('should return errors when each month is 4, and each day is more than 30', () => {
      const errors = validator.details(dayIsMoreThan30MonthIs4);
      assertDay(errors);
    });

    it('should return errors when each month is 1, and each day is more than 31', () => {
      const errors = validator.details(dayIsMoreThan31MonthIs1);
      assertDay(errors);
    });

    it('should return errors when each month is less than 1', () => {
      const errors = validator.details(monthIsLessThan1);
      assertMonth(errors);
    });

    it('should return errors when each month is more than 12', () => {
      const errors = validator.details(monthIsMoreThan12);
      assertMonth(errors);
    });

    it('should return errors when each year less than 4 characters', () => {
      const errors = validator.details(yearIsLessThanFourCharacters);
      assertYear(errors);
    });

    it('should return errors when each year more than 4 characters', () => {
      const errors = validator.details(yearIsMoreThanFourCharacters);
      assertYear(errors);
    });

    it('should return errors when "to" date is before "from" date', () => {
      const errors = validator.details(toDateBeforeFromDate);
      assert.equal(Object.keys(errors).length, 4);
      assert.equal(errors.toDate.text, 'The \'to\' date cannot be before the \'from\' date');
      assert.ok(errors.toDay);
      assert.ok(errors.toMonth);
      assert.ok(errors.toYear);
    });

    it('should return empty object when each day and each month contains leading zeros', () => {
      const errors = validator.details(leadingZeros);
      assertNo(errors);
    });

    it('should return empty object when each year is 2000, each month is 2, and each day is 28 (skipped leap year)', () => {
      const errors = validator.details(dayIs28MonthIs2YearIs2000);
      assertNo(errors);
    });

    it('should return empty object when each year is 2001, each month is 2, and each day is 28 (normal year)', () => {
      const errors = validator.details(dayIs28MonthIs2YearIs2001);
      assertNo(errors);
    });

    it('should return empty object when each year is 2004, each month is 2, and each day is 29 (leap year)', () => {
      const errors = validator.details(dayIs29MonthIs2YearIs2004);
      assertNo(errors);
    });

    it('should return empty object when each month is 4, and each day is 30', () => {
      const errors = validator.details(dayIs30MonthIs4);
      assertNo(errors);
    });

    it('should return empty object when each month is 1, and each day is 31', () => {
      const errors = validator.details(dayIs31MonthIs1);
      assertNo(errors);
    });
  });
});
