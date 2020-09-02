module.exports = {
  formatter(details, agentRefObject) {
    const json = {
      surname: details.surname,
      agentRef: `${agentRefObject.cis.givenname} ${agentRefObject.cis.surname}`,
    };
    return json;
  },
};
