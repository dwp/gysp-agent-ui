const i18n = require('i18next');

const { formatCurrency } = require('../../../helpers/general');

function formatter(details) {
  const { deathDetail: { amountDetails } } = details;
  return {
    total: formatCurrency(Math.abs(amountDetails.amount)),
  };
}

module.exports = (details, classes = null) => {
  const detail = formatter(details);
  return {
    classes,
    rows: [{
      key: { text: i18n.t('task-detail:death.overpayment-details.summary-keys.total') },
      value: { text: detail.total },
    }],
  };
};
