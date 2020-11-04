module.exports = {
  formatter(details) {
    return {
      reason: details.workItemReason.toLowerCase(),
    };
  },
  complete(workItemReason, suffix) {
    const suffixWithDash = suffix ? `-${suffix}` : '';
    return {
      reason: workItemReason.toLowerCase() + suffixWithDash,
    };
  },
};
