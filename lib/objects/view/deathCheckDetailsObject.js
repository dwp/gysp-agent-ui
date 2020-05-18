const i18n = require('i18next');

const addressHelper = require('../../helpers/addressHelper');

const [ARREARS, OVERPAYMENT, DEATH_NOT_VERIFIED, NOTHING_OWED] = ['ARREARS', 'OVERPAYMENT', 'DEATH_NOT_VERIFIED', 'NOTHING_OWED'];

module.exports = {
  formatter(details) {
    const address = addressHelper.addressLookupFormatter(details['dap-address'], details['address-lookup']);
    return {
      name: details['dap-name'].name,
      phoneNumber: details['dap-phone-number'].phoneNumber,
      address,
    };
  },
  pageData(data, status) {
    const pageData = {
      header: i18n.t('death-check-details:header.cannot-calculate'),
      back: '/changes-and-enquiries/personal/death/payment',
      button: '/changes-and-enquiries/personal/death/record',
      buttonText: i18n.t('app:button.continue'),
      status,
    };

    if (status === ARREARS) {
      pageData.header = i18n.t('death-check-details:header.arrears');
      pageData.buttonText = i18n.t('app:button.confirm');
    }

    if (status === OVERPAYMENT) {
      pageData.header = i18n.t('death-check-details:header.overpayment');
      pageData.buttonText = i18n.t('app:button.send-letter');
    }

    if (status === DEATH_NOT_VERIFIED) {
      pageData.header = i18n.t('death-check-details:header.death-not-verified');
    }

    if (status === NOTHING_OWED) {
      pageData.header = i18n.t('death-check-details:header.nothing-owed');
      pageData.buttonText = i18n.t('app:button.send-letter');
    }

    return { ...pageData, ...this.formatter(data) };
  },
};
