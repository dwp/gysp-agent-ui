const i18n = require('i18next');

const { formatCurrency } = require('../../../helpers/general');
const { longDateWithAbbMonth } = require('../../../dateHelper');

function formatter(details) {
  const { deathDetail: { amountDetails }, awardAmounts } = details;
  return {
    period: i18n.t('task-detail:death.overpayment-details.summary-values.period', {
      startDate: longDateWithAbbMonth(amountDetails.startDate),
      endDate: longDateWithAbbMonth(amountDetails.endDate),
    }),
    amount: formatCurrency(awardAmounts[0].totalAmount),
    total: formatCurrency(Math.abs(amountDetails.amount)),
  };
}

module.exports = (details, classes = null) => {
  const detail = formatter(details);
  return {
    header: i18n.t('task-detail:death.overpayment-details.header'),
    classes,
    rows: [{
      key: { text: i18n.t('task-detail:death.overpayment-details.summary-keys.period') },
      value: { text: detail.period },
    }, {
      key: { text: i18n.t('task-detail:death.overpayment-details.summary-keys.amount') },
      value: { text: detail.amount },
    }, {
      key: { text: i18n.t('task-detail:death.overpayment-details.summary-keys.total') },
      value: { text: detail.total },
    }],
  };
};
