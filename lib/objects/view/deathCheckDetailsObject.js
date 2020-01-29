const i18n = require('i18next');

const [ARREARS] = ['ARREARS'];

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
      signOff: i18n.t('death-check-details:p.cannot-calculate'),
      button: '/changes-and-enquiries/personal/death/record',
    };

    if (status === ARREARS) {
      pageData.header = i18n.t('death-check-details:header.arrears');
      pageData.signOff = i18n.t('death-check-details:p.arrears');
    }

    return { ...pageData, ...this.formatter(data) };
  },
};
