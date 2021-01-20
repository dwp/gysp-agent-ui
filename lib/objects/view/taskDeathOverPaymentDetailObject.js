const i18n = require('i18next');
const { isDeathOverpaymentRepayable, isDeathOverpaymentPeriods } = require('../../helpers/deathHelper');

const objectClasses = 'gysp-list-one-half';

// Summary Objects
const claimantSummary = require('./summary-objects/claimantSummary');
const overpaymentSummary = require('./summary-objects/overpaymentSummary');
const overpaymentTotalSummary = require('./summary-objects/overpaymentTotalSummary');
const dapSummary = require('./summary-objects/dapSummary');
const otherDebtReferralSummary = require('./summary-objects/otherDebtReferralSummary');
const bankOrBuildingSummary = require('./summary-objects/bankOrBuildingSummary');

// Table objects
const overpaymentTable = require('./table-objects/overpaymentTable');

function pageHeader(workItemReason) {
  const workItemReasonLower = workItemReason.toLowerCase();
  return i18n.t(`task-detail:header.${workItemReasonLower}`);
}

function pageHint(workItemReason) {
  const workItemReasonLower = workItemReason.toLowerCase();
  return i18n.t(`task-detail:hint.${workItemReasonLower}`);
}

function summaryLists(details) {
  const { amountDetails, awardAmountPeriods } = details.deathDetail;
  const repayable = isDeathOverpaymentRepayable(amountDetails.amount);
  const hasPeriods = isDeathOverpaymentPeriods(awardAmountPeriods);
  const summary = [
    claimantSummary(details, objectClasses),
  ];
  if (hasPeriods) {
    summary.push(
      overpaymentTable(details, objectClasses),
      overpaymentTotalSummary(details, objectClasses),
    );
  } else {
    summary.push(overpaymentSummary(details, objectClasses));
  }

  if (repayable) {
    summary.push(
      dapSummary(details, objectClasses),
      otherDebtReferralSummary(details, objectClasses),
      bankOrBuildingSummary(details, objectClasses),
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
