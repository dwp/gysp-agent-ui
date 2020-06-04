const { assert } = require('chai');
const deathPaymentObject = require('../../../../lib/objects/view/deathPaymentObject');

const validPaymentObject = {
  amount: 133.1,
  startDate: '2020-01-11T12:49:37.815Z',
  endDate: '2020-03-01T12:49:37.815Z',
};

describe('deathPaymentObject ', () => {
  describe('formatter', () => {
    it('should return object correctly formatted', () => {
      const formatted = deathPaymentObject.formatter(validPaymentObject);
      assert.isObject(formatted);
      assert.equal(formatted.amount, '£133.10');
      assert.equal(formatted.startDate, '11 January 2020');
      assert.equal(formatted.endDate, '1 March 2020');
    });
  });
  describe('pageData', () => {
    it('should return default object when section is undefined and status is null', () => {
      const formatted = deathPaymentObject.pageData(undefined, null);
      assert.isObject(formatted);
      assert.equal(formatted.back, '/changes-and-enquiries/personal/death/address-select');
      assert.equal(formatted.button, '/changes-and-enquiries/personal/death/check-details');
    });
    [null, 'CANNOT_CALCULATE'].forEach((status) => {
      it(`should return object when section is verifiedDateOfDeathYes with ${status} status`, () => {
        const formatted = deathPaymentObject.pageData('verifiedDateOfDeathYes', status);
        assert.isObject(formatted);
        assert.equal(formatted.back, '/changes-and-enquiries/personal/death/verify');
        assert.equal(formatted.button, '/changes-and-enquiries/personal/death/record');
      });
      it(`should return object when section is reVerifiedDateOfDeath with ${status} status`, () => {
        const formatted = deathPaymentObject.pageData('reVerifiedDateOfDeath', status);
        assert.isObject(formatted);
        assert.equal(formatted.back, '/changes-and-enquiries/personal/death/verified-date');
        assert.equal(formatted.button, '/changes-and-enquiries/personal/death/record');
      });
      it(`should return object when section is retryCalc with ${status} status`, () => {
        const formatted = deathPaymentObject.pageData('retryCalc', status);
        assert.isObject(formatted);
        assert.equal(formatted.back, '/changes-and-enquiries/personal');
        assert.equal(formatted.button, '/changes-and-enquiries/personal/death/update');
      });
    });

    ['ARREARS', 'OVERPAYMENT', 'NOTHING_OWED'].forEach((status) => {
      it(`should return object when section is verifiedDateOfDeathYes with ${status} status`, () => {
        const formatted = deathPaymentObject.pageData('verifiedDateOfDeathYes', status);
        assert.isObject(formatted);
        assert.equal(formatted.back, '/changes-and-enquiries/personal/death/verify');
        assert.equal(formatted.button, '/changes-and-enquiries/personal/death/review-payee');
      });
      it(`should return object when section is reVerifiedDateOfDeath with ${status} status`, () => {
        const formatted = deathPaymentObject.pageData('reVerifiedDateOfDeath', status);
        assert.isObject(formatted);
        assert.equal(formatted.back, '/changes-and-enquiries/personal/death/verified-date');
        assert.equal(formatted.button, '/changes-and-enquiries/personal/death/review-payee');
      });
      it(`should return object when section is retryCalc with ${status} status`, () => {
        const formatted = deathPaymentObject.pageData('retryCalc', status);
        assert.isObject(formatted);
        assert.equal(formatted.back, '/changes-and-enquiries/personal');
        assert.equal(formatted.button, '/changes-and-enquiries/personal/death/review-payee');
      });
    });
  });
});
