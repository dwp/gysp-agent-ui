const i18n = require('i18next');

i18n.init({ sendMissingTo: 'fallback' });

module.exports = {
  formatter(details, agentRefObject) {
    const json = {
      surname: details.surname,
      agentRef: `${agentRefObject.cis.givenname} ${agentRefObject.cis.surname}`,
    };
    return json;
  },
};
