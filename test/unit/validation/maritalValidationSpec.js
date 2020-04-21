const { assert } = require('chai');
const validator = require('../../../lib/validation/maritalValidation');

const emptyPostRequest = {};
const validPostRequest = { firstName: 'Joe', lastName: 'Bloggs' };

describe('partnerValidator validator', () => {
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
