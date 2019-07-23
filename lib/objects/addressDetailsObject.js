const generalHelper = require('../helpers/general');

module.exports = {

  formatter(details, nino, addressLookup) {
    const uprn = Number(details.address);
    const addressDetails = addressLookup.addressResults.filter(address => address.uprn === uprn)[0];
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
      nino,
      eventCategory: 'CONTACT',
      eventType: 'CHANGE',
      eventName: 'address:timeline.address.changed',
    };
  },
};
