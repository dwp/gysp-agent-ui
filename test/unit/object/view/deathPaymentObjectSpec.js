const { assert } = require('chai');
const deathPaymentObject = require('../../../../lib/objects/view/deathPaymentObject');

const validPaymentObject = {
  amount: 133.1,
  startDate: '2020-01-11T12:49:37.815Z',
  endDate: '2020-03-01T12:49:37.815Z',
};

const status = ['CANNOT_CALCULATE', 'ARREARS', 'OVERPAYMENT'];

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
    it('should return retryCalc object when section is retryCalc', () => {
      const formatted = deathPaymentObject.pageData('retryCalc', 'CANNOT_CALCULATE');
      assert.isObject(formatted);
      assert.equal(formatted.back, '/changes-and-enquiries/personal');
      assert.equal(formatted.button, '/changes-and-enquiries/personal/death/update');
    });
    it('should return verifiedDateOfDeathYes object when section is verifiedDateOfDeathYes', () => {
      const formatted = deathPaymentObject.pageData('verifiedDateOfDeathYes', 'CANNOT_CALCULATE');
      assert.isObject(formatted);
      assert.equal(formatted.back, '/changes-and-enquiries/personal/death/verify');
      assert.equal(formatted.button, '/changes-and-enquiries/personal/death/record');
    });
    it('should return reVerifiedDateOfDeath object when section is reVerifiedDateOfDeath', () => {
      const formatted = deathPaymentObject.pageData('reVerifiedDateOfDeath', 'CANNOT_CALCULATE');
      assert.isObject(formatted);
      assert.equal(formatted.back, '/changes-and-enquiries/personal/death/verified-date');
      assert.equal(formatted.button, '/changes-and-enquiries/personal/death/record');
    });
    it('should return default object when section is not matched and status is not matched', () => {
      const formatted = deathPaymentObject.pageData('test', 'TEST');
      assert.isObject(formatted);
      assert.equal(formatted.back, '/changes-and-enquiries/personal/death/address-select');
      assert.equal(formatted.button, '/changes-and-enquiries/personal/death/record');
    });
    status.forEach((st) => {
      it(`should return default back with check detail button when section is not matched but status is ${st}`, () => {
        const formatted = deathPaymentObject.pageData('test', st);
        assert.isObject(formatted);
        assert.equal(formatted.back, '/changes-and-enquiries/personal/death/address-select');
        assert.equal(formatted.button, '/changes-and-enquiries/personal/death/check-details');
      });
    });
  });
});