const { assert } = require('chai');

const object = require('../../../lib/objects/deferralObject');
const dateHelper = require('../../../lib/dateHelper');

const fromDate = Date.now();

const deferralRequestDate = dateHelper.timestampToDateDash(fromDate);

const nino = 'AA123456A';

const objectResponse = {
  deferralRequestDate: `${deferralRequestDate}T00:00:00.000Z`,
  eventCategory: 'PERSONAL',
  eventType: 'CHANGE',
  eventName: 'personal:timeline.state-pension-deferred',
  nino,
};

describe('deferral object formatter', () => {
  it('should return valid json when object is called with unformatted object', () => {
    assert.deepEqual(object.formatter(nino, fromDate), objectResponse);
  });
});
