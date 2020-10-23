const assert = require('assert');

const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../../config/i18next');

const validator = require('../../../../lib/customerFieldsValidator');
const customerData = require('../../../lib/customerData');

const testDataField = customerData.fieldData();

describe('Form validation surname', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

  it('Should return error if field is empty', () => {
    const error = validator.isValidSurname(testDataField.empty);
    assert.equal(error, 'Surname is required');
  });

  it('Should return error if field is one character', () => {
    const error = validator.isValidSurname(testDataField.oneCharacter);
    assert.equal(error, 'Surname must be at least two characters');
  });

  it('Should return error if field is more then 70 character', () => {
    const error = validator.isValidSurname(testDataField.seventyFourCharacters);
    assert.equal(error, 'Surname must be seventy characters or less');
  });

  it('Should return error if field has none A-z start character', () => {
    const error = validator.isValidSurname(testDataField.invalidStart);
    assert.equal(error, 'Surname must start with A-Z');
  });

  it('Should return error if field contains any non bad character (@)', () => {
    const error = validator.isValidSurname(testDataField.invalidCharacter);
    assert.equal(error, "Surname must only contain A-z, ' and .");
  });
});
