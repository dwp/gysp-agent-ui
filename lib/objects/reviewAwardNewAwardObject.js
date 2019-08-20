const dateHelper = require('../dateHelper');

function formatCurrency(number) {
  const numberFormat = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });
  if (number !== undefined && number !== null) {
    return numberFormat.format(number);
  }
  return numberFormat.format(0);
}

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
            text: `${formatCurrency(details.totalAmount)} per week`,
            classes: 'govuk-!-font-weight-bold',
          },
        }, {
          key: {
            text: 'New State Pension',
            classes: 'govuk-!-font-weight-regular govuk-!-width-two-thirds',
          },
          value: {
            text: formatCurrency(details.newStatePensionAmount),
          },
        }, {
          key: {
            text: 'Protected payment',
            classes: 'govuk-!-font-weight-regular govuk-!-width-two-thirds',
          },
          value: {
            text: formatCurrency(details.protectedPaymentAmount),
          },
        }, {
          key: {
            text: 'Extra State Pension',
            classes: 'govuk-!-font-weight-regular govuk-!-width-two-thirds',
          },
          value: {
            text: formatCurrency(0),
          },
        }, {
          key: {
            text: 'Inherited Extra State Pension',
            classes: 'govuk-!-font-weight-regular govuk-!-width-two-thirds',
          },
          value: {
            text: formatCurrency(0),
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
