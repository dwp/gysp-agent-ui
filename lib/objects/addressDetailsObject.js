const generalHelper = require('../helpers/general');

module.exports = {

  formatter(details, nino, addressLookup) {
    const uprn = details.address;
    const addressDetails = addressLookup.data.filter((address) => address.uprn === uprn)[0];
    const buildingNumber = generalHelper.returnNullIfUndefinedOrEmpty(addressDetails.buildingNumber);
    let thoroughfare = null;
    let depThorough = null;
    const { street } = addressDetails;
    const [name1, name2] = street;
    if (street.length === 1) {
      thoroughfare = name1;
    } else if (street.length === 2) {
      depThorough = name1;
      thoroughfare = name2;
    }
    return {
      buildingName: generalHelper.returnNullIfUndefinedOrEmpty(addressDetails.buildingName),
      subBuildingName: generalHelper.returnNullIfUndefinedOrEmpty(addressDetails.subBuilding),
      buildingNumber: buildingNumber == null ? null : Number(buildingNumber),
      dependentLocality: generalHelper.returnNullIfUndefinedOrEmpty(addressDetails.sourceData.dependentLocality),
      thoroughfareName: thoroughfare,
      dependentThoroughfareName: depThorough,
      postTown: generalHelper.returnNullIfUndefinedOrEmpty(addressDetails.postTown) == null ? generalHelper.returnNullIfUndefinedOrEmpty(addressDetails.sourceData.townName) : addressDetails.postTown,
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
