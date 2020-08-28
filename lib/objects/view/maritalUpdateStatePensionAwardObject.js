const i18n = require('i18next');
const dateHelper = require('../../dateHelper');
const generalHelper = require('../../helpers/general');

function returnActiveAwardAmounts(awardAmounts) {
  const inPayment = awardAmounts.filter((item) => item.inPayment === true);
  if (inPayment.length > 0) {
    return inPayment[0];
  }
  return awardAmounts[0];
}

module.exports = {
  formatter(award, entitlementDate) {
    if (award === undefined || award === null) {
      return false;
    }

    const details = returnActiveAwardAmounts(award);

    return {
      summaryOne: [
        {
          key: {
            text: i18n.t('marital-update-state-pension-award:summary-keys.total'),
            classes: 'govuk-!-font-weight-bold govuk-!-width-two-thirds',
          },
          value: {
            text: i18n.t('marital-update-state-pension-award:summary-values.total', { value: generalHelper.formatCurrency(details.totalAmount) }),
            classes: 'govuk-!-font-weight-bold',
          },
        }, {
          key: {
            text: i18n.t('marital-update-state-pension-award:summary-keys.new-state-pension'),
            classes: 'govuk-!-font-weight-regular govuk-!-width-two-thirds',
          },
          value: {
            text: generalHelper.formatCurrency(details.weeklyStatePensionAmount),
          },
        }, {
          key: {
            text: i18n.t('marital-update-state-pension-award:summary-keys.protected-payment'),
            classes: 'govuk-!-font-weight-regular govuk-!-width-two-thirds',
          },
          value: {
            text: generalHelper.formatCurrency(details.weeklyProtectedPaymentAmount),
          },
        }, {
          key: {
            text: i18n.t('marital-update-state-pension-award:summary-keys.extra-state-pension'),
            classes: 'govuk-!-font-weight-regular govuk-!-width-two-thirds',
          },
          value: {
            text: generalHelper.formatCurrency(details.weeklyExtraStatePensionAmount),
          },
        }, {
          key: {
            text: i18n.t('marital-update-state-pension-award:summary-keys.inherited-extra-state-pension'),
            classes: 'govuk-!-font-weight-regular govuk-!-width-two-thirds',
          },
          value: {
            text: generalHelper.formatCurrency(details.weeklyInheritedExtraStatePensionAmount),
          },
        },
      ],
      summaryTwo: [
        {
          key: {
            text: i18n.t('marital-update-state-pension-award:summary-keys.entitlement-date'),
            classes: 'govuk-!-width-two-thirds',
          },
          value: {
            text: dateHelper.longDate(entitlementDate),
          },
        },
      ],
    };
  },
};
