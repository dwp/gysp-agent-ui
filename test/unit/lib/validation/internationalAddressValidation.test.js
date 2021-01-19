const { assert } = require('chai');

const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');
const i18nextConfig = require('../../../../config/i18next');

const validator = require('../../../../lib/validation/internationalAddressValidation');

const empty = {
  'address-line-1': '',
  'address-line-2': '',
  country: '',
};

const tooLong = {
  'address-line-1': 'qwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnm',
  'address-line-2': 'qwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnm',
  'address-line-3': 'qwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnm',
  'address-line-4': 'qwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnm',
  'address-line-5': 'qwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnm',
  country: 'United States of America',
};

const valid = {
  'address-line-1': '1675',
  'address-line-2': 'Benik Road',
  'address-line-3': 'La Habra Heights',
  'address-line-4': 'California',
  'address-line-5': '90631',
  country: 'United States of America',
};

describe('Validation: international address', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

  it('should return errors when fields are undefined', () => {
    const errors = validator.internationalAddressValidation({});
    assert.equal(Object.keys(errors).length, 3);
    assert.equal(errors['address-line-1'].text, 'Enter the first line of the address');
    assert.equal(errors['address-line-2'].text, 'Enter the second line of the address');
    assert.equal(errors.country.text, 'Enter a country name');
  });

  it('should return errors when fields are empty', () => {
    const errors = validator.internationalAddressValidation(empty);
    assert.equal(Object.keys(errors).length, 3);
    assert.equal(errors['address-line-1'].text, 'Enter the first line of the address');
    assert.equal(errors['address-line-2'].text, 'Enter the second line of the address');
    assert.equal(errors.country.text, 'Enter a country name');
  });

  it('should return errors when field values are too long', () => {
    const errors = validator.internationalAddressValidation(tooLong);
    assert.equal(Object.keys(errors).length, 5);
    assert.equal(errors['address-line-1'].text, 'Address line 1 must be 35 characters or less');
    assert.equal(errors['address-line-2'].text, 'Address line 2 must be 35 characters or less');
    assert.equal(errors['address-line-3'].text, 'Address line 3 must be 35 characters or less');
    assert.equal(errors['address-line-4'].text, 'Address line 4 must be 35 characters or less');
    assert.equal(errors['address-line-5'].text, 'Address line 5 must be 35 characters or less');
  });

  it('should return no errors when field values are valid', () => {
    const errors = validator.internationalAddressValidation(valid);
    assert.equal(Object.keys(errors).length, 0);
  });
});
