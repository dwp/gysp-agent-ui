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
  pageData(data) {
    const pageData = {
      back: '/changes-and-enquiries/personal/death/payment',
      button: '/changes-and-enquiries/personal/death/record',
    };

    return { ...pageData, ...this.formatter(data) };
  },
};
