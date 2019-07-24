const assert = require('assert');
const claimData = require('../../lib/claimData');

const object = require('../../../lib/objects/deathVerifiedObject');

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
  eventType: 'CHANGE',
  eventName: 'personal:timeline.date_of_death.verified',
};

describe('deathVerified object', () => {
  describe('formatter', () => {
    it('should return valid json object when with data is provided', (done) => {
      const json = object.formatter(verifiedDetails, claimData.validClaim());
      assert.equal(JSON.stringify(json), JSON.stringify(verifiedResponse));
      done();
    });
  });
});
