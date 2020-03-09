const i18n = require('i18next');

const [ARREARS, OVERPAYMENT, DEATH_NOT_VERIFIED] = ['ARREARS', 'OVERPAYMENT', 'DEATH_NOT_VERIFIED'];

function addressFormatter(details, addressLookup) {
  const uprn = Number(details.address);
  const { address } = addressLookup.addressResults.filter((addr) => addr.uprn === uprn)[0];
  const formattedAddress = address.replace(/,/gi, '<br />');
  return formattedAddress;
}

module.exports = {
  formatter(details) {
    const address = addressFormatter(details['dap-address'], details['address-lookup']);
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

    return { ...pageData, ...this.formatter(data) };
  },
};
