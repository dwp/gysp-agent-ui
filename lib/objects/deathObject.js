const dateHelper = require('../dateHelper');
const addressHelper = require('../helpers/addressHelper');

function dateOfDeathSessionOrAward(details, awardDetails) {
  if (details['date-of-death']) {
    return dateHelper.dateDash(`${details['date-of-death'].dateYear}-${details['date-of-death'].dateMonth}-${details['date-of-death'].dateDay}`);
  }
  return dateHelper.timestampToDateDash(awardDetails.deathDetail.dateOfDeath);
}

function verificationSessionOrAward(details, awardDetails) {
  if (details['date-of-death']) {
    return details['date-of-death'].verification;
  }
  return awardDetails.deathDetail.dateOfDeathVerification;
}

module.exports = {
  formatter(details, deathPayment, awardDetails) {
    const dateOfDeath = `${dateOfDeathSessionOrAward(details, awardDetails)}T00:00:00.000Z`;
    const dateOfDeathVerification = verificationSessionOrAward(details, awardDetails);

    const json = {
      dateOfDeath,
      dateOfDeathVerification,
      nino: awardDetails.nino,
    };

    if (details['dap-name'] !== undefined) {
      json.deathPayeeDetails = {
        fullName: details['dap-name'].name,
        phoneNumber: details['dap-phone-number'].phoneNumber,
        address: addressHelper.addressLookupApiFormatter(details['dap-address'], details['address-lookup']),
      };
    }

    if (dateOfDeathVerification === 'V') {
      json.amountDetails = deathPayment;
    }

    return json;
  },
};
