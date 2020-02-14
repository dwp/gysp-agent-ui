const dateHelper = require('../dateHelper');
const generalHelper = require('../helpers/general');

function formatEntitlementDate(entitlementDate, reviewAwardDate) {
  if (reviewAwardDate !== undefined) {
    return dateHelper.longDate(`${reviewAwardDate.dateYear}-${reviewAwardDate.dateMonth}-${reviewAwardDate.dateDay}`);
  }
  return dateHelper.longDate(entitlementDate);
}

module.exports = {
  formatter(details, reviewAwardDate) {
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
            text: formatEntitlementDate(details.entitlementDate, reviewAwardDate),
          },
          actions: {
            items: [{
              href: '/review-award/entitlement-date',
              text: 'Change',
              visuallyHiddenText: 'entitlement date',
            }],
          },
        },
      ],
    };
  },
  spDateFormatter(date) {
    return dateHelper.longDate(date);
  },
};
