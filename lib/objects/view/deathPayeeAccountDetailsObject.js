const i18n = require('i18next');

module.exports = {
  pageData() {
    return {
      header: i18n.t('payee-account:header'),
      formAction: '/changes-and-enquiries/personal/death/account-details',
      back: '/changes-and-enquiries/personal/death/payee-details',
      buttonText: i18n.t('app:button.continue'),
    };
  },
};
