const { assert } = require('chai');

const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');
const i18nextConfig = require('../../../../config/i18next');

const validator = require('../../../../lib/validation/nameChangeValidation');

describe('Validation: name change', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

  it('should return errors when firstName and lastName are undefined', () => {
    const errors = validator.nameChangeValidation({});
    assert.equal(Object.keys(errors).length, 2);
    assert.equal(errors.firstName.text, 'Enter a first name');
    assert.equal(errors.lastName.text, 'Enter a last name');
  });

  it('should return errors when firstName and lastName are empty', () => {
    const errors = validator.nameChangeValidation({ firstName: '', lastName: '' });
    assert.equal(Object.keys(errors).length, 2);
    assert.equal(errors.firstName.text, 'Enter a first name');
    assert.equal(errors.lastName.text, 'Enter a last name');
  });

  it('should return errors when firstName and lastName contain invalid characters', () => {
    const errors = validator.nameChangeValidation({ firstName: 'Rick!', lastName: 'Sanchez!' });
    assert.equal(Object.keys(errors).length, 2);
    assert.equal(errors.firstName.text, 'First name must start with a letter and only include letters a to z, hyphens, apostrophes, full stops, spaces and ampersands');
    assert.equal(errors.lastName.text, 'Last name must start with a letter and only include letters a to z, hyphens, apostrophes, full stops, spaces and ampersands');
  });

  it('should return errors when firstName and lastName are longer than 35 characters', () => {
    const errors = validator.nameChangeValidation({ firstName: 'RickRickRickRickRickRickRickRickRick', lastName: 'SanchezSanchezSanchezSanchezSanchezSanchez' });
    assert.equal(Object.keys(errors).length, 2);
    assert.equal(errors.firstName.text, 'First name must have 35 characters or less');
    assert.equal(errors.lastName.text, 'Last name must have 35 characters or less');
  });

  it('should return no errors when firstName and lastName are valid', () => {
    const errors = validator.nameChangeValidation({ firstName: 'Rick', lastName: 'Sanchez' });
    assert.equal(Object.keys(errors).length, 0);
  });
});
