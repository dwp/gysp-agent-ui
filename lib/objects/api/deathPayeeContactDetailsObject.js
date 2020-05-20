const addressHelper = require('../../helpers/addressHelper');

module.exports = {
  formatter(details, awardDetails) {
    return {
      nino: awardDetails.nino,
      fullName: details['dap-name'].name,
      phoneNumber: details['dap-phone-number'].phoneNumber,
      address: addressHelper.addressLookupApiFormatter(details['dap-address'], details['address-lookup']),
    };
  },
};
