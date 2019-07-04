module.exports = {
  formatter(details, awardDetails) {
    const json = {
      dateOfDeath: `${details.dateYear}-${details.dateMonth}-${details.dateDay}T00:00:00.000Z`,
      dateOfDeathVerification: details.verification,
      nino: awardDetails.nino,
    };
    return json;
  },
};
