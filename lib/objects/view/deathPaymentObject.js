const generalHelper = require('../../helpers/general');
const dateHelper = require('../../../lib/dateHelper');
const deathHelper = require('../../helpers/deathHelper');

const deathUrls = {
  reviewPayee: '/changes-and-enquiries/personal/death/review-payee',
  update: '/changes-and-enquiries/personal/death/update',
  record: '/changes-and-enquiries/personal/death/record',
  checkDetails: '/changes-and-enquiries/personal/death/check-details',
  personal: '/changes-and-enquiries/personal',
  verify: '/changes-and-enquiries/personal/death/verify',
  verifyDate: '/changes-and-enquiries/personal/death/verified-date',
  addressSelect: '/changes-and-enquiries/personal/death/address-select',
};

function backHref(section, origin) {
  if (deathHelper.isOriginCanVerifyDateOfDeath(origin)) {
    return deathUrls.addressSelect;
  }
  switch (section) {
  case 'retryCalc':
    return deathUrls.personal;
  case 'verifiedDateOfDeathYes':
    return deathUrls.verify;
  case 'reVerifiedDateOfDeath':
    return deathUrls.verifyDate;
  default:
    return deathUrls.addressSelect;
  }
}

function buttonHref(section, status, origin) {
  if (deathHelper.isNullOrCannotCalculate(status)) {
    if (deathHelper.isRetryCalc(section)) {
      return deathUrls.update;
    }
    if (deathHelper.isDateOfDeathSection(section)) {
      return deathUrls.record;
    }
  }
  if (deathHelper.isAllSection(section) && !deathHelper.isOriginCanVerifyDateOfDeath(origin)) {
    return deathUrls.reviewPayee;
  }
  return deathUrls.checkDetails;
}

module.exports = {
  formatter(details) {
    return {
      amount: generalHelper.formatCurrency(Math.abs(details.amount)),
      startDate: dateHelper.longDate(details.startDate),
      endDate: dateHelper.longDate(details.endDate),
    };
  },
  pageData(section, status, origin) {
    return {
      back: backHref(section, origin),
      button: buttonHref(section, status, origin),
    };
  },
  pageDataDeathNotVerified() {
    return {
      back: deathUrls.addressSelect,
      button: deathUrls.checkDetails,
    };
  },
};
