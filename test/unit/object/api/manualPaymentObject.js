const { assert } = require('chai');

const manualPaymentObject = require('../../../../lib/objects/api/manualPaymentObject');

const formattedObject = {
  foo: 'bar',
  eventCategory: 'PAYMENT',
  eventName: 'payment:timeline.manual_payment.added',
  eventType: 'ADD',
};

describe('Manual Payment Object Formatter', () => {
  it('should return formatted json object when called with unformatted object', () => {
    assert.deepEqual(manualPaymentObject.formatter({ foo: 'bar' }), formattedObject);
  });
});
