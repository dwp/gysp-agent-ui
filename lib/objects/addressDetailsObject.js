const generalHelper = require('../helpers/general');

module.exports = {

  formatter(details, nino, addressLookup) {
    const uprn = details.address;
    const addressDetails = addressLookup.data.filter((address) => address.uprn === uprn)[0];
    const buildingNumber = generalHelper.returnNullIfUndefinedOrEmpty(addressDetails.buildingNumber);
    const postTown = generalHelper.returnNullIfUndefinedOrEmpty(addressDetails.postTown);
    let thoroughfare = null;
    let dependentThoroughfare = null;
    const { street } = addressDetails;
    if (street.length === 1) {
      [thoroughfare] = street;
    } else if (street.length === 2) {
      [dependentThoroughfare, thoroughfare] = street;
    }
    return {
      buildingName: generalHelper.returnNullIfUndefinedOrEmpty(addressDetails.buildingName),
      subBuildingName: generalHelper.returnNullIfUndefinedOrEmpty(addressDetails.subBuilding),
      buildingNumber: buildingNumber == null ? null : Number(buildingNumber),
      dependentLocality: generalHelper.returnNullIfUndefinedOrEmpty(addressDetails.sourceData.dependentLocality),
      thoroughfareName: thoroughfare == null ? generalHelper.returnNullIfUndefinedOrEmpty(addressDetails.sourceData.thoroughfare) : thoroughfare,
      dependentThoroughfareName: dependentThoroughfare == null ? generalHelper.returnNullIfUndefinedOrEmpty(addressDetails.sourceData.dependentThoroughfare) : dependentThoroughfare,
      postTown: postTown == null ? generalHelper.returnNullIfUndefinedOrEmpty(addressDetails.sourceData.townName) : postTown,
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
