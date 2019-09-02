const { assert } = require('chai');

const object = require('../../../lib/objects/paymentHistoryDetailViewObject');

const detail = {
  status: 'SENT',
  accountName: 'Mr R H Smith',
  accountNumber: '98765432',
  sortCode: '400500',
};

const detailFormatted = {
  status: 'Sent',
  accountHolder: 'Mr R H Smith',
  accountNumber: '98765432',
  sortCode: '40 05 00',
};

describe('payment history detail object formatter', () => {
  it('should return false when detail is undefined', () => {
    assert.isFalse(object.formatter(undefined));
  });
  it('should return valid json when object is called with unformatted object', () => {
    assert.deepEqual(object.formatter(detail), detailFormatted);
  });
});
