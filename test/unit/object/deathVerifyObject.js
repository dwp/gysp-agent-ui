const assert = require('assert');

const object = require('../../../lib/objects/deathVerifyObject');

const awardDetails = {
  dateOfDeath: '2000-01-01T00:00:00.000Z',
  nino: 'AA370773A',
};
const formatterResponse = {
  dateOfDeath: '2000-01-01T00:00:00.000Z',
  dateOfDeathVerification: 'V',
  nino: 'AA370773A',
  eventCategory: 'PERSONAL',
  eventType: 'CHANGE',
  eventName: 'personal:timeline.date_of_death.verified',
};

describe('deathVerify object', () => {
  describe('formatter', () => {
    it('should return valid json object when with data is provided', (done) => {
      const json = object.formatter(awardDetails);
      assert.equal(JSON.stringify(json), JSON.stringify(formatterResponse));
      done();
    });
  });
});
