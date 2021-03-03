const i18n = require('i18next');

const awardHelper = require('../../../lib/helpers/awardHelper');
const dateHelper = require('../../dateHelper');
const generalHelper = require('../../helpers/general');

module.exports = {
  formatter(awards, entitlementDate, maritalSession) {
    if (awards === undefined || awards === null) {
      return false;
    }

    const activeAward = awardHelper.activeAward(awards, maritalSession);

    const details = awardHelper.currentAwardOrSession(activeAward, maritalSession);

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
