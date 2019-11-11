const dateHelper = require('../dateHelper');

module.exports = {
  formatter(details, awardDetails) {
    const dateOfDeath = dateHelper.dateDash(`${details['date-of-death'].dateYear}-${details['date-of-death'].dateMonth}-${details['date-of-death'].dateDay}`);
    const json = {
      dateOfDeath: `${dateOfDeath}T00:00:00.000Z`,
      dateOfDeathVerification: details['date-of-death'].verification,
      nino: awardDetails.nino,
    };
    json.eventCategory = 'PERSONAL';
    json.eventType = 'ADD';

    if (details['date-of-death'].verification === 'V') {
      json.amountDetails = details['death-payment'];
      json.eventName = 'personal:timeline.date_of_death.verified';
    } else {
      json.eventName = 'personal:timeline.date_of_death.not_verified';
    }

    return json;
  },
};
