const i18n = require('i18next');

const objectClasses = 'gysp-list-one-half';

// Summary Objects
const claimantSummary = require('./summary-objects/claimantSummary');
const srbOverpaymentSummary = require('./summary-objects/srbOverpaymentSummary');
const srbOverpaymentTotalSummary = require('./summary-objects/srbOverpaymentTotalSummary');

// Table objects
const srbOverpaymentTable = require('./table-objects/srbOverpaymentTable');

function pageHeader(workItemReason) {
  const workItemReasonLower = workItemReason.toLowerCase();
  return i18n.t(`task-detail:header.${workItemReasonLower}`);
}

function pageHint(workItemReason) {
  const workItemReasonLower = workItemReason.toLowerCase();
  return i18n.t(`task-detail:hint.${workItemReasonLower}`);
}

function summaryLists(details) {
  const summary = [
    claimantSummary(details.award, objectClasses),
  ];
  if (details.srbPaymentBreakdown && details.srbPaymentBreakdown.overpaymentPeriods.length > 1) {
    summary.push(
      srbOverpaymentTable(details.srbPaymentBreakdown),
      srbOverpaymentTotalSummary(details.srbPaymentBreakdown, objectClasses),
    );
  } else {
    summary.push(
      srbOverpaymentSummary(details.srbPaymentBreakdown, objectClasses),
    );
  }

  return summary;
}

module.exports = {
  formatter(details, workItemReason) {
    const viewObject = {
      backHref: '/review-award/schedule',
      header: pageHeader(workItemReason),
      hint: pageHint(workItemReason),
      summaryList: summaryLists(details),
      buttonHref: '/review-award/complete',
    };
    return viewObject;
  },
};
