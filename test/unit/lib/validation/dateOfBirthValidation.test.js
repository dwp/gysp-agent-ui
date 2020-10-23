const { assert } = require('chai');

const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../../config/i18next');

const dateOfBirthValidation = require('../../../../lib/validation/dateOfBirthValidation');

const maritalStatuses = ['married', 'civil'];

describe('Validation: date of birth verification', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

  let now;

  beforeEach(() => {
    now = Date.now;
  });

  afterEach(() => {
    Date.now = now;
  });

  maritalStatuses.forEach((maritalStatus) => {
    it(`should return error when post is empty and maritalStatus is ${maritalStatus}`, () => {
      const errors = dateOfBirthValidation({}, maritalStatus);
      assert.equal(Object.keys(errors).length, 5);
      assert.equal(errors.date.text, 'Enter a date of birth');
    });

    it(`should return error when fields are blank and maritalStatus is ${maritalStatus}`, () => {
      const errors = dateOfBirthValidation({
        dateDay: '', dateMonth: '', dateYear: '', verification: '',
      }, maritalStatus);
      assert.equal(Object.keys(errors).length, 5);
      assert.equal(errors.date.text, 'Enter a date of birth');
    });

    describe('Field: date', () => {
      it(`should return error when day is not complete and maritalStatus is ${maritalStatus}`, () => {
        const errors = dateOfBirthValidation({
          dateDay: '', dateMonth: '1', dateYear: '2000', verification: 'V',
        }, maritalStatus);
        assert.equal(Object.keys(errors).length, 2);
        assert.equal(errors.date.text, 'Date of birth must include a day, month and year');
      });

      it(`should return error when month is not complete and maritalStatus is ${maritalStatus}`, () => {
        const errors = dateOfBirthValidation({
          dateDay: '1', dateMonth: '', dateYear: '2000', verification: 'V',
        }, maritalStatus);
        assert.equal(Object.keys(errors).length, 2);
        assert.equal(errors.date.text, 'Date of birth must include a day, month and year');
      });

      it(`should return error when year is not complete and maritalStatus is ${maritalStatus}`, () => {
        const errors = dateOfBirthValidation({
          dateDay: '1', dateMonth: '1', dateYear: '', verification: 'V',
        }, maritalStatus);
        assert.equal(Object.keys(errors).length, 2);
        assert.equal(errors.date.text, 'Date of birth must include a day, month and year');
      });

      it(`should return error when day is invalid and maritalStatus is ${maritalStatus}`, () => {
        const errors = dateOfBirthValidation({
          dateDay: '40', dateMonth: '12', dateYear: '2000', verification: 'V',
        }, maritalStatus);
        assert.equal(Object.keys(errors).length, 2);
        assert.equal(errors.date.text, 'Enter a real date of birth, like 12 2 1950');
      });

      it(`should return error when month is invalid and maritalStatus is ${maritalStatus}`, () => {
        const errors = dateOfBirthValidation({
          dateDay: '01', dateMonth: '13', dateYear: '2000', verification: 'V',
        }, maritalStatus);
        assert.equal(Object.keys(errors).length, 2);
        assert.equal(errors.date.text, 'Enter a real date of birth, like 12 2 1950');
      });

      it(`should return error when year is invalid and maritalStatus is ${maritalStatus}`, () => {
        const errors = dateOfBirthValidation({
          dateDay: '01', dateMonth: '12', dateYear: '20', verification: 'V',
        }, maritalStatus);
        assert.equal(Object.keys(errors).length, 2);
        assert.equal(errors.date.text, 'Enter a real date of birth, like 12 2 1950');
      });

      it(`should return error when date is invalid and maritalStatus is ${maritalStatus}`, () => {
        const errors = dateOfBirthValidation({
          dateDay: '40', dateMonth: '15', dateYear: '20', verification: 'V',
        }, maritalStatus);
        assert.equal(Object.keys(errors).length, 4);
        assert.equal(errors.date.text, 'Enter a real date of birth, like 12 2 1950');
      });

      it(`should return error when date is in the future and maritalStatus is ${maritalStatus}`, () => {
        Date.now = () => (0); // 1970-01-01
        const errors = dateOfBirthValidation({
          dateYear: '1970', dateMonth: '1', dateDay: '2', verification: 'V',
        }, maritalStatus);
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.date.text, 'Date of birth must be in the past');
      });

      it(`should not return error when date is in the not in future and maritalStatus is ${maritalStatus}`, () => {
        Date.now = () => (86400000); // 1970-01-02
        const errors = dateOfBirthValidation({
          dateYear: '1970', dateMonth: '1', dateDay: '1', verification: 'V',
        }, maritalStatus);
        assert.equal(Object.keys(errors).length, 0);
      });

      it(`should not return error when date is today and maritalStatus is ${maritalStatus}`, () => {
        Date.now = () => (86400000); // 1970-01-02
        const errors = dateOfBirthValidation({
          dateYear: '1970', dateMonth: '1', dateDay: '2', verification: 'V',
        }, maritalStatus);
        assert.equal(Object.keys(errors).length, 0);
      });
    });

    describe('Field: verification', () => {
      it(`should return error when verification is invalid and maritalStatus is ${maritalStatus}`, () => {
        const errors = dateOfBirthValidation({
          dateDay: '1', dateMonth: '1', dateYear: '2000', verification: 'BOB',
        }, maritalStatus);
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.verification.text, 'Select whether the date of birth is verified or not verified');
      });

      it(`should return not return error when verification is V and maritalStatus is ${maritalStatus}`, () => {
        const errors = dateOfBirthValidation({
          dateDay: '1', dateMonth: '1', dateYear: '2000', verification: 'V',
        }, maritalStatus);
        assert.equal(Object.keys(errors).length, 0);
      });

      it(`should return not return error when verification is NV and maritalStatus is ${maritalStatus}`, () => {
        const errors = dateOfBirthValidation({
          dateDay: '1', dateMonth: '1', dateYear: '2000', verification: 'NV',
        }, maritalStatus);
        assert.equal(Object.keys(errors).length, 0);
      });
    });
  });
});
