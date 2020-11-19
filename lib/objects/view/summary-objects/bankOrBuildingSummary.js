const i18n = require('i18next');

const { formatSortCode } = require('../../../helpers/general');

function formatter(details) {
  const { accountDetail } = details;
  return {
    accountHolder: accountDetail.accountHolder,
    accountNumber: accountDetail.accountNumber,
    sortCode: formatSortCode(accountDetail.sortCode),
    referenceNumber: accountDetail.referenceNumber,
  };
}

module.exports = (details, classes = null) => {
  const detail = formatter(details);
  const summaryObject = {
    header: i18n.t('task-detail:death.bank-building-details.header'),
    classes,
    rows: [{
      key: { text: i18n.t('task-detail:death.bank-building-details.summary-keys.account-number') },
      value: { text: detail.accountNumber },
    }, {
      key: { text: i18n.t('task-detail:death.bank-building-details.summary-keys.sort-code') },
      value: { text: detail.sortCode },
    }, {
      key: { text: i18n.t('task-detail:death.bank-building-details.summary-keys.account-holder') },
      value: { text: detail.accountHolder },
    }],
  };

  if (detail.referenceNumber) {
    summaryObject.rows.splice(2, 0, {
      key: { text: i18n.t('task-detail:death.bank-building-details.summary-keys.reference-number') },
      value: { text: detail.referenceNumber },
    });
  }

  return summaryObject;
};
