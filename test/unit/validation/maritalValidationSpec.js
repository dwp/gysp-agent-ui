const { assert } = require('chai');

const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../config/i18next');

const validator = require('../../../lib/validation/maritalValidation');

const emptyPostRequest = {};
const validPostRequest = { firstName: 'Joe', lastName: 'Bloggs' };

const maritalStatus = ['married', 'civil', 'divorced', 'widowed', 'dissolved'];

const apiValidationValidCallback = () => ({ valid: true, validation: { max: 0 } });
const apiValidationInvalidCallback = () => ({ valid: false, validation: { max: 160 } });

describe('marital validator', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

  describe('partnerValidator', () => {
    it('should return errors when with empty spouse post', () => {
      const errors = validator.partnerValidator(emptyPostRequest, 'married');
      assert.equal(Object.keys(errors).length, 2);
      assert.equal(errors.firstName.text, "Enter the spouse's first name");
      assert.equal(errors.lastName.text, "Enter the spouse's last name");
    });

    it('should return errors when with empty partner post', () => {
      const errors = validator.partnerValidator(emptyPostRequest, 'civil');
      assert.equal(Object.keys(errors).length, 2);
      assert.equal(errors.firstName.text, "Enter the partner's first name");
      assert.equal(errors.lastName.text, "Enter the partner's last name");
    });

    describe('partnerNino', () => {
      it('should return no error when nino is undefined', () => {
        const errors = validator.partnerValidator({ ...validPostRequest });
        assert.equal(Object.keys(errors).length, 0);
      });

      it('should return error when partnerNino is blank', () => {
        const errors = validator.partnerValidator({ ...validPostRequest, partnerNino: '' });
        assert.equal(Object.keys(errors).length, 0);
      });

      it('should return error when partnerNino is invalid', () => {
        const errors = validator.partnerValidator({ ...validPostRequest, partnerNino: 'ZZ123456C' });
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.partnerNino.text, 'Enter a National Insurance number in the correct format, like QQ123456C');
      });

      it('should return error when partnerNino length is 7', () => {
        const errors = validator.partnerValidator({ ...validPostRequest, partnerNino: 'AA12345' });
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.partnerNino.text, 'National Insurance number must be 9 characters or less');
      });

      it('should return error when partnerNino length is 10', () => {
        const errors = validator.partnerValidator({ ...validPostRequest, partnerNino: 'AA12345678' });
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.partnerNino.text, 'National Insurance number must be 9 characters or less');
      });

      it('should return no errors when partnerNino valid', () => {
        const errors = validator.partnerValidator({ ...validPostRequest, partnerNino: 'AA123456C' });
        assert.equal(Object.keys(errors).length, 0);
      });
    });

    describe('firstName', () => {
      it('should return error when spouse firstName is undefined', () => {
        const errors = validator.partnerValidator({ lastName: 'Bloggs' }, 'married');
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.firstName.text, "Enter the spouse's first name");
      });

      it('should return error when partner firstName is undefined', () => {
        const errors = validator.partnerValidator({ lastName: 'Bloggs' }, 'civil');
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.firstName.text, "Enter the partner's first name");
      });

      it('should return error when spouse firstName is empty', () => {
        const errors = validator.partnerValidator({ ...validPostRequest, firstName: '' }, 'married');
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.firstName.text, "Enter the spouse's first name");
      });

      it('should return error when partner firstName is empty', () => {
        const errors = validator.partnerValidator({ ...validPostRequest, firstName: '' }, 'civil');
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.firstName.text, "Enter the partner's first name");
      });

      it('should return error when firstName is invalid', () => {
        const errors = validator.partnerValidator({ ...validPostRequest, firstName: '123' });
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.firstName.text, 'First name must start with a letter and only include letters a to z, hyphens, apostrophes, full stops, spaces and ampersands');
      });

      it('should return error when firstName greater than 35', () => {
        const errors = validator.partnerValidator({ ...validPostRequest, firstName: 'qwertyuiopasdfghjklzxcvbnmqwertyuiop' });
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.firstName.text, 'First name must have 35 characters or less');
      });

      it('should return no error when firstName valid', () => {
        const errors = validator.partnerValidator({ ...validPostRequest, firstName: 'qwertyuiopasdfghjklzxcvbnmqwertyuio' });
        assert.equal(Object.keys(errors).length, 0);
      });
    });

    describe('lastName', () => {
      it('should return error when spouse lastName is undefined', () => {
        const errors = validator.partnerValidator({ firstName: 'Joe' }, 'married');
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.lastName.text, "Enter the spouse's last name");
      });

      it('should return error when partner lastName is undefined', () => {
        const errors = validator.partnerValidator({ firstName: 'Joe' }, 'civil');
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.lastName.text, "Enter the partner's last name");
      });

      it('should return error when spouse lastName is empty', () => {
        const errors = validator.partnerValidator({ ...validPostRequest, lastName: '' }, 'married');
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.lastName.text, "Enter the spouse's last name");
      });

      it('should return error when partner lastName is empty', () => {
        const errors = validator.partnerValidator({ ...validPostRequest, lastName: '' }, 'civil');
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.lastName.text, "Enter the partner's last name");
      });

      it('should return error when lastName is invalid', () => {
        const errors = validator.partnerValidator({ ...validPostRequest, lastName: '123' });
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.lastName.text, 'Last name must start with a letter and only include letters a to z, hyphens, apostrophes, full stops, spaces and ampersands');
      });

      it('should return error when lastName greater than 35', () => {
        const errors = validator.partnerValidator({ ...validPostRequest, lastName: 'qwertyuiopasdfghjklzxcvbnmqwertyuiop' });
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.lastName.text, 'Last name must have 35 characters or less');
      });

      it('should return no error when lastName valid', () => {
        const errors = validator.partnerValidator({ ...validPostRequest, lastName: 'qwertyuiopasdfghjklzxcvbnmqwertyuio' });
        assert.equal(Object.keys(errors).length, 0);
      });
    });

    describe('otherName', () => {
      it('should return no error when otherName is undefined', () => {
        const errors = validator.partnerValidator({ ...validPostRequest });
        assert.equal(Object.keys(errors).length, 0);
      });

      it('should return no error when otherName is empty', () => {
        const errors = validator.partnerValidator({ ...validPostRequest, otherName: '' });
        assert.equal(Object.keys(errors).length, 0);
      });

      it('should return error when otherName is invalid', () => {
        const errors = validator.partnerValidator({ ...validPostRequest, otherName: '123' });
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.otherName.text, 'Other names must start with a letter and only include letters a to z, hyphens, apostrophes, full stops, spaces and ampersands');
      });

      it('should return error when otherName greater than 35', () => {
        const errors = validator.partnerValidator({ ...validPostRequest, otherName: 'qwertyuiopasdfghjklzxcvbnmqwertyuiop' });
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.otherName.text, 'Other names must have 35 characters or less');
      });

      it('should return no error when lastName valid', () => {
        const errors = validator.partnerValidator({ ...validPostRequest, otherName: 'qwertyuiopasdfghjklzxcvbnmqwertyuio' });
        assert.equal(Object.keys(errors).length, 0);
      });
    });

    describe('dob', () => {
      it('should return no error when dob is undefined', () => {
        const errors = validator.partnerValidator({ ...validPostRequest });
        assert.equal(Object.keys(errors).length, 0);
      });

      it('should return no error when dob is empty', () => {
        const errors = validator.partnerValidator({
          ...validPostRequest, dobDay: '', dobMonth: '', dobYear: '',
        });
        assert.equal(Object.keys(errors).length, 0);
      });

      it('should return error when dobDay is empty', () => {
        const errors = validator.partnerValidator({
          ...validPostRequest, dobDay: '', dobMonth: '01', dobYear: '2000',
        });
        assert.equal(Object.keys(errors).length, 2);
        assert.isTrue(errors.dobDay);
        assert.equal(errors.dob.text, 'Enter a real date, like 12 4 1993');
      });

      it('should return error when dobDay is invalid', () => {
        const errors = validator.partnerValidator({
          ...validPostRequest, dobDay: '40', dobMonth: '01', dobYear: '2000',
        });
        assert.equal(Object.keys(errors).length, 2);
        assert.isTrue(errors.dobDay);
        assert.equal(errors.dob.text, 'Enter a real date, like 12 4 1993');
      });

      it('should return error when dobMonth is empty', () => {
        const errors = validator.partnerValidator({
          ...validPostRequest, dobDay: '01', dobMonth: '', dobYear: '2000',
        });
        assert.equal(Object.keys(errors).length, 2);
        assert.isTrue(errors.dobMonth);
        assert.equal(errors.dob.text, 'Enter a real date, like 12 4 1993');
      });

      it('should return error when dobMonth is invalid', () => {
        const errors = validator.partnerValidator({
          ...validPostRequest, dobDay: '01', dobMonth: '13', dobYear: '2000',
        });
        assert.equal(Object.keys(errors).length, 2);
        assert.isTrue(errors.dobMonth);
        assert.equal(errors.dob.text, 'Enter a real date, like 12 4 1993');
      });

      it('should return error when dobYear is empty', () => {
        const errors = validator.partnerValidator({
          ...validPostRequest, dobDay: '01', dobMonth: '01', dobYear: '',
        });
        assert.equal(Object.keys(errors).length, 2);
        assert.isTrue(errors.dobYear);
        assert.equal(errors.dob.text, 'Enter a real date, like 12 4 1993');
      });

      it('should return error when dobYear is invalid', () => {
        const errors = validator.partnerValidator({
          ...validPostRequest, dobDay: '01', dobMonth: '01', dobYear: '20',
        });
        assert.equal(Object.keys(errors).length, 2);
        assert.isTrue(errors.dobYear);
        assert.equal(errors.dob.text, 'Enter a real date, like 12 4 1993');
      });

      it('should return error when dob is in the future', () => {
        const errors = validator.partnerValidator({
          ...validPostRequest, dobDay: '01', dobMonth: '01', dobYear: '4000',
        });
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.dob.text, 'Date of birth must be in the past');
      });

      it('should return no error when dob is valid', () => {
        const errors = validator.partnerValidator({
          ...validPostRequest, dobDay: '01', dobMonth: '01', dobYear: '2020',
        });
        assert.equal(Object.keys(errors).length, 0);
      });
    });
  });

  describe('partnerDobValidator', () => {
    maritalStatus.forEach((status) => {
      it(`should return no error when valid data is supplied - ${status} status`, () => {
        const errors = validator.partnerDobValidator({
          dobYear: '2019', dobMonth: '01', dobDay: '01', dobVerified: 'V',
        });
        assert.equal(Object.keys(errors).length, 0);
      });

      it(`should return all errors when empty - ${status} status`, () => {
        const errors = validator.partnerDobValidator({ }, status);
        assert.equal(Object.keys(errors).length, 5);
      });

      it(`should return all errors when blank - ${status}`, () => {
        const errors = validator.partnerDobValidator({
          dobYear: '', dobMonth: '', dobDay: '', dobVerified: '',
        }, status);
        assert.equal(Object.keys(errors).length, 5);
      });

      it(`should return error when date in the future - ${status}`, () => {
        const errors = validator.partnerDobValidator({
          dobYear: '2099', dobMonth: '01', dobDay: '01', dobVerified: 'V',
        }, status);
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.dob.text, i18next.t(`marital-detail:${status}.fields.dob.errors.future`));
      });

      it(`should return error when year is invalid - ${status}`, () => {
        const errors = validator.partnerDobValidator({
          dobYear: '20', dobMonth: '01', dobDay: '01', dobVerified: 'NV',
        }, status);
        assert.equal(Object.keys(errors).length, 2);
        assert.equal(errors.dob.text, 'Enter a real date, like 12 4 1993');
      });

      it(`should return error when month is invalid - ${status}`, () => {
        const errors = validator.partnerDobValidator({
          dobYear: '2018', dobMonth: '20', dobDay: '01', dobVerified: 'V',
        }, status);
        assert.equal(Object.keys(errors).length, 2);
        assert.equal(errors.dob.text, 'Enter a real date, like 12 4 1993');
      });

      it(`should return error when day is invalid - ${status}`, () => {
        const errors = validator.partnerDobValidator({
          dobYear: '2018', dobMonth: '01', dobDay: '40', dobVerified: 'NV',
        }, status);
        assert.equal(Object.keys(errors).length, 2);
        assert.equal(errors.dob.text, 'Enter a real date, like 12 4 1993');
      });

      it('should return error when dobVerified is not specified', () => {
        const errors = validator.partnerDobValidator({
          dobYear: '2018', dobMonth: '01', dobDay: '01', dobVerified: 'X',
        }, status);
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.dobVerified.text, 'Select whether the date of birth is verified or not verified');
      });
    });
  });

  describe('checkForInheritableStatePensionValidator', () => {
    it('should return errors when with empty post', () => {
      const errors = validator.checkForInheritableStatePensionValidator(emptyPostRequest);
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors.checkInheritableStatePension.text, "Select 'Yes' if you are able to check for any inheritable State Pension");
    });

    it('should return errors when with blank post', () => {
      const errors = validator.checkForInheritableStatePensionValidator({ checkInheritableStatePension: '' });
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors.checkInheritableStatePension.text, "Select 'Yes' if you are able to check for any inheritable State Pension");
    });

    it('should return errors when with invalid post', () => {
      const errors = validator.checkForInheritableStatePensionValidator({ checkInheritableStatePension: 'bob' });
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors.checkInheritableStatePension.text, "Select 'Yes' if you are able to check for any inheritable State Pension");
    });
  });

  describe('entitledToInheritedStatePensionValidator', () => {
    it('should return errors when with empty post', () => {
      const errors = validator.entitledToInheritedStatePensionValidator(emptyPostRequest);
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors.entitledInheritableStatePension.text, "Select 'Yes' if the claimant is entitled to any inherited State Pension");
    });

    it('should return errors when with blank post', () => {
      const errors = validator.entitledToInheritedStatePensionValidator({ entitledInheritableStatePension: '' });
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors.entitledInheritableStatePension.text, "Select 'Yes' if the claimant is entitled to any inherited State Pension");
    });

    it('should return errors when with invalid post', () => {
      const errors = validator.entitledToInheritedStatePensionValidator({ entitledInheritableStatePension: 'bob' });
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors.entitledInheritableStatePension.text, "Select 'Yes' if the claimant is entitled to any inherited State Pension");
    });
  });
  describe('updateStatePensionAwardValidator', () => {
    it('should return error when session is empty', async () => {
      const errors = await validator.updateStatePensionAwardValidator({});
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors.statePensionComponents.text, 'You must change at least one of the State Pension components');
    });
    it('should return error when session does not contain relevant session key', async () => {
      const errors = await validator.updateStatePensionAwardValidator({ foo: 'bar' });
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors.statePensionComponents.text, 'You must change at least one of the State Pension components');
    });
    it('should return no error when session contains one relevant session key', async () => {
      const errors = await validator.updateStatePensionAwardValidator({ 'update-state-pension-award-new-state-pension': { foo: 'bar' } });
      assert.equal(Object.keys(errors).length, 0);
      assert.isUndefined(errors.statePensionComponents);
    });
    it('should return no error when session contains two relevant session keys', async () => {
      const errors = await validator.updateStatePensionAwardValidator({
        'update-state-pension-award-new-state-pension': { foo: 'bar' },
        'update-state-pension-award-protected-payment': { foo: 'bar' },
      });
      assert.equal(Object.keys(errors).length, 0);
      assert.isUndefined(errors.statePensionComponents);
    });
    it('should return no error when session contains all relevant session keys', async () => {
      const errors = await validator.updateStatePensionAwardValidator({
        'update-state-pension-award-new-state-pension': { foo: 'bar' },
        'update-state-pension-award-protected-payment': { foo: 'bar' },
        'update-state-pension-award-inherited-extra-state-pension': { foo: 'bar' },
      });
      assert.equal(Object.keys(errors).length, 0);
      assert.isUndefined(errors.statePensionComponents);
    });
    it('should return no error when session contains all relevant session keys with multiple keys', async () => {
      const errors = await validator.updateStatePensionAwardValidator({
        foo: 'bar',
        'update-state-pension-award-new-state-pension': { foo: 'bar' },
        bar: 'foo',
        'update-state-pension-award-protected-payment': { foo: 'bar' },
        'update-state-pension-award-inherited-extra-state-pension': { foo: 'bar' },
      });
      assert.equal(Object.keys(errors).length, 0);
      assert.isUndefined(errors.statePensionComponents);
    });
  });
  describe('relevantInheritedAmountsValidator', () => {
    it('should return error when with empty post', () => {
      const errors = validator.relevantInheritedAmountsValidator(emptyPostRequest);
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors.inputs.text, 'Enter at least one inherited amount');
    });

    it('should return error when with blank post', () => {
      const errors = validator.relevantInheritedAmountsValidator({
        additionalPension: '',
        graduatedBenefit: '',
        basicExtraStatePension: '',
        additionalExtraStatePension: '',
        graduatedBenefitExtraStatePension: '',
        protectedPayment: '',
      });
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors.inputs.text, 'Enter at least one inherited amount');
    });

    describe('field: additionalPension', () => {
      it('should fail validation when value is invalid', () => {
        const errors = validator.relevantInheritedAmountsValidator({ additionalPension: 'bob' });
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.additionalPension.text, 'Enter a real amount of additional pension, like 123.45');
      });

      it('should fail validation when value is to long', () => {
        const errors = validator.relevantInheritedAmountsValidator({ additionalPension: '1000.00' });
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.additionalPension.text, 'Additional pension amount must be 6 characters or less');
      });

      it('should pass validation when value is valid', () => {
        const errors = validator.relevantInheritedAmountsValidator({ additionalPension: '100.00' });
        assert.equal(Object.keys(errors).length, 0);
      });
    });

    describe('field: graduatedBenefit', () => {
      it('should fail validation when value is invalid', () => {
        const errors = validator.relevantInheritedAmountsValidator({ graduatedBenefit: 'bob' });
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.graduatedBenefit.text, 'Enter a real amount of graduated benefit, like 123.45');
      });

      it('should fail validation when value is to long', () => {
        const errors = validator.relevantInheritedAmountsValidator({ graduatedBenefit: '1000.00' });
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.graduatedBenefit.text, 'Graduated benefit amount must be 6 characters or less');
      });

      it('should pass validation when value is valid', () => {
        const errors = validator.relevantInheritedAmountsValidator({ graduatedBenefit: '100.00' });
        assert.equal(Object.keys(errors).length, 0);
      });
    });

    describe('field: basicExtraStatePension', () => {
      it('should fail validation when value is invalid', () => {
        const errors = validator.relevantInheritedAmountsValidator({ basicExtraStatePension: 'bob' });
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.basicExtraStatePension.text, 'Enter a real amount of basic pension - extra State Pension, like 123.45');
      });

      it('should fail validation when value is to long', () => {
        const errors = validator.relevantInheritedAmountsValidator({ basicExtraStatePension: '1000.00' });
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.basicExtraStatePension.text, 'Basic pension - extra State Pension amount must be 6 characters or less');
      });

      it('should pass validation when value is valid', () => {
        const errors = validator.relevantInheritedAmountsValidator({ basicExtraStatePension: '100.00' });
        assert.equal(Object.keys(errors).length, 0);
      });
    });

    describe('field: additionalExtraStatePension', () => {
      it('should fail validation when value is invalid', () => {
        const errors = validator.relevantInheritedAmountsValidator({ additionalExtraStatePension: 'bob' });
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.additionalExtraStatePension.text, 'Enter a real amount of additional extra State Pension, like 123.45');
      });

      it('should fail validation when value is to long', () => {
        const errors = validator.relevantInheritedAmountsValidator({ additionalExtraStatePension: '1000.00' });
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.additionalExtraStatePension.text, 'Additional extra State Pension amount must be 6 characters or less');
      });

      it('should pass validation when value is valid', () => {
        const errors = validator.relevantInheritedAmountsValidator({ additionalExtraStatePension: '100.00' });
        assert.equal(Object.keys(errors).length, 0);
      });
    });

    describe('field: graduatedBenefitExtraStatePension', () => {
      it('should fail validation when value is invalid', () => {
        const errors = validator.relevantInheritedAmountsValidator({ graduatedBenefitExtraStatePension: 'bob' });
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.graduatedBenefitExtraStatePension.text, 'Enter a real amount of graduated benefit - extra State Pension, like 123.45');
      });

      it('should fail validation when value is to long', () => {
        const errors = validator.relevantInheritedAmountsValidator({ graduatedBenefitExtraStatePension: '1000.00' });
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.graduatedBenefitExtraStatePension.text, 'Graduated benefit - extra State Pension amount must be 6 characters or less');
      });

      it('should pass validation when value is valid', () => {
        const errors = validator.relevantInheritedAmountsValidator({ graduatedBenefitExtraStatePension: '100.00' });
        assert.equal(Object.keys(errors).length, 0);
      });
    });

    describe('field: protectedPayment', () => {
      it('should fail validation when value is invalid', () => {
        const errors = validator.relevantInheritedAmountsValidator({ protectedPayment: 'bob' });
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.protectedPayment.text, 'Enter a real amount of protected payment, like 123.45');
      });

      it('should fail validation when value is to long', () => {
        const errors = validator.relevantInheritedAmountsValidator({ protectedPayment: '1000.00' });
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.protectedPayment.text, 'Protected payment amount must be 6 characters or less');
      });

      it('should pass validation when value is valid', () => {
        const errors = validator.relevantInheritedAmountsValidator({ protectedPayment: '100.00' });
        assert.equal(Object.keys(errors).length, 0);
      });
    });
  });

  describe('updateStatePensionAwardAmountValidator', () => {
    ['new-state-pension', 'protected-payment', 'inherited-extra-state-pension'].forEach((type) => {
      it(`should return error when with empty post when type ${type}`, async () => {
        const errors = await validator.updateStatePensionAwardAmountValidator(emptyPostRequest, type);
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.amount.text, i18next.t(`marital-update-award-amount:fields.amount.${type}.errors.required`));
      });

      it(`should return error when with invalid post when type ${type}`, async () => {
        const errors = await validator.updateStatePensionAwardAmountValidator({ amount: '0.001' }, type);
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.amount.text, i18next.t(`marital-update-award-amount:fields.amount.${type}.errors.invalid`));
      });

      it(`should return error when with to long post when type ${type}`, async () => {
        const errors = await validator.updateStatePensionAwardAmountValidator({ amount: '11111.00' }, type);
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.amount.text, i18next.t(`marital-update-award-amount:fields.amount.${type}.errors.length`));
      });

      if (type !== 'new-state-pension') {
        it(`should return no error when post is valid when type ${type}`, async () => {
          const errors = await validator.updateStatePensionAwardAmountValidator({ amount: '111.00' }, type);
          assert.equal(Object.keys(errors).length, 0);
        });
      }
    });

    it('should return error when post is more than max amount and type is new-state-pension', async () => {
      const errors = await validator.updateStatePensionAwardAmountValidator({ amount: '170.00' }, 'new-state-pension', apiValidationInvalidCallback);
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors.amount.text, 'New State Pension amount must be £160.00 or less');
    });

    it('should return no error when post is valid when type new-state-pension and api call is valid', async () => {
      const errors = await validator.updateStatePensionAwardAmountValidator({ amount: '150.00' }, 'new-state-pension', apiValidationValidCallback);
      assert.equal(Object.keys(errors).length, 0);
    });
  });
});
