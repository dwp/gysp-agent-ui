const assert = require('assert');
const claimData = require('../../lib/claimData');
const addressData = require('../../lib/addressData');

const object = require('../../../lib/objects/deathObject');

const detailsUprn = { address: '10091853817' };

const verifiedDetails = {
  'date-of-death': {
    dateYear: '2000',
    dateMonth: '01',
    dateDay: '01',
    verification: 'V',
  },
  'death-payment': {
    startDate: null,
    endDate: null,
    amount: null,
  },
  'dap-name': {
    name: 'Margaret Meldrew',
  },
  'dap-phone-number': {
    phoneNumber: '0000 000 000',
  },
  'dap-address': detailsUprn,
  'address-lookup': addressData.multipleAddressesNoneEmpty(),
};
const verifiedResponse = {
  dateOfDeath: '2000-01-01T00:00:00.000Z',
  dateOfDeathVerification: 'V',
  nino: 'AA370773A',
  amountDetails: verifiedDetails['death-payment'],
  eventCategory: 'PERSONAL',
  eventType: 'ADD',
  eventName: 'personal:timeline.date_of_death.verified',
  deathPayeeDetails: {
    address: {
      buildingName: 'buildingName',
      subBuildingName: 'subBuildingName',
      buildingNumber: 148,
      dependentLocality: 'dependentLocality',
      thoroughfareName: 'PICCADILLY',
      dependentThoroughfareName: 'dependentThoroughfareName',
      postTown: 'LONDON',
      postCode: 'W1J 7NT',
      uprn: 10091853817,
    },
    fullName: 'Margaret Meldrew',
    phoneNumber: '0000 000 000',
  },
};

const notVerifiedDetails = {
  'date-of-death': {
    dateYear: '2000',
    dateMonth: '01',
    dateDay: '01',
    verification: 'NV',
  },
  'death-payment': {
    startDate: null,
    endDate: null,
    amount: null,
  },
  'dap-name': {
    name: 'Margaret Meldrew',
  },
  'dap-phone-number': {
    phoneNumber: '0000 000 000',
  },
  'dap-address': detailsUprn,
  'address-lookup': addressData.multipleAddressesNoneEmpty(),
};
const notVerifiedResponse = {
  dateOfDeath: '2000-01-01T00:00:00.000Z',
  dateOfDeathVerification: 'NV',
  nino: 'AA370773A',
  eventCategory: 'PERSONAL',
  eventType: 'ADD',
  eventName: 'personal:timeline.date_of_death.not_verified',
  deathPayeeDetails: {
    address: {
      buildingName: 'buildingName',
      subBuildingName: 'subBuildingName',
      buildingNumber: 148,
      dependentLocality: 'dependentLocality',
      thoroughfareName: 'PICCADILLY',
      dependentThoroughfareName: 'dependentThoroughfareName',
      postTown: 'LONDON',
      postCode: 'W1J 7NT',
      uprn: 10091853817,
    },
    fullName: 'Margaret Meldrew',
    phoneNumber: '0000 000 000',
  },
};

describe('deathObject object', () => {
  describe('formatter', () => {
    it('should return valid json object when with verifed data when verification is set to V', (done) => {
      const json = object.formatter(verifiedDetails, claimData.validClaim());
      assert.deepEqual(json, verifiedResponse);
      done();
    });

    it('should return valid json object when with verifed data when verification is set to NV', (done) => {
      const json = object.formatter(notVerifiedDetails, claimData.validClaim());
      assert.deepEqual(json, notVerifiedResponse);
      done();
    });
  });
});
