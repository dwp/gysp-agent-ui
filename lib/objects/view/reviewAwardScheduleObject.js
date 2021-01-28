const i18n = require('i18next');
const moment = require('moment');
const { longDate } = require('../../dateHelper');
const { formatCurrency } = require('../../helpers/general');

const awardIncrease = (currentAward, updatedAward) => updatedAward > currentAward;

function changeText(currentAward, updatedAward) {
  if (awardIncrease(currentAward, updatedAward)) {
    return i18n.t('review-award-complete:change.increase');
  }
  return i18n.t('review-award-complete:change.decrease');
}

module.exports = {
  formatter(details, entitlementDate) {
    const { currentAwardAmount, updatedAwardAmount, firstPayment } = details;
    if (!entitlementDate || !moment(entitlementDate, 'YYYY-MM-DD').isValid()) {
      throw new TypeError(`Expected date time got ${typeof entitlementDate}: ${entitlementDate}`);
    }
    const paragraphs = [
      i18n.t('review-award-complete:p-1', {
        CHANGE: changeText(currentAwardAmount, updatedAwardAmount),
        FROM: formatCurrency(currentAwardAmount),
        TO: formatCurrency(updatedAwardAmount),
        DATE: longDate(entitlementDate),
      }),
    ];

    if (firstPayment && firstPayment.arrearsExist) {
      paragraphs.push(i18n.t('review-award-complete:p-arrears', {
        AMOUNT: formatCurrency(firstPayment.paymentCalculation.totalAmount),
        FROM: longDate(firstPayment.startDate),
        TO: longDate(firstPayment.endDate),
      }));
    }

    paragraphs.push(i18n.t('review-award-complete:p-2'));

    return { paragraphs };
  },
};
