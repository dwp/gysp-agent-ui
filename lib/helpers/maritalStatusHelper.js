module.exports = {
  transformToShortStatus(status) {
    const statusLower = status.toLowerCase();
    if (statusLower === 'civil partnership') {
      return 'civil';
    }
    return statusLower;
  },
};
