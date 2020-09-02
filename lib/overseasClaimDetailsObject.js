const moment = require('moment');

module.exports = {
  formatter(details) {
    const claimDate = moment(details.claimDate);
    const statePensionDate = moment(details.statePensionDate);

    return {
      statePensionDate: statePensionDate.format('DD MMM YYYY'),
      claimDate: claimDate.format('DD MMM YYYY'),
      niNumber: details.nino,
      surname: details.surname,
      inviteKey: details.inviteKey,
    };
  },
};
