const i18n = require('i18next');

i18n.init({ sendMissingTo: 'fallback' });

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
