const moment = require('moment');

module.exports = {
  formatter(details) {
    return {
      fullName: `${details.firstName} ${details.surname}`,
      nino: this.nino(details.nino),
      dob: moment(details.dob).format('DD MMMM YYYY'),
      statePensionDate: moment(details.statePensionDate).format('DD MMMM YYYY'),
    };
  },
  nino(string) {
    return string.replace(/(.{2})/g, '$1 ');
  },
};
