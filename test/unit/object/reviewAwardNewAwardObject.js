const { assert } = require('chai');

const reviewAwardNewAwardObject = require('../../../lib/objects/reviewAwardNewAwardObject');

const validNextSrb = {
  nino: 'AA370773A',
  reasonForChange: 'REVISION OF ENTITLEMENT DUE TO CHANGE IN CONT/CREDIT POSITION',
  entitlementDate: '2018-11-09T12:27:48.795Z',
  newStatePensionAmount: 100.0,
  protectedPaymentAmount: 200.0,
  totalAmount: 300.0,
};

const responseNextSrb = {
  summaryOne: [
    {
      key: {
        text: 'Total',
        classes: 'govuk-!-font-weight-bold govuk-!-width-two-thirds',
      },
      value: {
        text: '£300.00 per week',
        classes: 'govuk-!-font-weight-bold',
      },
    }, {
      key: {
        text: 'New State Pension',
        classes: 'govuk-!-font-weight-regular govuk-!-width-two-thirds',
      },
      value: {
        text: '£100.00',
      },
    }, {
      key: {
        text: 'Protected payment',
        classes: 'govuk-!-font-weight-regular govuk-!-width-two-thirds',
      },
      value: {
        text: '£200.00',
      },
    }, {
      key: {
        text: 'Extra State Pension',
        classes: 'govuk-!-font-weight-regular govuk-!-width-two-thirds',
      },
      value: {
        text: '£0.00',
      },
    }, {
      key: {
        text: 'Inherited Extra State Pension',
        classes: 'govuk-!-font-weight-regular govuk-!-width-two-thirds',
      },
      value: {
        text: '£0.00',
      },
    },
  ],
  summaryTwo: [
    {
      key: {
        text: 'Entitlement date',
        classes: 'govuk-!-width-two-thirds',
      },
      value: {
        text: '9 November 2018',
      },
    },
  ],
};

describe('review new award object', () => {
  describe('formatter', () => {
    it('should return false when details is undefined', () => {
      const response = reviewAwardNewAwardObject.formatter();
      assert.isFalse(response);
    });
    it('should return false when details is null', () => {
      const response = reviewAwardNewAwardObject.formatter(null);
      assert.isFalse(response);
    });
    it('should return valid summary list object', () => {
      const response = reviewAwardNewAwardObject.formatter(validNextSrb);
      assert.equal(JSON.stringify(response), JSON.stringify(responseNextSrb));
    });
  });
});
