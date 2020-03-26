module.exports = {
  formatter(details) {
    return {
      reason: details.workItemReason.toLowerCase(),
    };
  },
};
