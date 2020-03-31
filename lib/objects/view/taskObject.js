module.exports = {
  formatter(details) {
    return {
      reason: details.workItemReason.toLowerCase(),
    };
  },
  complete(details) {
    return {
      reason: details.workItemReason.toLowerCase(),
    };
  },
};
