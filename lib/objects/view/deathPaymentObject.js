const generalHelper = require('../../helpers/general');
const dateHelper = require('../../../lib/dateHelper');

module.exports = {
  formatter(details) {
    return {
      amount: generalHelper.formatCurrency(Math.abs(details.amount)),
      startDate: dateHelper.slashDate(details.startDate),
      endDate: dateHelper.slashDate(details.endDate),
    };
  },
};
