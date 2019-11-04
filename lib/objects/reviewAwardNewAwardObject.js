const dateHelper = require('../dateHelper');
const generalHelper = require('../helpers/general');

module.exports = {
  formatter(details) {
    if (details === undefined || details === null) {
      return false;
    }

    return {
      summaryOne: [
        {
          key: {
            text: 'Total',
            classes: 'govuk-!-font-weight-bold govuk-!-width-two-thirds',
          },
          value: {
            text: `${generalHelper.formatCurrency(details.totalAmount)} per week`,
            classes: 'govuk-!-font-weight-bold',
          },
        }, {
          key: {
            text: 'New State Pension',
            classes: 'govuk-!-font-weight-regular govuk-!-width-two-thirds',
          },
          value: {
            text: generalHelper.formatCurrency(details.newStatePensionAmount),
          },
        }, {
          key: {
            text: 'Protected payment',
            classes: 'govuk-!-font-weight-regular govuk-!-width-two-thirds',
          },
          value: {
            text: generalHelper.formatCurrency(details.protectedPaymentAmount),
          },
        }, {
          key: {
            text: 'Extra State Pension',
            classes: 'govuk-!-font-weight-regular govuk-!-width-two-thirds',
          },
          value: {
            text: generalHelper.formatCurrency(0),
          },
        }, {
          key: {
            text: 'Inherited Extra State Pension',
            classes: 'govuk-!-font-weight-regular govuk-!-width-two-thirds',
          },
          value: {
            text: generalHelper.formatCurrency(0),
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
            text: dateHelper.longDate(details.entitlementDate),
          },
        },
      ],
    };
  },
  entitlementDateFormatter(details) {
    return dateHelper.longDate(details.entitlementDate);
  },
};
