const dateHelper = require('../dateHelper');

module.exports = {
  formatter(nino, fromDate) {
    const deferralRequestDate = dateHelper.timestampToDateDash(fromDate);

    const json = {
      deferralRequestDate: `${deferralRequestDate}T00:00:00.000Z`,
      eventCategory: 'PERSONAL',
      eventType: 'CHANGE',
      eventName: 'personal:timeline.state-pension-deferred',
      nino,
    };

    return json;
  },
};
