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

module.exports = {
  formatter(id, status, statusUpdate) {
    return {
      id,
      status: updateStatusType(status, statusUpdate),
    };
  },
};
