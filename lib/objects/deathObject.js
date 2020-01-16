const dateHelper = require('../dateHelper');
const generalHelper = require('../helpers/general');

function addressFormatter(details, addressLookup) {
  const uprn = Number(details.address);
  const addressDetails = addressLookup.addressResults.filter((address) => address.uprn === uprn)[0];
  return {
    buildingName: generalHelper.returnNullIfUndefinedOrEmpty(addressDetails.buildingName),
    subBuildingName: generalHelper.returnNullIfUndefinedOrEmpty(addressDetails.subBuildingName),
    buildingNumber: generalHelper.returnNullIfUndefinedOrEmpty(addressDetails.buildingNumber),
    dependentLocality: generalHelper.returnNullIfUndefinedOrEmpty(addressDetails.dependentLocality),
    thoroughfareName: generalHelper.returnNullIfUndefinedOrEmpty(addressDetails.thoroughfareName),
    dependentThoroughfareName: generalHelper.returnNullIfUndefinedOrEmpty(addressDetails.dependentThoroughfareName),
    postTown: generalHelper.returnNullIfUndefinedOrEmpty(addressDetails.posttown),
    postCode: generalHelper.returnNullIfUndefinedOrEmpty(addressDetails.postcode),
    uprn,
  };
}

module.exports = {
  formatter(details, awardDetails) {
    const dateOfDeath = dateHelper.dateDash(`${details['date-of-death'].dateYear}-${details['date-of-death'].dateMonth}-${details['date-of-death'].dateDay}`);
    const json = {
      dateOfDeath: `${dateOfDeath}T00:00:00.000Z`,
      dateOfDeathVerification: details['date-of-death'].verification,
      nino: awardDetails.nino,
    };

    json.eventType = 'CHANGE';

    if (details['dap-name'] !== undefined) {
      json.deathPayeeDetails = {
        fullName: details['dap-name'].name,
        phoneNumber: details['dap-phone-number'].phoneNumber,
        address: addressFormatter(details['dap-address'], details['address-lookup']),
      };
      json.eventType = 'ADD';
    }

    json.eventCategory = 'PERSONAL';

    if (details['date-of-death'].verification === 'V') {
      json.amountDetails = details['death-payment'];
      json.eventName = 'personal:timeline.date_of_death.verified';
    } else {
      json.eventName = 'personal:timeline.date_of_death.not_verified';
    }

    return json;
  },
};
