const { assert } = require('chai');

const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../../../config/i18next');

const maritalUpdateStatePensionAwardObject = require('../../../../../lib/objects/view/maritalUpdateStatePensionAwardObject');

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
    key: { text: 'Total', classes: 'govuk-!-font-weight-bold govuk-!-width-two-thirds' },
    value: { text: '£1,000.00 per week', classes: 'govuk-!-font-weight-bold' },
  }, {
    key: { text: 'New State Pension', classes: 'govuk-!-font-weight-regular govuk-!-width-two-thirds' },
    value: { text: '£100.00' },
    actions: {
      items: [{
        classes: 'govuk-link--no-visited-state',
        href: 'update-state-pension-award/new-state-pension',
        text: 'Change',
        visuallyHiddenText: 'new state pension',
      }],
    },
  }, {
    key: { text: 'Protected payment', classes: 'govuk-!-font-weight-regular govuk-!-width-two-thirds' },
    value: { text: '£200.00' },
    actions: {
      items: [{
        classes: 'govuk-link--no-visited-state',
        href: 'update-state-pension-award/protected-payment',
        text: 'Change',
        visuallyHiddenText: 'protected payment',
      }],
    },
  }, {
    key: { text: 'Extra State Pension', classes: 'govuk-!-font-weight-regular govuk-!-width-two-thirds' },
    value: { text: '£300.00' },
  }, {
    key: { text: 'Inherited extra State Pension', classes: 'govuk-!-font-weight-regular govuk-!-width-two-thirds' },
    value: { text: '£400.00' },
    actions: {
      items: [{
        classes: 'govuk-link--no-visited-state',
        href: 'update-state-pension-award/inherited-extra-state-pension',
        text: 'Change',
        visuallyHiddenText: 'inherited extra state pension',
      }],
    },
  }],
  summaryTwo: [{
    key: { text: 'Entitlement date', classes: 'govuk-!-width-two-thirds' },
    value: { text: '6 February 2020' },
  }],
};

const emptySession = {};

describe('Object: maritalUpdateStatePensionAwardObject', () => {
  describe('formatter', () => {
    before(async () => {
      await i18next
        .use(i18nextFsBackend)
        .init(i18nextConfig);
    });

    it('should return false when details is undefined', () => {
      const response = maritalUpdateStatePensionAwardObject.formatter();
      assert.isFalse(response);
    });

    it('should return false when details is null', () => {
      const response = maritalUpdateStatePensionAwardObject.formatter(null);
      assert.isFalse(response);
    });

    it('should return valid summary list object with inPayment amounts', () => {
      const response = maritalUpdateStatePensionAwardObject.formatter(awardDataInpayment, entitlementDate, emptySession);
      assert.deepEqual(response, formattedResponse);
    });

    it('should return valid summary list object with first amounts as no in payment present', () => {
      const response = maritalUpdateStatePensionAwardObject.formatter(awardDataNoInpayment, entitlementDate, emptySession);
      assert.deepEqual(response, formattedResponse);
    });
  });
});
