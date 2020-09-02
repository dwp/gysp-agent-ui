module.exports = {
  formatter(details) {
    const json = {
      inviteKey: details.inviteKey,
      errorDetail: details.message,
    };
    return json;
  },
};
