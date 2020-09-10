const { assert } = require('chai');

const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../config/i18next');

const paymentSummaryObject = require('../../../lib/objects/changeCircumstancesPaymentSummaryObject');

const paymentSummaryData = require('../../lib/paymentSummaryData');

const paymentSummaryViewDataFirstPaymentSent = {
  paymentTwo: {
    label: 'Next payment',
    creditDate: '19 April 2019',
    amount: '£101.83',
  },
};

const paymentSummaryViewDataFirstPaymentNotSent = {
  paymentOne: {
    label: 'First payment',
    creditDate: '11 April 2019',
    amount: '£203.57',
  },
  paymentTwo: {
    label: 'Next payment',
    creditDate: '19 April 2019',
    amount: '£101.83',
  },
};

const paymentSummaryViewDataFirstPaymentSentNextAmountNull = { };

describe('Payment summary object formatter', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

  it('should return false when object is null', (done) => {
    assert.isFalse(paymentSummaryObject.formatter(null));
    done();
  });

  it('should return valid object with paymentTwo and when details has first payment sent', (done) => {
    const json = paymentSummaryObject.formatter(paymentSummaryData.validFirstPaymentSent());
    assert.equal(JSON.stringify(json), JSON.stringify(paymentSummaryViewDataFirstPaymentSent));
    done();
  });

  it('should return valid object with paymentOne and paymentTwo when details has with first payment not sent and next payment', (done) => {
    const json = paymentSummaryObject.formatter(paymentSummaryData.validFirstPaymentNotSent());
    assert.equal(JSON.stringify(json), JSON.stringify(paymentSummaryViewDataFirstPaymentNotSent));
    done();
  });

  it('should return valid object without second payment when nextAmount is null', (done) => {
    const json = paymentSummaryObject.formatter(paymentSummaryData.validFirstAndNextPaymentNull());
    assert.equal(JSON.stringify(json), JSON.stringify(paymentSummaryViewDataFirstPaymentSentNextAmountNull));
    done();
  });
});
