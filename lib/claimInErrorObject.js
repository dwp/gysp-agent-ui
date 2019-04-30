const i18n = require('i18next');

i18n.init({ sendMissingTo: 'fallback' });

module.exports = {
  formatter(details) {
    const json = {
      inviteKey: details.inviteKey,
      errorDetail: details.message,
    };
    return json;
  },
};
