function updateStatusType(currentStatus, statusUpdate) {
  if (currentStatus === 'SENT') {
    return 'RECALLING';
  }
  if (currentStatus === 'RECALLING') {
    if (statusUpdate === 'yes') {
      return 'RECALLED';
    }
    return 'PAID';
  }
  return currentStatus;
}

function timeline(status) {
  if (status === 'RECALLING') {
    return 'payment-detail:timeline.recalling';
  }
  if (status === 'RECALLED') {
    return 'payment-detail:timeline.recalled-successful';
  }
  if (status === 'PAID') {
    return 'payment-detail:timeline.recalled-unsuccessful';
  }
  return null;
}

module.exports = {
  formatter(id, status, statusUpdate, inviteKey) {
    const newStatus = updateStatusType(status, statusUpdate);
    return {
      id,
      status: newStatus,
      inviteKey,
      eventName: timeline(newStatus),
    };
  },
};
