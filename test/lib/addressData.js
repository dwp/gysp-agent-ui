module.exports = {
  multipleAddresses() {
    return { ...this.addressBase() };
  },
  multipleAddressesNoneEmpty() {
    return { ...this.addressBaseNonEmpty() };
  },
  multipleAddressesAllEmpty() {
    return { ...this.addressBaseAllEmpty() };
  },
  singleAddress() {
    const address = { ...this.addressBase().addressResults[0] };
    return { addressResults: [address] };
  },
  multipleAddressesList() {
    return [{
      text: '2 addresses found',
    }, {
      value: 10091853817,
      text: '148 PICCADILLY, LONDON, W1J 7NT',
    }, {
      value: 10091853817,
      text: '149 PICCADILLY, LONDON, W1J 7NT',
    }];
  },
  singleAddressesList() {
    return [{
      text: '1 address found',
    }, {
      value: 10091853817,
      text: '148 PICCADILLY, LONDON, W1J 7NT',
    }];
  },
  addressBase() {
    return {
      addressResults: [{
        uprn: 10091853817,
        buildingNumber: 148,
        buildingName: '',
        subBuildingName: '',
        organisationName: '',
        dependentThoroughfareName: '',
        thoroughfareName: 'PICCADILLY',
        dependentLocality: '',
        posttown: 'LONDON',
        localAuthority: '',
        postcode: 'W1J 7NT',
        poBoxNumber: '',
        addressLineOne: '148 PICCADILLY',
        addressLineTwo: 'LONDON',
        addressLineThree: '',
        addressLineFour: '',
        address: '148 PICCADILLY, LONDON, W1J 7NT',
      }, {
        uprn: 10091853817,
        buildingNumber: 149,
        buildingName: '',
        subBuildingName: '',
        organisationName: '',
        dependentThoroughfareName: '',
        thoroughfareName: 'PICCADILLY',
        dependentLocality: '',
        posttown: 'LONDON',
        localAuthority: '',
        postcode: 'W1J 7NT',
        poBoxNumber: '',
        addressLineOne: '149 PICCADILLY',
        addressLineTwo: 'LONDON',
        addressLineThree: '',
        addressLineFour: '',
        address: '149 PICCADILLY, LONDON, W1J 7NT',
      }],
    };
  },
  addressBaseNonEmpty() {
    return {
      addressResults: [{
        uprn: 10091853817,
        buildingNumber: 148,
        buildingName: 'buildingName',
        subBuildingName: 'subBuildingName',
        organisationName: 'organisationName',
        dependentThoroughfareName: 'dependentThoroughfareName',
        thoroughfareName: 'PICCADILLY',
        dependentLocality: 'dependentLocality',
        posttown: 'LONDON',
        localAuthority: '',
        postcode: 'W1J 7NT',
        poBoxNumber: 'poBoxNumber',
        addressLineOne: '148 PICCADILLY',
        addressLineTwo: 'WHITLEY BAY',
        addressLineThree: 'addressLineThree',
        addressLineFour: 'addressLineFour',
        address: '148 PICCADILLY, LONDON, W1J 7NT',
      }, {
        uprn: 10091853817,
        buildingNumber: 149,
        buildingName: 'buildingName',
        subBuildingName: 'subBuildingName',
        organisationName: 'organisationName',
        dependentThoroughfareName: 'dependentThoroughfareName',
        thoroughfareName: 'PICCADILLY',
        dependentLocality: 'dependentLocality',
        posttown: 'LONDON',
        localAuthority: '',
        postcode: 'W1J 7NT',
        poBoxNumber: 'poBoxNumber',
        addressLineOne: '149 PICCADILLY',
        addressLineTwo: 'LONDON',
        addressLineThree: 'addressLineThree',
        addressLineFour: 'addressLineFour',
        address: '149 PICCADILLY, LONDON, W1J 7NT',
      }],
    };
  },
  addressBaseAllEmpty() {
    return {
      addressResults: [{
        uprn: 10091853817,
        buildingNumber: '',
        buildingName: '',
        subBuildingName: '',
        organisationName: '',
        dependentThoroughfareName: '',
        thoroughfareName: '',
        dependentLocality: '',
        posttown: '',
        localAuthority: '',
        postcode: '',
        poBoxNumber: '',
        addressLineOne: '',
        addressLineTwo: '',
        addressLineThree: '',
        addressLineFour: '',
        address: '148 PICCADILLY, LONDON, W1J 7NT',
      }, {
        uprn: 10091853817,
        buildingNumber: '',
        buildingName: '',
        subBuildingName: '',
        organisationName: '',
        dependentThoroughfareName: '',
        thoroughfareName: '',
        dependentLocality: '',
        posttown: '',
        localAuthority: '',
        postcode: '',
        poBoxNumber: '',
        addressLineOne: '',
        addressLineTwo: '',
        addressLineThree: '',
        addressLineFour: '',
        address: '149 PICCADILLY, LONDON, W1J 7NT',
      }],
    };
  },
};
