const generalHelper = require('../../lib/helpers/general');

module.exports = {
  formatter(detail, id) {
    return {
      id,
      changeType: generalHelper.formatPaymentStatusToChangeType(detail.status),
    };
  },
};
