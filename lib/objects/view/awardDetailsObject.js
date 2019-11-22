const i18n = require('i18next');
const generalHelper = require('../../helpers/general');
const dateHelper = require('../../dateHelper');

function convertReason(reason) {
  if (reason === 'FIRSTAWARD') {
    return i18n.t('award-detail:summary-values.reason.first-award');
  }
  if (reason === 'ANNUALUPRATING') {
    return i18n.t('award-detail:summary-values.reason.annual-uprating');
  }
  return null;
}

function awardDetails(details) {
  return [{
    key: { text: i18n.t('award-detail:summary-keys.from'), classes: 'govuk-!-width-two-thirds' },
    value: { text: dateHelper.longDate(details.fromDate) },
  }, {
    key: { text: i18n.t('award-detail:summary-keys.reason'), classes: 'govuk-!-width-two-thirds' },
    value: { text: convertReason(details.reasonCode) },
  }];
}

function awardAmounts(amounts) {
  return [{
    key: { text: i18n.t('award-detail:summary-keys.total'), classes: 'govuk-!-width-two-thirds govuk-!-font-weight-bold' },
    value: { text: `${generalHelper.formatCurrency(amounts.totalAmount)} a week`, classes: 'govuk-!-font-weight-bold' },
  }, {
    key: { text: i18n.t('award-detail:summary-keys.new-state-pension'), classes: 'govuk-!-width-two-thirds govuk-!-font-weight-regular' },
    value: { text: generalHelper.formatCurrency(amounts.weeklyStatePensionAmount) },
  }, {
    key: { text: i18n.t('award-detail:summary-keys.protected-payment'), classes: 'govuk-!-width-two-thirds govuk-!-font-weight-regular' },
    value: { text: generalHelper.formatCurrency(amounts.weeklyProtectedPaymentAmount) },
  }, {
    key: { text: i18n.t('award-detail:summary-keys.extra-state-pension'), classes: 'govuk-!-width-two-thirds govuk-!-font-weight-regular' },
    value: { text: generalHelper.formatCurrency(amounts.weeklyExtraStatePensionAmount) },
  }, {
    key: { text: i18n.t('award-detail:summary-keys.inherited-extra-state-pension'), classes: 'govuk-!-width-two-thirds govuk-!-font-weight-regular' },
    value: { text: generalHelper.formatCurrency(amounts.weeklyInheritedExtraStatePensionAmount) },
  }];
}

module.exports = {
  formatter(details, index) {
    return {
      detailsSummaryRows: awardDetails(details.awardAmounts[index]),
      amountSummaryRows: awardAmounts(details.awardAmounts[index]),
    };
  },
};
