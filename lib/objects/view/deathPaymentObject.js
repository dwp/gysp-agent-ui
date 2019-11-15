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
  pageData(retryCal = false) {
    if (retryCal) {
      return {
        back: '/changes-and-enquiries/personal',
        button: '/changes-and-enquiries/personal/death/update',
      };
    }

    return {
      back: '/changes-and-enquiries/personal/death/address-select',
      button: '/changes-and-enquiries/personal/death/record',
    };
  },
};
