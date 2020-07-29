const validStatuses = '^(?:V|NV)$';

module.exports = {
  validStatus(string) {
    const status = new RegExp(validStatuses);
    if (status.test(string)) {
      return true;
    }
    return false;
  },
};
