const generalHelper = require('./general');

function depAndThoroughfareAddressLines(address, addressArray) {
  if (generalHelper.isNotUndefinedEmptyOrNull(address.dependentThoroughfareName)) {
    if (generalHelper.isNotUndefinedEmptyOrNull(address.buildingNumber)) {
      addressArray.push(`${address.buildingNumber} ${address.dependentThoroughfareName}`);
    } else {
      addressArray.push(address.dependentThoroughfareName);
    }
    addressArray.push(address.thoroughfareName);
  } else if (generalHelper.isNotUndefinedEmptyOrNull(address.buildingNumber)) {
    addressArray.push(`${address.buildingNumber} ${address.thoroughfareName}`);
  } else {
    addressArray.push(address.thoroughfareName);
  }
}

function addressWhereThoroughfareIsNullButPostTownExists(address) {
  const addressArray = [];
  if (generalHelper.isNotUndefinedEmptyOrNull(address.subBuildingName, address.buildingName)) {
    addressArray.push(`${address.subBuildingName}, ${address.buildingName}`);
  } else if (generalHelper.isNotUndefinedEmptyOrNull(address.subBuildingName)) {
    addressArray.push(address.subBuildingName);
  } else if (generalHelper.isNotUndefinedEmptyOrNull(address.buildingName)) {
    addressArray.push(address.buildingName);
  }

  if (generalHelper.isNotUndefinedEmptyOrNull(address.buildingNumber, address.dependentLocality) && addressArray.length > 0) {
    addressArray.push(`${address.buildingNumber} ${address.dependentLocality}`);
  } else if (generalHelper.isNotUndefinedEmptyOrNull(address.buildingNumber, address.dependentLocality)) {
    addressArray.push(`${address.buildingNumber} ${address.dependentLocality}`);
  } else if (generalHelper.isNotUndefinedEmptyOrNull(address.dependentLocality)) {
    addressArray.push(address.dependentLocality);
  } else if (addressArray.length === 0) {
    addressArray.push(address.buildingNumber);
  }

  addressArray.push(address.postTown, address.postCode);

  return generalHelper.removeNullFromArray(addressArray);
}

function addressDataWhereThoroughfareExists(address) {
  const addressArray = [];
  if (generalHelper.isNotUndefinedEmptyOrNull(address.subBuildingName, address.buildingName, address.buildingNumber)) {
    addressArray.push(`${address.subBuildingName}, ${address.buildingName}`);
    depAndThoroughfareAddressLines(address, addressArray);
  } else if (generalHelper.isNotUndefinedEmptyOrNull(address.subBuildingName, address.buildingName)) {
    addressArray.push(`${address.subBuildingName}, ${address.buildingName}`);
    depAndThoroughfareAddressLines(address, addressArray);
  } else if (generalHelper.isNotUndefinedEmptyOrNull(address.subBuildingName)) {
    addressArray.push(address.subBuildingName);
    depAndThoroughfareAddressLines(address, addressArray);
  } else if (generalHelper.isNotUndefinedEmptyOrNull(address.buildingName)) {
    addressArray.push(address.buildingName);
    depAndThoroughfareAddressLines(address, addressArray);
  } else if (generalHelper.isNotUndefinedEmptyOrNull(address.dependentThoroughfareName)) {
    if (generalHelper.isNotUndefinedEmptyOrNull(address.buildingNumber)) {
      addressArray.push(`${address.buildingNumber} ${address.dependentThoroughfareName}`);
    } else {
      addressArray.push(address.dependentThoroughfareName);
    }
    addressArray.push(address.thoroughfareName);
  } else if (generalHelper.isNotUndefinedEmptyOrNull(address.buildingNumber)) {
    addressArray.push(`${address.buildingNumber} ${address.thoroughfareName}`);
  } else {
    addressArray.push(address.thoroughfareName);
  }

  if (address.dependentLocality) {
    addressArray.push(address.dependentLocality);
  }
  if (address.postTown) {
    addressArray.push(address.postTown);
  }
  if (address.postCode) {
    addressArray.push(address.postCode);
  }
  return generalHelper.removeNullFromArray(addressArray);
}

module.exports = {
  address(details) {
    if (details.thoroughfareName === null) {
      return addressWhereThoroughfareIsNullButPostTownExists(details);
    }
    return addressDataWhereThoroughfareExists(details);
  },
  addressToHtmlLines(details) {
    const address = this.address(details);
    return address.join('<br />');
  },
  addressLookupFormatter(details, addressLookup) {
    const { singleLine } = addressLookup.data.filter((addr) => addr.uprn === details.address)[0];
    const formattedAddress = singleLine.replace(/,/gi, '<br />');
    return formattedAddress;
  },
  addressLookupApiFormatter(details, addressLookup) {
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
    };
  },
};
