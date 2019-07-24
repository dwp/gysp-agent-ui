module.exports = {
  formatter(details, awardDetails) {
    const json = {
      dateOfDeath: `${details.dateYear}-${details.dateMonth}-${details.dateDay}T00:00:00.000Z`,
      dateOfDeathVerification: 'V',
      nino: awardDetails.nino,
      eventCategory: 'PERSONAL',
      eventType: 'CHANGE',
      eventName: 'personal:timeline.date_of_death.verified',
    };
    return json;
  },
};
