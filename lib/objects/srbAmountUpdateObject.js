function formatAmount(amount) {
  if (amount !== undefined && amount !== null) {
    return parseFloat(amount);
  }
  return null;
}

module.exports = {
  putObject(inviteKey, spAmount, protectedAmount) {
    return {
      inviteKey,
      spAmount: formatAmount(spAmount),
      protectedAmount: formatAmount(protectedAmount),
    };
  },
};
