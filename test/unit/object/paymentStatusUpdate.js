const assert = require('assert');

const object = require('../../../lib/objects/paymentStatusUpdate');

const id = 123;
const detailsWithPaidStatus = {
  status: 'PAID',
};

const detailsWithPaidStatusResult = {
  id,
  changeType: 'returned',
};

describe('payment status update object formatter', () => {
  it('should return valid json when object is called with PAID status', () => {
    assert.deepEqual(object.formatter(detailsWithPaidStatus, id), detailsWithPaidStatusResult);
  });
});
