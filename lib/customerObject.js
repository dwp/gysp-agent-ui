const i18n = require('i18next');

i18n.init({ sendMissingTo: 'fallback' });

module.exports = {
  addressFormatterUk(details) {
    const address = {
      thoroughfareName: details.thoroughfareName,
      postCode: details.postCode,
    };
    if (details.subBuildingName !== '') {
      address.subBuildingName = details.subBuildingName;
    }

    if (details.buildingName !== '') {
      address.buildingName = details.buildingName;
    }

    if (details.buildingNumber !== '') {
      address.buildingNumber = details.buildingNumber;
    }

    if (details.dependentThoroughfareName !== '') {
      address.dependentThoroughfareName = details.dependentThoroughfareName;
    }

    if (details.dependentLocality !== '') {
      address.dependentLocality = details.dependentLocality;
    }

    if (details.postTown !== '') {
      address.postTown = details.postTown;
    }

    return address;
  },
  addressFormatterOverseas(details) {
    const address = {
      line1: details.addressLine1,
      country: details.country,
    };

    if (details.addressLine2 !== '') {
      address.line2 = details.addressLine2;
    }

    if (details.addressLine3 !== '') {
      address.line3 = details.addressLine3;
    }

    if (details.addressLine4 !== '') {
      address.line4 = details.addressLine4;
    }

    if (details.addressLine5 !== '') {
      address.line5 = details.addressLine5;
    }

    if (details.addressLine6 !== '') {
      address.line6 = details.addressLine6;
    }

    if (details.addressLine7 !== '') {
      address.line7 = details.addressLine7;
    }

    return address;
  },
  formatter(details, agentRefObject) {
    const json = {
      title: details.title,
      firstName: details.firstName,
      surname: details.surname,
      dob: `${details.dobYear}-${details.dobMonth}-${details.dobDay}T00:00:00.000Z`,
      dobVerification: details.dobV,
      gender: details.gender,
      nino: details.nino,
      inviteKey: details.inviteKey,
      agentRef: agentRefObject.username,
    };

    if (details.address === 'UK') {
      json.residentialAddress = this.addressFormatterUk(details);
    } else if (details.address === 'Overseas') {
      json.overseasAddress = this.addressFormatterOverseas(details);
    }
    return json;
  },
};
