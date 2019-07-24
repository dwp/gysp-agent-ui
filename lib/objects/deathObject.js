module.exports = {
  formatter(details, awardDetails) {
    const json = {
      dateOfDeath: `${details.dateYear}-${details.dateMonth}-${details.dateDay}T00:00:00.000Z`,
      dateOfDeathVerification: details.verification,
      nino: awardDetails.nino,
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
