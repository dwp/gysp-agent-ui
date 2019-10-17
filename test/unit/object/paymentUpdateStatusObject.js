const assert = require('assert');

const object = require('../../../lib/objects/paymentUpdateStatusObject');

const id = 123;
const sentStatus = 'SENT';

const detailsWithSentStatusResult = {
  id,
  status: 'RECALLING',
};

describe('payment status update object formatter', () => {
  it('should return valid json when object is called with SENT status', () => {
    assert.deepEqual(object.formatter(id, sentStatus), detailsWithSentStatusResult);
  });
});
