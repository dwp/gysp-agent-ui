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

function formatUpdateAward(session) {
  const { amount: updatedNewStatePensionAmount } = session['update-state-pension-award-new-state-pension'] || Object.create(null);
  const { amount: updatedProtectedPaymentAmount } = session['update-state-pension-award-protected-payment'] || Object.create(null);
  const { amount: updatedInheritedExtraStatePensionAmount } = session['update-state-pension-award-inherited-extra-state-pension'] || Object.create(null);
  return {
    newStatePension: updatedNewStatePensionAmount ? Number(updatedNewStatePensionAmount) : null,
    protectedPayment: updatedProtectedPaymentAmount ? Number(updatedProtectedPaymentAmount) : null,
    inheritedExtraStatePension: updatedInheritedExtraStatePensionAmount ? Number(updatedInheritedExtraStatePensionAmount) : null,
  };
}

function calculateTotal(award, updatedAward) {
  let total = 0;
  total += updatedAward.newStatePension || award.weeklyStatePensionAmount;
  total += updatedAward.protectedPayment || award.weeklyProtectedPaymentAmount;
  total += updatedAward.inheritedExtraStatePension || award.weeklyInheritedExtraStatePensionAmount;
  total += award.weeklyExtraStatePensionAmount;

  return total;
}

function currentAwardOrSession(award, session) {
  const details = returnActiveAwardAmounts(award);
  const updatedAward = formatUpdateAward(session);
  const total = calculateTotal(details, updatedAward);
  return {
    totalAmount: total,
    weeklyStatePensionAmount: updatedAward.newStatePension || details.weeklyStatePensionAmount,
    weeklyProtectedPaymentAmount: updatedAward.protectedPayment || details.weeklyProtectedPaymentAmount,
    weeklyExtraStatePensionAmount: details.weeklyExtraStatePensionAmount,
    weeklyInheritedExtraStatePensionAmount: updatedAward.inheritedExtraStatePension || details.weeklyInheritedExtraStatePensionAmount,
  };
}

module.exports = {
  formatter(award, entitlementDate, maritalSession) {
    if (award === undefined || award === null) {
      return false;
    }

    const details = currentAwardOrSession(award, maritalSession);

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
          actions: {
            items: [{
              href: 'update-state-pension-award/new-state-pension',
              text: i18n.t('app:link.change'),
              visuallyHiddenText: i18n.t('marital-update-state-pension-award:summary-keys.new-state-pension').toLowerCase(),
              classes: 'govuk-link--no-visited-state',
            }],
          },
        }, {
          key: {
            text: i18n.t('marital-update-state-pension-award:summary-keys.protected-payment'),
            classes: 'govuk-!-font-weight-regular govuk-!-width-two-thirds',
          },
          value: {
            text: generalHelper.formatCurrency(details.weeklyProtectedPaymentAmount),
          },
          actions: {
            items: [{
              href: 'update-state-pension-award/protected-payment',
              text: i18n.t('app:link.change'),
              visuallyHiddenText: i18n.t('marital-update-state-pension-award:summary-keys.protected-payment').toLowerCase(),
              classes: 'govuk-link--no-visited-state',
            }],
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
          actions: {
            items: [{
              href: 'update-state-pension-award/inherited-extra-state-pension',
              text: i18n.t('app:link.change'),
              visuallyHiddenText: i18n.t('marital-update-state-pension-award:summary-keys.inherited-extra-state-pension').toLowerCase(),
              classes: 'govuk-link--no-visited-state',
            }],
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
