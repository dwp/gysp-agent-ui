const moment = require('moment');

const generalHelper = require('./generalHelper');

module.exports = {
  formatter(details) {
    return {
      fullName: `${details.firstName} ${details.surname}`,
      nino: this.nino(details.nino),
      dob: moment(details.dob).format('DD MMMM YYYY'),
      statePensionDate: moment(details.statePensionDate).format('DD MMMM YYYY'),
      address: this.address(details.residentialAddress),
      homeTelephoneNumber: details.contactDetail.homeTelephoneNumber,
      mobileTelephoneNumber: details.contactDetail.mobileTelephoneNumber,
      workTelephoneNumber: details.contactDetail.workTelephoneNumber,
      email: details.contactDetail.email,
    };
  },
  nino(string) {
    return string.replace(/(.{2})/g, '$1 ');
  },
  address(details) {
    if (details.thoroughfareName === null) {
      return this.addressWhereThoroughfareIsNullButPostTownExists(details);
    }
    return this.addressDataWhereThoroughfareExists(details);
  },
  addressWhereThoroughfareIsNullButPostTownExists(address) {
    const addressArray = [];
    if (generalHelper.isNotUndefinedEmtpyOrNull(address.subBuildingName, address.buildingName)) {
      addressArray.push(`${address.subBuildingName}, ${address.buildingName}`);
    } else if (generalHelper.isNotUndefinedEmtpyOrNull(address.subBuildingName)) {
      addressArray.push(address.subBuildingName);
    } else if (generalHelper.isNotUndefinedEmtpyOrNull(address.buildingName)) {
      addressArray.push(address.buildingName);
    }

    if (generalHelper.isNotUndefinedEmtpyOrNull(address.buildingNumber, address.dependentLocality) && addressArray.length > 0) {
      addressArray.push(`${address.buildingNumber} ${address.dependentLocality}`);
    } else if (generalHelper.isNotUndefinedEmtpyOrNull(address.buildingNumber, address.dependentLocality)) {
      addressArray.push(`${address.buildingNumber} ${address.dependentLocality}`);
    } else if (generalHelper.isNotUndefinedEmtpyOrNull(address.dependentLocality)) {
      addressArray.push(address.dependentLocality);
    } else if (addressArray.length === 0) {
      addressArray.push(address.buildingNumber);
    }

    addressArray.push(address.postTown, address.postCode);

    return this.removeNullFromArray(addressArray);
  },
  addressDataWhereThoroughfareExists(address) {
    const addressArray = [];
    if (generalHelper.isNotUndefinedEmtpyOrNull(address.subBuildingName, address.buildingName, address.buildingNumber)) {
      addressArray.push(`${address.subBuildingName}, ${address.buildingName}`);
      this.depAndThoroughfareAddressLines(address, addressArray);
    } else if (generalHelper.isNotUndefinedEmtpyOrNull(address.subBuildingName, address.buildingName)) {
      addressArray.push(`${address.subBuildingName}, ${address.buildingName}`);
      this.depAndThoroughfareAddressLines(address, addressArray);
    } else if (generalHelper.isNotUndefinedEmtpyOrNull(address.subBuildingName)) {
      addressArray.push(address.subBuildingName);
      this.depAndThoroughfareAddressLines(address, addressArray);
    } else if (generalHelper.isNotUndefinedEmtpyOrNull(address.buildingName)) {
      addressArray.push(address.buildingName);
      this.depAndThoroughfareAddressLines(address, addressArray);
    } else if (generalHelper.isNotUndefinedEmtpyOrNull(address.dependentThoroughfareName)) {
      addressArray.push(`${address.buildingNumber} ${address.dependentThoroughfareName}`);
      addressArray.push(address.thoroughfareName);
    } else {
      addressArray.push(`${address.buildingNumber} ${address.thoroughfareName}`);
    }

    if (address.dependentLocality) {
      addressArray.push(address.dependentLocality);
    }

    addressArray.push(address.postTown, address.postCode);

    return this.removeNullFromArray(addressArray);
  },
  depAndThoroughfareAddressLines(address, addressArray) {
    if (generalHelper.isNotUndefinedEmtpyOrNull(address.dependentThoroughfareName)) {
      if (generalHelper.isNotUndefinedEmtpyOrNull(address.buildingNumber)) {
        addressArray.push(`${address.buildingNumber} ${address.dependentThoroughfareName}`);
      } else {
        addressArray.push(address.dependentThoroughfareName);
      }
      addressArray.push(address.thoroughfareName);
    } else if (generalHelper.isNotUndefinedEmtpyOrNull(address.buildingNumber)) {
      addressArray.push(`${address.buildingNumber} ${address.thoroughfareName}`);
    } else {
      addressArray.push(address.thoroughfareName);
    }
  },
  removeNullFromArray(array) {
    return array.filter(element => element !== null);
  },
};
