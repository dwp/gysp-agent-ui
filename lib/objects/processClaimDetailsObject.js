const moment = require('moment');

module.exports = {
  formatter(details) {
    const dob = moment(details.dob);
    return {
      nino: details.nino,
      name: `${details.firstName} ${details.surname}`,
      dob: dob.format('DD/MM/YYYY'),
    };
  },
};
