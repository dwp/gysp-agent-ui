const moment = require('moment');

module.exports = {
  formatter(awardDetails) {
    const json = {
      dateOfDeath: moment(awardDetails.dateOfDeath).toISOString(),
      dateOfDeathVerification: 'V',
      nino: awardDetails.nino,
      eventCategory: 'PERSONAL',
      eventType: 'CHANGE',
      eventName: 'personal:timeline.date_of_death.verified',
    };
    return json;
  },
};
