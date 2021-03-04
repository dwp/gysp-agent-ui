const i18n = require('i18next');
const { longDate } = require('../../dateHelper');
const { formatCurrency } = require('../../helpers/general');
const { isAwardOverpayment } = require('../../helpers/taskHelper');

const awardIncrease = (currentAward, updatedAward) => updatedAward > currentAward;

function header(totalOverpayment) {
  if (isAwardOverpayment(totalOverpayment)) {
    return i18n.t('review-award-summary:header.overpayment');
  }
  return i18n.t('review-award-summary:header.arrears');
}

function changeText(currentAward, updatedAward) {
  if (awardIncrease(currentAward, updatedAward)) {
    return i18n.t('review-award-summary:change.increase');
  }
  return i18n.t('review-award-summary:change.decrease');
}

function button(totalOverpayment) {
  if (isAwardOverpayment(totalOverpayment)) {
    return i18n.t('review-award-summary:button.overpayment');
  }
  return i18n.t('review-award-summary:button.arrears');
}

module.exports = {
  formatter(details) {
    const {
      currentAwardAmount,
      entitlementDate,
      firstPayment,
      updatedAwardAmount,
      updatedUpratingAwardAmount,
      totalOverpayment,
      upratingDate,
    } = details;

    const paragraphs = [
      i18n.t('review-award-summary:p-1', {
        CHANGE: changeText(currentAwardAmount, updatedAwardAmount),
        FROM: formatCurrency(currentAwardAmount),
        TO: formatCurrency(updatedAwardAmount),
        DATE: longDate(entitlementDate),
      }),
    ];

    if (firstPayment && firstPayment.arrearsExist) {
      paragraphs.push(i18n.t('review-award-summary:p-arrears', {
        AMOUNT: formatCurrency(firstPayment.paymentCalculation.totalAmount),
        FROM: longDate(firstPayment.startDate),
        TO: longDate(firstPayment.endDate),
      }));
    }

    if (updatedUpratingAwardAmount) {
      paragraphs.push(i18n.t('review-award-summary:p-uprating', {
        DATE: longDate(upratingDate),
        AMOUNT: formatCurrency(updatedUpratingAwardAmount),
      }));
    }

    paragraphs.push(i18n.t('review-award-summary:p-2'));

    return {
      header: header(totalOverpayment),
      paragraphs,
      button: button(totalOverpayment),
    };
  },
};
