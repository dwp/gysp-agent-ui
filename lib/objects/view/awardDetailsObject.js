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
  if (reason === 'INHERITED') {
    return i18n.t('award-detail:summary-values.reason.inherited');
  }
  return null;
}

function header(isNewAward, inPayment, isFutureFirstAward) {
  if (inPayment || isFutureFirstAward) {
    return i18n.t('award-detail:header.current');
  }
  if (isNewAward) {
    return i18n.t('award-detail:header.new');
  }
  return i18n.t('award-detail:header.previous');
}

function awardDetails(details, paymentFrequency, isNewAward) {
  const array = [{
    key: { text: i18n.t('award-detail:summary-keys.from'), classes: 'govuk-!-width-two-thirds' },
    value: { text: dateHelper.longDate(details.fromDate) },
  }];

  if (paymentFrequency !== '1W' && isNewAward) {
    const frequency = paymentFrequency.slice(0, -1);
    array.push({
      key: { text: `${frequency} ${i18n.t('award-detail:summary-keys.weekly-amount')}`, classes: 'govuk-!-width-two-thirds' },
      value: { text: generalHelper.formatCurrency(frequency * details.totalAmount) },
    });
  }

  array.push({
    key: { text: i18n.t('award-detail:summary-keys.reason'), classes: 'govuk-!-width-two-thirds' },
    value: { text: convertReason(details.reasonCode) },
  });

  return array;
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
    const isNewAward = (index === '0' && details.awardAmounts[index].reasonCode === 'ANNUALUPRATING' && details.awardAmounts[index].inPayment === false);
    let isFutureFirstAward = false;
    if (details.awardAmounts[index].reasonCode === 'FIRSTAWARD' || details.awardAmounts[index].reasonCode === 'SRB') {
      // end date is null or after today and not before start date then set as future first award
      const dateComponentsTo = dateHelper.dateComponents(dateHelper.timestampToDateDash(details.awardAmounts[index].toDate));
      const dateComponentsFrom = dateHelper.dateComponents(dateHelper.timestampToDateDash(details.awardAmounts[index].fromDate));
      if (details.awardAmounts[index].toDate === null
        || (generalHelper.isDateAfterToday(dateComponentsTo.dateDay, dateComponentsTo.dateMonth, dateComponentsTo.dateYear)
        && generalHelper.isDateBeforeDate(details.awardAmounts[index].toDate, dateComponentsFrom.dateDay, dateComponentsFrom.dateMonth, dateComponentsFrom.dateYear))) {
        isFutureFirstAward = true;
      }
    }
    return {
      isNewAward,
      header: header(isNewAward, details.awardAmounts[index].inPayment, isFutureFirstAward),
      detailsSummaryRows: awardDetails(details.awardAmounts[index], details.paymentFrequency, isNewAward),
      amountSummaryRows: awardAmounts(details.awardAmounts[index]),
    };
  },
};
