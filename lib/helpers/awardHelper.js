const moment = require('moment');

function returnActiveAwardAmounts(awardAmounts) {
  const amounts = awardAmounts.sort((a, b) => a.fromDate - b.fromDate);
  const inPayment = amounts.filter((item) => item.inPayment === true);
  if (inPayment.length > 0) {
    return inPayment[0];
  }
  return amounts[0];
}

function getActiveAwardOnDate(awards, activeDate) {
  let activeAward = null;
  if (awards) {
    awards.forEach((award) => {
      const fromDate = moment(award.fromDate)
        .startOf('day');
      let toDate;
      if (award.toDate) {
        toDate = moment(award.toDate)
          .startOf('day');
      }
      if (activeDate.isSameOrAfter(fromDate) && (!toDate || activeDate.isSameOrBefore(toDate))) {
        if (activeAward) {
          // Should never happen - but just in case - prefer the award with no toDate
          if (!toDate) {
            activeAward = award;
          }
        } else {
          activeAward = award;
        }
      }
    });
  }
  return activeAward;
}

module.exports = {
  returnActiveAwardAmounts,
  getActiveAwardOnDate,
};
