const generalHelper = require('../../helpers/general');
const dateHelper = require('../../../lib/dateHelper');
const deathHelper = require('../../helpers/deathHelper');

module.exports = {
  formatter(details) {
    return {
      amount: generalHelper.formatCurrency(Math.abs(details.amount)),
      startDate: dateHelper.longDate(details.startDate),
      endDate: dateHelper.longDate(details.endDate),
    };
  },
  pageData(section, status) {
    let pageData = {
      back: '/changes-and-enquiries/personal/death/address-select',
      button: '/changes-and-enquiries/personal/death/check-details',
    };

    if (section === 'retryCalc') {
      pageData = { back: '/changes-and-enquiries/personal' };
      if (deathHelper.isArrears(status)) {
        pageData.button = '/changes-and-enquiries/personal/death/payee-details';
      } else {
        pageData.button = '/changes-and-enquiries/personal/death/update';
      }
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
  pageDataDeathNotVerified() {
    return {
      back: '/changes-and-enquiries/personal/death/address-select',
      button: '/changes-and-enquiries/personal/death/check-details',
    };
  },
};
