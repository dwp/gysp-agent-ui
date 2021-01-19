const i18n = require('i18next');
const { residentialAddress: address } = require('../../helpers/addressHelper');
const { formatNinoWithSpaces } = require('../../helpers/general');

const summaryWidthClass = { classes: 'govuk-!-width-one-half' };

function pageHeader(workItemReason) {
  const workItemReasonLower = workItemReason.toLowerCase();
  return i18n.t(`task-detail:header.${workItemReasonLower}`);
}

function dapSummary(details) {
  try {
    const { fullName, payeeAddress } = details.deathDetail.payeeDetails;
    return {
      rows: [{
        key: { text: i18n.t('task-detail:death.dap.summary-keys.full-name'), ...summaryWidthClass },
        value: { text: fullName, ...summaryWidthClass },
      }, {
        key: { text: i18n.t('task-detail:death.dap.summary-keys.address'), ...summaryWidthClass },
        value: { html: address(payeeAddress).join('<br />'), ...summaryWidthClass },
      }],
    };
  } catch (err) {
    throw new Error('dapSummary: details object not in correct format');
  }
}

function claimantDetailFormatter(details) {
  return {
    nino: formatNinoWithSpaces(details.nino),
    fullName: `${details.firstName} ${details.surname}`,
  };
}

function claimantSummary(details) {
  const detail = claimantDetailFormatter(details);
  return {
    header: i18n.t('task-detail:claimant-details.header'),
    rows: [{
      key: { text: i18n.t('task-detail:claimant-details.summary-keys.nino'), ...summaryWidthClass },
      value: { text: detail.nino, ...summaryWidthClass },
    }, {
      key: { text: i18n.t('task-detail:claimant-details.summary-keys.full-name'), ...summaryWidthClass },
      value: { text: detail.fullName, ...summaryWidthClass },
    }],
  };
}

module.exports = {
  formatter(details, workItemReason) {
    return {
      backHref: '/task',
      header: pageHeader(workItemReason),
      summaryList: [
        dapSummary(details),
        claimantSummary(details),
      ],
      buttonHref: '/tasks/task/complete',
    };
  },
};
