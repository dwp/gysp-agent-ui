const dateHelper = require('../dateHelper');

module.exports = {
  formatter(details, awardDetails) {
    const dateOfDeath = dateHelper.dateDash(`${details.dateYear}-${details.dateMonth}-${details.dateDay}`);
    const json = {
      dateOfDeath: `${dateOfDeath}T00:00:00.000Z`,
      dateOfDeathVerification: details.verification,
      nino: awardDetails.nino,
      amountDetails: details['death-payment'],
    };
    json.eventCategory = 'PERSONAL';
    json.eventType = 'ADD';

    if (details.verification === 'V') {
      json.eventName = 'personal:timeline.date_of_death.verified';
    } else {
      json.eventName = 'personal:timeline.date_of_death.not_verified';
    }

    return json;
  },
};
