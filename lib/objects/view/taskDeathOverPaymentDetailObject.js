const i18n = require('i18next');
const { isDeathOverpaymentRepayable } = require('../../helpers/deathHelper');

const summaryClasses = 'gysp-summary-list-one-half';

// Summary Objects
const claimantSummary = require('./summary-objects/claimantSummary');
const overpaymentSummary = require('./summary-objects/overpaymentSummary');
const dapSummary = require('./summary-objects/dapSummary');
const otherDebtReferralSummary = require('./summary-objects/otherDebtReferralSummary');
const bankOrBuildingSummary = require('./summary-objects/bankOrBuildingSummary');

function pageHeader(workItemReason) {
  const workItemReasonLower = workItemReason.toLowerCase();
  return i18n.t(`task-detail:header.${workItemReasonLower}`);
}

function pageHint(workItemReason) {
  const workItemReasonLower = workItemReason.toLowerCase();
  return i18n.t(`task-detail:hint.${workItemReasonLower}`);
}

function summaryLists(details) {
  const repayable = isDeathOverpaymentRepayable(details.deathDetail.amountDetails.amount);
  const summary = [
    claimantSummary(details, summaryClasses),
    overpaymentSummary(details, summaryClasses),
  ];

  if (repayable) {
    summary.push(
      dapSummary(details, summaryClasses),
      otherDebtReferralSummary(details, summaryClasses),
      bankOrBuildingSummary(details, summaryClasses),
    );
  }

  return summary;
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
