const { assert } = require('chai');

const object = require('../../../../lib/objects/freqencyScheduleObject');

const frequency = '4W';
const nino = 'AA370773A';

const objectResponse = {
  paymentFrequency: frequency,
  nino,
  eventCategory: 'PAYMENT',
  eventType: 'CHANGE',
  eventName: 'payment:timeline.payment_frequency.changed',
};

describe('freqency object formatter', () => {
  it('should return valid json when object is called with unformatted object', () => {
    assert.deepEqual(object.formatter(frequency, nino), objectResponse);
  });
});
