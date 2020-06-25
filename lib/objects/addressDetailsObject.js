const generalHelper = require('../helpers/general');

module.exports = {

  formatter(details, nino, addressLookup) {
    const uprn = details.address;
    const addressDetails = addressLookup.data.filter((address) => address.uprn === uprn)[0];
    const buildingNumber = generalHelper.returnNullIfUndefinedOrEmpty(addressDetails.buildingNumber);
    return {
      buildingName: generalHelper.returnNullIfUndefinedOrEmpty(addressDetails.buildingName),
      subBuildingName: generalHelper.returnNullIfUndefinedOrEmpty(addressDetails.subBuilding),
      buildingNumber: buildingNumber == null ? null : Number(buildingNumber),
      dependentLocality: generalHelper.returnNullIfUndefinedOrEmpty(addressDetails.sourceData.dependentLocality),
      thoroughfareName: generalHelper.returnNullIfUndefinedOrEmpty(addressDetails.sourceData.thoroughfare),
      dependentThoroughfareName: generalHelper.returnNullIfUndefinedOrEmpty(addressDetails.sourceData.dependentThoroughfare),
      postTown: generalHelper.returnNullIfUndefinedOrEmpty(addressDetails.postTown),
      postCode: generalHelper.returnNullIfUndefinedOrEmpty(addressDetails.postcode),
      singleLine: generalHelper.returnNullIfUndefinedOrEmpty(addressDetails.singleLine),
      uprn,
      nino,
      eventCategory: 'CONTACT',
      eventType: 'CHANGE',
      eventName: 'address:timeline.address.changed',
    };
  },
};
