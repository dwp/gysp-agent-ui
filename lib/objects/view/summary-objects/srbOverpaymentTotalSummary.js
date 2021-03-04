const i18n = require('i18next');

const { formatCurrency } = require('../../../helpers/general');

function formatter(details) {
  const { totalOverpayment } = details;
  return {
    total: formatCurrency(Math.abs(totalOverpayment)),
  };
}

module.exports = (details, classes = null) => {
  const detail = formatter(details);
  return {
    classes,
    rows: [{
      key: { text: i18n.t('task-detail:srb.overpayment.summary-keys.total') },
      value: { text: detail.total },
    }],
  };
};
