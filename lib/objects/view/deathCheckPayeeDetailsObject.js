const i18n = require('i18next');

const addressHelper = require('../../helpers/addressHelper');
const deathHelper = require('../../helpers/deathHelper');

function formatApiData(details) {
  const address = addressHelper.addressToHtmlLines(details.address);
  return {
    name: details.fullName,
    phoneNumber: details.phoneNumber,
    address,
  };
}

function formatSessionData(details) {
  const address = addressHelper.addressLookupFormatter(details['dap-address'], details['address-lookup']);
  return {
    name: details['dap-name'].name,
    phoneNumber: details['dap-phone-number'].phoneNumber,
    address,
  };
}

module.exports = {
  formatter(details, sessionData) {
    if (sessionData) {
      return formatSessionData(sessionData);
    }
    return formatApiData(details);
  },
  pageData(data, status, sessionData) {
    let pageData = {
      header: i18n.t('death-check-payee-details:header.default'),
      back: '/changes-and-enquiries/personal',
      button: '/changes-and-enquiries/personal/death/account-details',
      buttonText: i18n.t('app:button.continue'),
      enableChange: true,
    };

    if (deathHelper.isArrears(status)) {
      pageData = {
        header: i18n.t('death-check-payee-details:header.arrears'),
        back: '/changes-and-enquiries/personal/death/retry-calculation',
        button: '/changes-and-enquiries/personal/death/update',
        buttonText: i18n.t('app:button.confirm'),
        status,
      };
    }

    return { ...pageData, ...this.formatter(data, sessionData) };
  },
};
