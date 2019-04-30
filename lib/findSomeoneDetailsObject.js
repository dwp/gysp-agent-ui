const i18n = require('i18next');
const { formatNino } = require('./stringHelper');

i18n.init({ sendMissingTo: 'fallback' });

module.exports = {
  formatter(details) {
    return {
      fullName: `${details.firstName} ${details.surname}`,
      nino: formatNino(details.nino),
    };
  },
};
