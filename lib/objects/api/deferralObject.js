const dateHelper = require('../../dateHelper');

module.exports = {
  formatter(nino, fromDate, requestDate) {
    const deferralRequestDate = dateHelper.timestampToDateDash(fromDate);
    const requestReceivedDate = dateHelper.dateDash(`${requestDate.year}-${requestDate.month}-${requestDate.day}`);

    const json = {
      deferralRequestDate: `${deferralRequestDate}T00:00:00.000Z`,
      requestReceivedDate: `${requestReceivedDate}T00:00:00.000Z`,
      eventCategory: 'PERSONAL',
      eventType: 'CHANGE',
      eventName: 'personal:timeline.state-pension-deferred',
      nino,
    };

    return json;
  },
};
