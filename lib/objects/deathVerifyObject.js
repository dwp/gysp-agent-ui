const moment = require('moment');

module.exports = {
  formatter(awardDetails) {
    const json = {
      dateOfDeath: moment(awardDetails.dateOfDeath).toISOString(),
      dateOfDeathVerification: 'V',
      nino: awardDetails.nino,
    };
    return json;
  },
};
