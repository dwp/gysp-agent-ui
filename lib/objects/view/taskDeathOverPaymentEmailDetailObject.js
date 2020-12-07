const i18n = require('i18next');

const summaryClasses = 'gysp-summary-list-forty-sixty';

// Summary Objects
const claimantSummary = require('./summary-objects/claimantSummary');
const dapSummary = require('./summary-objects/dapSummary');

function pageHeader(workItemReason) {
  const workItemReasonLower = workItemReason.toLowerCase();
  return i18n.t(`task-detail:header.${workItemReasonLower}`);
}

function pageHint(workItemReason) {
  const workItemReasonLower = workItemReason.toLowerCase();
  return i18n.t(`task-detail:hint.${workItemReasonLower}`);
}

function summaryLists(details) {
  return [
    claimantSummary(details, summaryClasses),
    dapSummary(details, summaryClasses),
  ];
}

module.exports = {
  formatter(details, workItemReason) {
    const viewObject = {
      backHref: '/task',
      header: pageHeader(workItemReason),
      hint: pageHint(workItemReason),
      summaryList: summaryLists(details),
      buttonHref: '/tasks/task/complete',
    };
    return viewObject;
  },
};
