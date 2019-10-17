function updateStatusType(currentStatus) {
  if (currentStatus === 'SENT') {
    return 'RECALLING';
  }
  return currentStatus;
}

module.exports = {
  formatter(id, status) {
    return {
      id,
      status: updateStatusType(status),
    };
  },
};
