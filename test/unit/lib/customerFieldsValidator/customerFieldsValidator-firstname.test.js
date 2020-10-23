const assert = require('assert');

const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../../config/i18next');

const validator = require('../../../../lib/customerFieldsValidator');
const customerData = require('../../../lib/customerData');

const testDataField = customerData.fieldData();

describe('Form validation firstName', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

  it('Should return error if field is empty', () => {
    const error = validator.isValidFirstName(testDataField.empty);
    assert.equal(error, 'First name is required');
  });

  it('Should return error if field is more then 70 character', () => {
    const error = validator.isValidFirstName(testDataField.seventyFourCharacters);
    assert.equal(error, 'First name must be seventy characters or less');
  });

  it('Should return error if field starts with lower case', () => {
    const error = validator.isValidFirstName(testDataField.invalidStart);
    assert.equal(error, 'First name must start with A-Z');
  });

  it('Should return error if field contains any non bad character (@)', () => {
    const error = validator.isValidFirstName(testDataField.invalidCharacter);
    assert.equal(error, "First name must only contain A-z, ' and .");
  });
});
