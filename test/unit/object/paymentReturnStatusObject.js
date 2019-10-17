const assert = require('assert');

const object = require('../../../lib/objects/paymentReturnStatusObject');

const id = 123;
const inviteKey = 'TES12345678';

const detailsResult = {
  id,
  inviteKey,
  eventName: 'payment-detail:timeline.returned',
};

describe('payment status update object formatter', () => {
  it('should return valid json when object is called ', () => {
    assert.deepEqual(object.formatter(id, inviteKey), detailsResult);
  });
});
