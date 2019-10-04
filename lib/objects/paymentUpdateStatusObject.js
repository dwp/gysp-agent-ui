function updateStatusType(currentStatus) {
  if (currentStatus === 'PAID') {
    return 'NOTPAID';
  }
  return currentStatus;
}

module.exports = {
  formatter(detail, id) {
    return {
      id,
      status: updateStatusType(detail.status),
    };
  },
};
