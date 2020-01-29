const generalHelper = require('../../helpers/general');
const dateHelper = require('../../../lib/dateHelper');

const [CANNOT_CALCULATE, ARREARS, OVERPAYMENT] = ['CANNOT_CALCULATE', 'ARREARS', 'OVERPAYMENT'];

module.exports = {
  formatter(details) {
    return {
      amount: generalHelper.formatCurrency(Math.abs(details.amount)),
      startDate: dateHelper.slashDate(details.startDate),
      endDate: dateHelper.slashDate(details.endDate),
    };
  },
  pageData(section, status) {
    let pageData = {
      back: '/changes-and-enquiries/personal/death/address-select',
      button: '/changes-and-enquiries/personal/death/record',
    };

    if (status === CANNOT_CALCULATE || status === ARREARS || status === OVERPAYMENT) {
      pageData.button = '/changes-and-enquiries/personal/death/check-details';
    }

    if (section === 'retryCalc') {
      pageData = {
        back: '/changes-and-enquiries/personal',
        button: '/changes-and-enquiries/personal/death/update',
      };
    } else if (section === 'verifiedDateOfDeathYes') {
      pageData = {
        back: '/changes-and-enquiries/personal/death/verify',
        button: '/changes-and-enquiries/personal/death/record',
      };
    } else if (section === 'reVerifiedDateOfDeath') {
      pageData = {
        back: '/changes-and-enquiries/personal/death/verified-date',
        button: '/changes-and-enquiries/personal/death/record',
      };
    }
    return pageData;
  },
};
