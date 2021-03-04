const i18n = require('i18next');

const { formatCurrency } = require('../../../helpers/general');
const { longDateWithAbbMonth } = require('../../../dateHelper');

function formatter(details) {
  const { overpaymentPeriods, totalOverpayment } = details;
  const periods = overpaymentPeriods.map((item) => ({
    date: i18n.t('task-detail:srb.overpayment.summary-values.period', {
      startDate: longDateWithAbbMonth(item.fromDate),
      endDate: longDateWithAbbMonth(item.toDate),
    }),
    incorrectAmount: formatCurrency(item.oldAmount),
    correctAmount: formatCurrency(Math.abs(item.totalAmount)),
  }));
  return {
    periods,
    total: formatCurrency(Math.abs(totalOverpayment)),
  };
}

module.exports = (details) => {
  const detail = formatter(details);

  return {
    header: i18n.t('task-detail:srb.overpayment.header'),
    head: [{
      text: i18n.t('task-detail:srb.overpayment.summary-keys.period'),
      classes: 'govuk-!-width-one-half',
    }, {
      text: i18n.t('task-detail:srb.overpayment.summary-keys.incorrect-weekly-amount'),
      classes: 'govuk-!-width-one-quarter',
    }, {
      text: i18n.t('task-detail:srb.overpayment.summary-keys.correct-weekly-amount'),
      classes: 'govuk-!-width-one-quarter',
    }],
    rows: detail.periods.map((period) => [{
      text: period.date,
    }, {
      text: period.incorrectAmount,
    }, {
      text: period.correctAmount,
    }]),
  };
};
