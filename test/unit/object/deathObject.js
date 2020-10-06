const assert = require('assert');
const claimData = require('../../lib/claimData');
const addressData = require('../../lib/addressData');

const object = require('../../../lib/objects/deathObject');

const detailsUprn = { address: '10091853817' };

const dapDetails = {
  'dap-name': { name: 'Margaret Meldrew' },
  'dap-phone-number': { phoneNumber: '0000 000 000' },
  'dap-address': detailsUprn,
  'address-lookup': addressData.multipleAddressesNoneEmpty(),
};

const verifiedDetails = {
  ...dapDetails,
  'date-of-death': {
    dateYear: '2019',
    dateMonth: '01',
    dateDay: '01',
    verification: 'V',
  },
};

const notVerifiedDetails = {
  ...dapDetails,
  'date-of-death': {
    dateYear: '2019',
    dateMonth: '01',
    dateDay: '01',
    verification: 'NV',
  },
};

const noDapdetails = {
  'date-of-death': {
    dateYear: '2019',
    dateMonth: '01',
    dateDay: '01',
    verification: 'V',
  },
};

const verifiedDetailsWithoutDateOfDeath = {
  ...dapDetails,
};

const deathPayment = {
  startDate: null,
  endDate: null,
  amount: null,
};

const verifiedResponse = {
  dateOfDeath: '2019-01-01T00:00:00.000Z',
  dateOfDeathVerification: 'V',
  nino: 'AA370773A',
  amountDetails: deathPayment,
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
      singleLine: '148 PICCADILLY, LONDON, W1J 7NT',
      uprn: 10091853817,
    },
    fullName: 'Margaret Meldrew',
    phoneNumber: '0000 000 000',
  },
};

const notVerifiedResponse = {
  dateOfDeath: '2019-01-01T00:00:00.000Z',
  dateOfDeathVerification: 'NV',
  nino: 'AA370773A',
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
      singleLine: '148 PICCADILLY, LONDON, W1J 7NT',
      uprn: 10091853817,
    },
    fullName: 'Margaret Meldrew',
    phoneNumber: '0000 000 000',
  },
};

const noDapDetailsResponse = {
  dateOfDeath: '2019-01-01T00:00:00.000Z',
  dateOfDeathVerification: 'V',
  nino: 'AA370773A',
  amountDetails: deathPayment,
};

describe('deathObject object', () => {
  describe('formatter', () => {
    it('should return valid json object when with verified data when verification is set to V', (done) => {
      const json = object.formatter(verifiedDetails, deathPayment, claimData.validClaim());
      assert.deepEqual(json, verifiedResponse);
      done();
    });

    it('should return valid json object when with verified data when there is no verification in details', (done) => {
      const json = object.formatter(verifiedDetailsWithoutDateOfDeath, deathPayment, claimData.validClaimWithDeathVerified());
      assert.deepEqual(json, verifiedResponse);
      done();
    });

    it('should return valid json object when with verified data when verification is set to NV', (done) => {
      const json = object.formatter(notVerifiedDetails, deathPayment, claimData.validClaim());
      assert.deepEqual(json, notVerifiedResponse);
      done();
    });

    it('should return valid json object with no deathPayeeDetails when dap not in details object', (done) => {
      const json = object.formatter(noDapdetails, deathPayment, claimData.validClaim());
      assert.deepEqual(json, noDapDetailsResponse);
      done();
    });
  });
});
