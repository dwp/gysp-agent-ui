const assert = require('assert');
const claimData = require('../../lib/claimData');

const object = require('../../../lib/objects/deathObject');

const verifiedDetails = {
  dateYear: '2000',
  dateMonth: '01',
  dateDay: '01',
  verification: 'V',
};
const verifiedResponse = {
  dateOfDeath: '2000-01-01T00:00:00.000Z',
  dateOfDeathVerification: 'V',
  nino: 'AA370773A',
  eventCategory: 'PERSONAL',
  eventType: 'ADD',
  eventName: 'personal:timeline.date_of_death.verified',
};

const notVerifiedDetails = {
  dateYear: '2000',
  dateMonth: '01',
  dateDay: '01',
  verification: 'NV',
};
const notVerifiedResponse = {
  dateOfDeath: '2000-01-01T00:00:00.000Z',
  dateOfDeathVerification: 'NV',
  nino: 'AA370773A',
  eventCategory: 'PERSONAL',
  eventType: 'ADD',
  eventName: 'personal:timeline.date_of_death.not_verified',
};

describe('deathObject object', () => {
  describe('formatter', () => {
    it('should return valid json object when with verifed data when verification is set to V', (done) => {
      const json = object.formatter(verifiedDetails, claimData.validClaim());
      assert.equal(JSON.stringify(json), JSON.stringify(verifiedResponse));
      done();
    });

    it('should return valid json object when with verifed data when verification is set to NV', (done) => {
      const json = object.formatter(notVerifiedDetails, claimData.validClaim());
      assert.equal(JSON.stringify(json), JSON.stringify(notVerifiedResponse));
      done();
    });
  });
});
