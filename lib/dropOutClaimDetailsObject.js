const moment = require('moment');

module.exports = {
  formatter(details) {
    const claimDate = moment(details.claimDate);
    return {
      reason: details.errorDetail,
      claimDate: claimDate.format('DD MMM YYYY'),
      niNumber: details.nino,
      surname: details.surname,
      invitationCode: details.inviteKey,
    };
  },
};
