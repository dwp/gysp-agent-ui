const assert = require('assert');

const object = require('../../../lib/objects/paymentUpdateStatusObject');

const id = 123;
const [SENT, RECALLING, RECALLED, PAID] = ['SENT', 'RECALLING', 'RECALLED', 'PAID'];

const detailsStatusRecalling = { id, status: RECALLING };
const detailsStatusRecalled = { id, status: RECALLED };
const detailsStatusPaid = { id, status: PAID };

describe('payment status update object formatter', () => {
  it('should return valid recalling json when object is called with SENT status and yes update', () => {
    assert.deepEqual(object.formatter(id, SENT, 'yes'), detailsStatusRecalling);
  });
  it('should return valid recalled json when object is called with RECALLING status and yes update', () => {
    assert.deepEqual(object.formatter(id, RECALLING, 'yes'), detailsStatusRecalled);
  });
  it('should return valid paid json when object is called with RECALLING status and no update', () => {
    assert.deepEqual(object.formatter(id, RECALLING, 'no'), detailsStatusPaid);
  });
  it('should return valid json when object does not match with any condition', () => {
    assert.deepEqual(object.formatter(id, RECALLED, 'yes'), detailsStatusRecalled);
  });
});
