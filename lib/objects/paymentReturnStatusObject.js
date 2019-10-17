module.exports = {
  formatter(id, inviteKey) {
    return {
      id,
      inviteKey,
      eventName: 'payment-detail:timeline.returned',
    };
  },
};
