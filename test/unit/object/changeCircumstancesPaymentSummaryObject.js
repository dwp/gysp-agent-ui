const { assert } = require('chai');

const paymentSummaryObject = require('../../../lib/objects/changeCircumstancesPaymentSummaryObject');

const paymentSummaryData = require('../../lib/paymentSummaryData');

const paymentSummaryViewDataFirstPaymentPaid = {
  paymentOne: {
    label: 'payment:payment_table.last_payment',
    creditDate: '11 April 2019',
    amount: '£203.57',
  },
  paymentTwo: {
    label: 'payment:payment_table.next_payment',
    creditDate: '19 April 2019',
    amount: '£101.83',
  },
};

const paymentSummaryViewDataFirstPaymentNotPaid = {
  paymentOne: {
    label: 'payment:payment_table.first_payment',
    creditDate: '11 April 2019',
    amount: '£203.57',
  },
  paymentTwo: {
    label: 'payment:payment_table.next_payment',
    creditDate: '19 April 2019',
    amount: '£101.83',
  },
};

const paymentSummaryViewDataFirstPaymentPaidNextAmountNull = {
  paymentOne: {
    label: 'payment:payment_table.last_payment',
    creditDate: '11 April 2019',
    amount: '£203.57',
  },
};

describe('Payment summary object formatter', () => {
  it('should return false when object is null', (done) => {
    assert.isFalse(paymentSummaryObject.formatter(null));
    done();
  });

  it('should return valid object when object has first payment paid', (done) => {
    const json = paymentSummaryObject.formatter(paymentSummaryData.validFirstPaymentPaid());
    assert.equal(JSON.stringify(json), JSON.stringify(paymentSummaryViewDataFirstPaymentPaid));
    done();
  });

  it('should return valid object when object is with first payment not paid', (done) => {
    const json = paymentSummaryObject.formatter(paymentSummaryData.validFirstPaymentNotPaid());
    assert.equal(JSON.stringify(json), JSON.stringify(paymentSummaryViewDataFirstPaymentNotPaid));
    done();
  });

  it('should return valid object without second payment when nextAmount is null', (done) => {
    const json = paymentSummaryObject.formatter(paymentSummaryData.validFirstPaymentPaidWithoutNextAmount());
    assert.equal(JSON.stringify(json), JSON.stringify(paymentSummaryViewDataFirstPaymentPaidNextAmountNull));
    done();
  });
});
