const i18n = require('i18next');
const { address } = require('../../../helpers/addressHelper');

module.exports = (details, classes = null) => {
  const summaryObject = {
    header: i18n.t('task-detail:death.dap.header'),
    empty: i18n.t('task-detail:death.dap.empty'),
    classes,
  };
  if (details.deathDetail && details.deathDetail.payeeDetails) {
    const { fullName, payeeAddress, phoneNumber } = details.deathDetail.payeeDetails;
    summaryObject.rows = [{
      key: { text: i18n.t('task-detail:death.dap.summary-keys.full-name') },
      value: { text: fullName },
    }, {
      key: { text: i18n.t('task-detail:death.dap.summary-keys.phone') },
      value: { text: phoneNumber },
    }, {
      key: { text: i18n.t('task-detail:death.dap.summary-keys.address') },
      value: { html: address(payeeAddress).join('<br />') },
    }];
  }
  return summaryObject;
};
