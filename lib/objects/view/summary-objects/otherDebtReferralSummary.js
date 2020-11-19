const i18n = require('i18next');

const { capitaliseFirstLetter, formatPaymentFrequency } = require('../../../helpers/general');
const { longDate } = require('../../../dateHelper');

function formatter(details) {
  const { deathDetail } = details;
  return {
    paymentDay: capitaliseFirstLetter(details.paymentDay),
    paymentFrequency: formatPaymentFrequency(details.paymentFrequency),
    dateDeathRecorded: deathDetail && deathDetail.notificationDate ? longDate(deathDetail.notificationDate) : null,
  };
}

module.exports = (details, classes = null) => {
  const detail = formatter(details);
  const summaryObject = {
    header: i18n.t('task-detail:death.other-debt-referral-details.header'),
    classes,
    rows: [{
      key: { text: i18n.t('task-detail:death.other-debt-referral-details.summary-keys.payment-day') },
      value: { text: detail.paymentDay },
    }, {
      key: { text: i18n.t('task-detail:death.other-debt-referral-details.summary-keys.payment-frequency') },
      value: { text: detail.paymentFrequency },
    }],
  };

  if (detail.dateDeathRecorded) {
    summaryObject.rows.push({
      key: { text: i18n.t('task-detail:death.other-debt-referral-details.summary-keys.date-death-recorded') },
      value: { text: detail.dateDeathRecorded },
    });
  }
  return summaryObject;
};
