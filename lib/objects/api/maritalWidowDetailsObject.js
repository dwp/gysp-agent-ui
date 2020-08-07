const { dateDash } = require('../../dateHelper');

module.exports = {
  formatter(details, awardDetails) {
    const { date, 'check-for-inheritable-state-pension': checkForInheritableStatePension } = details;
    return {
      nino: awardDetails.nino,
      eventCategory: 'PERSONAL',
      eventType: 'CHANGE',
      eventName: 'personal:timeline.marital-status',
      widowedDate: dateDash(`${date.dateYear}-${date.dateMonth}-${date.dateDay}`),
      widowedDateVerified: date.verification === 'V',
      checkInheritableStatePension: checkForInheritableStatePension.checkInheritableStatePension === 'yes',
    };
  },
};
