const { assert } = require('chai');

const internationalAddressObject = require('../../../../../lib/objects/api/internationalAddressObject');

const internationalAddressObjectInput = {
  'address-line-1': '1675',
  'address-line-2': 'Benik Road',
  'address-line-3': 'La Habra Heights',
  'address-line-4': 'California',
  'address-line-5': '90631',
  country: 'USA:United States of America',
};

const internationalAddressObjectFormatted = {
  nino: 'AA111111A',
  eventCategory: 'CONTACT',
  eventType: 'CHANGE',
  eventName: 'address:timeline.address.changed',
  line1: '1675',
  line2: 'Benik Road',
  line3: 'La Habra Heights',
  line4: 'California',
  line5: '90631',
  countryCode: 'USA',
  country: 'United States of America',
};

describe('International address object formatter', () => {
  it('should return formatted international address object', () => {
    assert.deepEqual(internationalAddressObject.formatter('AA111111A', internationalAddressObjectInput), internationalAddressObjectFormatted);
  });
});
