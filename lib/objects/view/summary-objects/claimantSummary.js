const i18n = require('i18next');

const { formatNinoWithSpaces } = require('../../../helpers/general');

function claimantDetailFormatter(details) {
  return {
    nino: formatNinoWithSpaces(details.nino),
    fullName: `${details.firstName} ${details.surname}`,
  };
}

module.exports = (details, classes = null) => {
  const detail = claimantDetailFormatter(details);
  return {
    header: i18n.t('task-detail:claimant-details.header'),
    classes,
    rows: [{
      key: { text: i18n.t('task-detail:claimant-details.summary-keys.nino') },
      value: { text: detail.nino },
    }, {
      key: { text: i18n.t('task-detail:claimant-details.summary-keys.full-name') },
      value: { text: detail.fullName },
    }],
  };
};
