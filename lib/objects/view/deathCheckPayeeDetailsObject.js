const i18n = require('i18next');

const addressHelper = require('../../helpers/addressHelper');

module.exports = {
  formatter(details) {
    const address = addressHelper.addressToHtmlLines(details.address);
    return {
      name: details.fullName,
      phoneNumber: details.phoneNumber,
      address,
    };
  },
  pageData(data) {
    const pageData = {
      header: i18n.t('death-check-payee-details:header'),
      back: '/changes-and-enquiries/personal',
      button: '/changes-and-enquiries/personal/death/account-details',
      buttonText: i18n.t('app:button.continue'),
    };

    return { ...pageData, ...this.formatter(data) };
  },
};
