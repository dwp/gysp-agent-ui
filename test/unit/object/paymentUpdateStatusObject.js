const assert = require('assert');

const object = require('../../../lib/objects/paymentUpdateStatusObject');

const id = 123;
const detailsWithPaidStatus = {
  status: 'PAID',
};

const detailsWithPaidStatusResult = {
  id,
  status: 'NOTPAID',
};

const detailsWithNotPaidStatus = {
  status: 'NOTPAID',
};

const detailsWithNotPaidStatusResult = {
  id,
  status: 'NOTPAID',
};

describe('payment status update object formatter', () => {
  it('should return valid json when object is called with PAID status', () => {
    assert.deepEqual(object.formatter(detailsWithPaidStatus, id), detailsWithPaidStatusResult);
  });

  it('should return valid json with current status when object is called with NOTPAID status', () => {
    assert.deepEqual(object.formatter(detailsWithNotPaidStatus, id), detailsWithNotPaidStatusResult);
  });
});
