const { assert } = require('chai');

const maritalUpdateStatePensionAwardObject = require('../../../../lib/objects/view/maritalUpdateStatePensionAwardObject');

const awardDataInpayment = [{
  inPayment: false,
  totalAmount: 1000.0,
  weeklyStatePensionAmount: 100.0,
  weeklyProtectedPaymentAmount: 200.0,
  weeklyExtraStatePensionAmount: 300.0,
  weeklyInheritedExtraStatePensionAmount: 400.0,
  entitlementDate: '2018-11-09T12:27:48.795Z',
}, {
  inPayment: true,
  totalAmount: 1000.0,
  weeklyStatePensionAmount: 100.0,
  weeklyProtectedPaymentAmount: 200.0,
  weeklyExtraStatePensionAmount: 300.0,
  weeklyInheritedExtraStatePensionAmount: 400.0,
  entitlementDate: '2018-11-09T12:27:48.795Z',
}];

const awardDataNoInpayment = [{
  inPayment: false,
  totalAmount: 1000.0,
  weeklyStatePensionAmount: 100.0,
  weeklyProtectedPaymentAmount: 200.0,
  weeklyExtraStatePensionAmount: 300.0,
  weeklyInheritedExtraStatePensionAmount: 400.0,
  entitlementDate: '2018-11-09T12:27:48.795Z',
}, {
  inPayment: false,
  totalAmount: 1000.0,
  weeklyStatePensionAmount: 100.0,
  weeklyProtectedPaymentAmount: 200.0,
  weeklyExtraStatePensionAmount: 300.0,
  weeklyInheritedExtraStatePensionAmount: 400.0,
  entitlementDate: '2018-11-09T12:27:48.795Z',
}];

const entitlementDate = 1580968800000;

const formattedResponse = {
  summaryOne: [{
    key: { text: 'marital-update-state-pension-award:summary-keys.total', classes: 'govuk-!-font-weight-bold govuk-!-width-two-thirds' },
    value: { text: 'marital-update-state-pension-award:summary-values.total', classes: 'govuk-!-font-weight-bold' },
  }, {
    key: { text: 'marital-update-state-pension-award:summary-keys.new-state-pension', classes: 'govuk-!-font-weight-regular govuk-!-width-two-thirds' },
    value: { text: '£100.00' },
  }, {
    key: { text: 'marital-update-state-pension-award:summary-keys.protected-payment', classes: 'govuk-!-font-weight-regular govuk-!-width-two-thirds' },
    value: { text: '£200.00' },
  }, {
    key: { text: 'marital-update-state-pension-award:summary-keys.extra-state-pension', classes: 'govuk-!-font-weight-regular govuk-!-width-two-thirds' },
    value: { text: '£300.00' },
  }, {
    key: { text: 'marital-update-state-pension-award:summary-keys.inherited-extra-state-pension', classes: 'govuk-!-font-weight-regular govuk-!-width-two-thirds' },
    value: { text: '£400.00' },
  }],
  summaryTwo: [{
    key: { text: 'marital-update-state-pension-award:summary-keys.entitlement-date', classes: 'govuk-!-width-two-thirds' },
    value: { text: '6 February 2020' },
  }],
};

describe('Object: maritalUpdateStatePensionAwardObject', () => {
  describe('formatter', () => {
    it('should return false when details is undefined', () => {
      const response = maritalUpdateStatePensionAwardObject.formatter();
      assert.isFalse(response);
    });
    it('should return false when details is null', () => {
      const response = maritalUpdateStatePensionAwardObject.formatter(null);
      assert.isFalse(response);
    });
    it('should return valid summary list object with inPayment amounts', () => {
      const response = maritalUpdateStatePensionAwardObject.formatter(awardDataInpayment, entitlementDate);
      assert.deepEqual(response, formattedResponse);
    });
    it('should return valid summary list object with first amounts as no in payment present', () => {
      const response = maritalUpdateStatePensionAwardObject.formatter(awardDataNoInpayment, entitlementDate);
      assert.deepEqual(response, formattedResponse);
    });
  });
});
