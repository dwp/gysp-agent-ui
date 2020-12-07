module.exports = {
  formatter(details, agentRefObject) {
    const json = {
      surname: details.surname,
      agentRef: agentRefObject.cis.dwp_staffid,
    };
    return json;
  },
};
