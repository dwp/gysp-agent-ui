const generalHelper = require('../../lib/helpers/general');

module.exports = {
  formatter(detail) {
    if (detail === undefined || detail === null) {
      return false;
    }

    const object = {
      status: generalHelper.formatPaymentStatus(detail.status),
      accountHolder: detail.accountName,
      accountNumber: detail.accountNumber,
      sortCode: generalHelper.formatSortCode(detail.sortCode),
    };

    if (detail.referenceNumber) {
      object.rollNumber = detail.referenceNumber;
    }

    return object;
  },
};
