const dateHelper = require('../dateHelper');
const addressHelper = require('../helpers/addressHelper');

module.exports = {
  formatter(details, deathPayment, awardDetails) {
    const dateOfDeath = dateHelper.dateDash(`${details['date-of-death'].dateYear}-${details['date-of-death'].dateMonth}-${details['date-of-death'].dateDay}`);
    const json = {
      dateOfDeath: `${dateOfDeath}T00:00:00.000Z`,
      dateOfDeathVerification: details['date-of-death'].verification,
      nino: awardDetails.nino,
    };

    if (details['dap-name'] !== undefined) {
      json.deathPayeeDetails = {
        fullName: details['dap-name'].name,
        phoneNumber: details['dap-phone-number'].phoneNumber,
        address: addressHelper.addressLookupApiFormatter(details['dap-address'], details['address-lookup']),
      };
    }

    if (details['date-of-death'].verification === 'V') {
      json.amountDetails = deathPayment;
    }

    return json;
  },
};
