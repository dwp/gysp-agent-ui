const i18n = require('i18next');

const { formatCurrency } = require('../../../helpers/general');
const { longDateWithAbbMonth } = require('../../../dateHelper');

function formatter(details) {
  const { amountDetails, awardAmountPeriods } = details.deathDetail;
  const periods = awardAmountPeriods.map((item) => ({
    date: i18n.t('task-detail:death.overpayment-details.summary-values.period', {
      startDate: longDateWithAbbMonth(item.fromDate),
      endDate: longDateWithAbbMonth(item.toDate),
    }),
    amount: formatCurrency(item.totalAmount),
  }));
  return {
    periods,
    total: formatCurrency(Math.abs(amountDetails.amount)),
  };
}

module.exports = (details, classes = null) => {
  const detail = formatter(details);

  return {
    header: i18n.t('task-detail:death.overpayment-details.header'),
    classes,
    head: [{
      text: i18n.t('task-detail:death.overpayment-details.summary-keys.period'),
    }, {
      text: i18n.t('task-detail:death.overpayment-details.summary-keys.amount'),
    }],
    rows: detail.periods.map((period) => [{
      text: period.date,
    }, {
      text: period.amount,
    }]),
  };
};
