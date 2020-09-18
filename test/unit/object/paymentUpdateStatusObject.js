const assert = require('assert');

const object = require('../../../lib/objects/paymentUpdateStatusObject');

const id = 123;
const inviteKey = 'KEY';
const [SENT, RECALLING, RECALLED, PAID] = ['SENT', 'RECALLING', 'RECALLED', 'PAID'];

const detailsStatusRecalling = {
  id, status: RECALLING, inviteKey, eventName: 'payment-detail:timeline.recalling',
};
const detailsStatusRecalled = {
  id, status: RECALLED, inviteKey, eventName: 'payment-detail:timeline.recalled-successful',
};
const detailsStatusPaid = {
  id, status: PAID, inviteKey, eventName: 'payment-detail:timeline.recalled-unsuccessful',
};

describe('payment status update object formatter', () => {
  it('should return valid recalling json when object is called with SENT status and yes update', () => {
    assert.deepEqual(object.formatter(id, SENT, 'yes', inviteKey), detailsStatusRecalling);
  });

  it('should return valid recalled json when object is called with RECALLING status and yes update', () => {
    assert.deepEqual(object.formatter(id, RECALLING, 'yes', inviteKey), detailsStatusRecalled);
  });

  it('should return valid paid json when object is called with RECALLING status and no update', () => {
    assert.deepEqual(object.formatter(id, RECALLING, 'no', inviteKey), detailsStatusPaid);
  });

  it('should return valid json when object does not match with any condition', () => {
    assert.deepEqual(object.formatter(id, RECALLED, 'yes', inviteKey), detailsStatusRecalled);
  });
});
