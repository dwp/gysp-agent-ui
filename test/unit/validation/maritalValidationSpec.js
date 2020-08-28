const { assert } = require('chai');
const validator = require('../../../lib/validation/maritalValidation');

const emptyPostRequest = {};
const validPostRequest = { firstName: 'Joe', lastName: 'Bloggs' };

const maritalStatus = ['married', 'civil', 'divorced', 'widowed', 'dissolved'];

describe('marital validator', () => {
  describe('partnerValidator', () => {
    it('should return errors when with empty spouse post', () => {
      const errors = validator.partnerValidator(emptyPostRequest, 'married');
      assert.equal(Object.keys(errors).length, 2);
      assert.equal(errors.firstName.text, 'marital-partner:fields.first-name.errors.required.married');
      assert.equal(errors.lastName.text, 'marital-partner:fields.last-name.errors.required.married');
    });
    it('should return errors when with empty partner post', () => {
      const errors = validator.partnerValidator(emptyPostRequest, 'civil');
      assert.equal(Object.keys(errors).length, 2);
      assert.equal(errors.firstName.text, 'marital-partner:fields.first-name.errors.required.civil');
      assert.equal(errors.lastName.text, 'marital-partner:fields.last-name.errors.required.civil');
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
        assert.equal(errors.partnerNino.text, 'marital-partner:fields.nino.errors.invalid');
      });
      it('should return error when partnerNino length is 7', () => {
        const errors = validator.partnerValidator({ ...validPostRequest, partnerNino: 'AA12345' });
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.partnerNino.text, 'marital-partner:fields.nino.errors.length');
      });
      it('should return error when partnerNino length is 10', () => {
        const errors = validator.partnerValidator({ ...validPostRequest, partnerNino: 'AA12345678' });
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.partnerNino.text, 'marital-partner:fields.nino.errors.length');
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
        assert.equal(errors.firstName.text, 'marital-partner:fields.first-name.errors.required.married');
      });
      it('should return error when partner firstName is undefined', () => {
        const errors = validator.partnerValidator({ lastName: 'Bloggs' }, 'civil');
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.firstName.text, 'marital-partner:fields.first-name.errors.required.civil');
      });
      it('should return error when spouse firstName is empty', () => {
        const errors = validator.partnerValidator({ ...validPostRequest, firstName: '' }, 'married');
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.firstName.text, 'marital-partner:fields.first-name.errors.required.married');
      });
      it('should return error when partner firstName is empty', () => {
        const errors = validator.partnerValidator({ ...validPostRequest, firstName: '' }, 'civil');
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.firstName.text, 'marital-partner:fields.first-name.errors.required.civil');
      });
      it('should return error when firstName is invalid', () => {
        const errors = validator.partnerValidator({ ...validPostRequest, firstName: '123' });
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.firstName.text, 'marital-partner:fields.first-name.errors.invalid');
      });
      it('should return error when firstName greater than 35', () => {
        const errors = validator.partnerValidator({ ...validPostRequest, firstName: 'qwertyuiopasdfghjklzxcvbnmqwertyuiop' });
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.firstName.text, 'marital-partner:fields.first-name.errors.length');
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
        assert.equal(errors.lastName.text, 'marital-partner:fields.last-name.errors.required.married');
      });
      it('should return error when partner lastName is undefined', () => {
        const errors = validator.partnerValidator({ firstName: 'Joe' }, 'civil');
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.lastName.text, 'marital-partner:fields.last-name.errors.required.civil');
      });
      it('should return error when spouse lastName is empty', () => {
        const errors = validator.partnerValidator({ ...validPostRequest, lastName: '' }, 'married');
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.lastName.text, 'marital-partner:fields.last-name.errors.required.married');
      });
      it('should return error when partner lastName is empty', () => {
        const errors = validator.partnerValidator({ ...validPostRequest, lastName: '' }, 'civil');
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.lastName.text, 'marital-partner:fields.last-name.errors.required.civil');
      });
      it('should return error when lastName is invalid', () => {
        const errors = validator.partnerValidator({ ...validPostRequest, lastName: '123' });
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.lastName.text, 'marital-partner:fields.last-name.errors.invalid');
      });
      it('should return error when lastName greater than 35', () => {
        const errors = validator.partnerValidator({ ...validPostRequest, lastName: 'qwertyuiopasdfghjklzxcvbnmqwertyuiop' });
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.lastName.text, 'marital-partner:fields.last-name.errors.length');
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
        assert.equal(errors.otherName.text, 'marital-partner:fields.other-name.errors.invalid');
      });
      it('should return error when otherName greater than 35', () => {
        const errors = validator.partnerValidator({ ...validPostRequest, otherName: 'qwertyuiopasdfghjklzxcvbnmqwertyuiop' });
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.otherName.text, 'marital-partner:fields.other-name.errors.length');
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
        assert.equal(errors.dob.text, 'marital-partner:fields.dob.errors.invalid');
      });
      it('should return error when dobDay is invalid', () => {
        const errors = validator.partnerValidator({
          ...validPostRequest, dobDay: '40', dobMonth: '01', dobYear: '2000',
        });
        assert.equal(Object.keys(errors).length, 2);
        assert.isTrue(errors.dobDay);
        assert.equal(errors.dob.text, 'marital-partner:fields.dob.errors.invalid');
      });
      it('should return error when dobMonth is empty', () => {
        const errors = validator.partnerValidator({
          ...validPostRequest, dobDay: '01', dobMonth: '', dobYear: '2000',
        });
        assert.equal(Object.keys(errors).length, 2);
        assert.isTrue(errors.dobMonth);
        assert.equal(errors.dob.text, 'marital-partner:fields.dob.errors.invalid');
      });
      it('should return error when dobMonth is invalid', () => {
        const errors = validator.partnerValidator({
          ...validPostRequest, dobDay: '01', dobMonth: '13', dobYear: '2000',
        });
        assert.equal(Object.keys(errors).length, 2);
        assert.isTrue(errors.dobMonth);
        assert.equal(errors.dob.text, 'marital-partner:fields.dob.errors.invalid');
      });
      it('should return error when dobYear is empty', () => {
        const errors = validator.partnerValidator({
          ...validPostRequest, dobDay: '01', dobMonth: '01', dobYear: '',
        });
        assert.equal(Object.keys(errors).length, 2);
        assert.isTrue(errors.dobYear);
        assert.equal(errors.dob.text, 'marital-partner:fields.dob.errors.invalid');
      });
      it('should return error when dobYear is invalid', () => {
        const errors = validator.partnerValidator({
          ...validPostRequest, dobDay: '01', dobMonth: '01', dobYear: '20',
        });
        assert.equal(Object.keys(errors).length, 2);
        assert.isTrue(errors.dobYear);
        assert.equal(errors.dob.text, 'marital-partner:fields.dob.errors.invalid');
      });
      it('should return error when dob is in the future', () => {
        const errors = validator.partnerValidator({
          ...validPostRequest, dobDay: '01', dobMonth: '01', dobYear: '4000',
        });
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.dob.text, 'marital-partner:fields.dob.errors.future');
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
          dobYear: '2019', dobMonth: '01', dobDay: '01',
        });
        assert.equal(Object.keys(errors).length, 0);
      });

      it(`should return all errors when empty - ${status} status`, () => {
        const errors = validator.partnerDobValidator({ }, status);
        assert.equal(Object.keys(errors).length, 4);
      });

      it(`should return all errors when blank - ${status}`, () => {
        const errors = validator.partnerDobValidator({
          dobYear: '', dobMonth: '', dobDay: '',
        }, status);
        assert.equal(Object.keys(errors).length, 4);
      });

      it(`should return error when date in the future - ${status}`, () => {
        const errors = validator.partnerDobValidator({
          dobYear: '2099', dobMonth: '01', dobDay: '01',
        }, status);
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.dob.text, `marital-detail:${status}.fields.dob.errors.future`);
      });

      it(`should return error when year is invalid - ${status}`, () => {
        const errors = validator.partnerDobValidator({
          dobYear: '20', dobMonth: '01', dobDay: '01',
        }, status);
        assert.equal(Object.keys(errors).length, 2);
        assert.equal(errors.dob.text, `marital-detail:${status}.fields.dob.errors.format`);
      });

      it(`should return error when month is invalid - ${status}`, () => {
        const errors = validator.partnerDobValidator({
          dobYear: '2018', dobMonth: '20', dobDay: '01',
        }, status);
        assert.equal(Object.keys(errors).length, 2);
        assert.equal(errors.dob.text, `marital-detail:${status}.fields.dob.errors.format`);
      });

      it(`should return error when day is invalid - ${status}`, () => {
        const errors = validator.partnerDobValidator({
          dobYear: '2018', dobMonth: '01', dobDay: '40',
        }, status);
        assert.equal(Object.keys(errors).length, 2);
        assert.equal(errors.dob.text, `marital-detail:${status}.fields.dob.errors.format`);
      });
    });
  });
  describe('checkForInheritableStatePensionValidator', () => {
    it('should return errors when with empty post', () => {
      const errors = validator.checkForInheritableStatePensionValidator(emptyPostRequest);
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors.checkInheritableStatePension.text, 'marital-check-for-inheritable-state-pension:fields.checkInheritableStatePension.errors.required');
    });
    it('should return errors when with blank post', () => {
      const errors = validator.checkForInheritableStatePensionValidator({ checkInheritableStatePension: '' });
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors.checkInheritableStatePension.text, 'marital-check-for-inheritable-state-pension:fields.checkInheritableStatePension.errors.required');
    });
    it('should return errors when with invalid post', () => {
      const errors = validator.checkForInheritableStatePensionValidator({ checkInheritableStatePension: 'bob' });
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors.checkInheritableStatePension.text, 'marital-check-for-inheritable-state-pension:fields.checkInheritableStatePension.errors.required');
    });
  });
  describe('entitledToInheritedStatePensionValidator', () => {
    it('should return errors when with empty post', () => {
      const errors = validator.entitledToInheritedStatePensionValidator(emptyPostRequest);
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors.entitledInheritableStatePension.text, 'marital-entitled-to-inherited-state-pension:fields.entitledInheritableStatePension.errors.required');
    });
    it('should return errors when with blank post', () => {
      const errors = validator.entitledToInheritedStatePensionValidator({ entitledInheritableStatePension: '' });
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors.entitledInheritableStatePension.text, 'marital-entitled-to-inherited-state-pension:fields.entitledInheritableStatePension.errors.required');
    });
    it('should return errors when with invalid post', () => {
      const errors = validator.entitledToInheritedStatePensionValidator({ entitledInheritableStatePension: 'bob' });
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors.entitledInheritableStatePension.text, 'marital-entitled-to-inherited-state-pension:fields.entitledInheritableStatePension.errors.required');
    });
  });

  describe('relevantInheritedAmountsValidator', () => {
    it('should return error when with empty post', () => {
      const errors = validator.relevantInheritedAmountsValidator(emptyPostRequest);
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors.inputs.text, 'marital-relevant-inherited-amounts:fields.inputs.errors.required');
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
      assert.equal(errors.inputs.text, 'marital-relevant-inherited-amounts:fields.inputs.errors.required');
    });
    describe('field: additionalPension', () => {
      it('should fail validation when value is invalid', () => {
        const errors = validator.relevantInheritedAmountsValidator({ additionalPension: 'bob' });
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.additionalPension.text, 'marital-relevant-inherited-amounts:fields.additionalPension.errors.format');
      });

      it('should fail validation when value is to long', () => {
        const errors = validator.relevantInheritedAmountsValidator({ additionalPension: '1000.00' });
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.additionalPension.text, 'marital-relevant-inherited-amounts:fields.additionalPension.errors.length');
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
        assert.equal(errors.graduatedBenefit.text, 'marital-relevant-inherited-amounts:fields.graduatedBenefit.errors.format');
      });

      it('should fail validation when value is to long', () => {
        const errors = validator.relevantInheritedAmountsValidator({ graduatedBenefit: '1000.00' });
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.graduatedBenefit.text, 'marital-relevant-inherited-amounts:fields.graduatedBenefit.errors.length');
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
        assert.equal(errors.basicExtraStatePension.text, 'marital-relevant-inherited-amounts:fields.basicExtraStatePension.errors.format');
      });

      it('should fail validation when value is to long', () => {
        const errors = validator.relevantInheritedAmountsValidator({ basicExtraStatePension: '1000.00' });
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.basicExtraStatePension.text, 'marital-relevant-inherited-amounts:fields.basicExtraStatePension.errors.length');
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
        assert.equal(errors.additionalExtraStatePension.text, 'marital-relevant-inherited-amounts:fields.additionalExtraStatePension.errors.format');
      });

      it('should fail validation when value is to long', () => {
        const errors = validator.relevantInheritedAmountsValidator({ additionalExtraStatePension: '1000.00' });
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.additionalExtraStatePension.text, 'marital-relevant-inherited-amounts:fields.additionalExtraStatePension.errors.length');
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
        assert.equal(errors.graduatedBenefitExtraStatePension.text, 'marital-relevant-inherited-amounts:fields.graduatedBenefitExtraStatePension.errors.format');
      });

      it('should fail validation when value is to long', () => {
        const errors = validator.relevantInheritedAmountsValidator({ graduatedBenefitExtraStatePension: '1000.00' });
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.graduatedBenefitExtraStatePension.text, 'marital-relevant-inherited-amounts:fields.graduatedBenefitExtraStatePension.errors.length');
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
        assert.equal(errors.protectedPayment.text, 'marital-relevant-inherited-amounts:fields.protectedPayment.errors.format');
      });

      it('should fail validation when value is to long', () => {
        const errors = validator.relevantInheritedAmountsValidator({ protectedPayment: '1000.00' });
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.protectedPayment.text, 'marital-relevant-inherited-amounts:fields.protectedPayment.errors.length');
      });

      it('should pass validation when value is valid', () => {
        const errors = validator.relevantInheritedAmountsValidator({ protectedPayment: '100.00' });
        assert.equal(Object.keys(errors).length, 0);
      });
    });
  });
});
