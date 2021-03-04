const i18n = require('i18next');

const { formatCurrency } = require('../../../helpers/general');
const { longDateWithAbbMonth } = require('../../../dateHelper');

function formatter(details) {
  const { overpaymentPeriods, totalOverpayment } = details;
  return {
    period: i18n.t('task-detail:srb.overpayment.summary-values.period', {
      startDate: longDateWithAbbMonth(overpaymentPeriods[0].fromDate),
      endDate: longDateWithAbbMonth(overpaymentPeriods[0].toDate),
    }),
    incorrectAmount: formatCurrency(overpaymentPeriods[0].oldAmount),
    correctAmount: formatCurrency(Math.abs(overpaymentPeriods[0].totalAmount)),
    total: formatCurrency(Math.abs(totalOverpayment)),
  };
}

module.exports = (details, classes = null) => {
  const detail = formatter(details);
  return {
    header: i18n.t('task-detail:death.overpayment-details.header'),
    classes,
    rows: [{
      key: { text: i18n.t('task-detail:srb.overpayment.summary-keys.period') },
      value: { text: detail.period },
    }, {
      key: { text: i18n.t('task-detail:srb.overpayment.summary-keys.incorrect-weekly-amount') },
      value: { text: detail.incorrectAmount },
    }, {
      key: { text: i18n.t('task-detail:srb.overpayment.summary-keys.correct-weekly-amount') },
      value: { text: detail.correctAmount },
    }, {
      key: { text: i18n.t('task-detail:srb.overpayment.summary-keys.total') },
      value: { text: detail.total },
    }],
  };
};
