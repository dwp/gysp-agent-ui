module.exports = {
  validTitles() {
    return ['Mr', 'Mrs', 'Miss', 'Ms', 'Dr', 'Rev'];
  },
  validPost() {
    return Object.assign(this.validBase(), this.validUKaddress());
  },
  validPostWithEmptyBuildingNumber() {
    const validUKaddress = this.validUKaddress();
    validUKaddress.buildingNumber = '';
    return Object.assign(this.validBase(), validUKaddress);
  },
  validPostWithEmptyBuildingName() {
    const validUKaddress = this.validUKaddress();
    validUKaddress.buildingName = '';
    return Object.assign(this.validBase(), validUKaddress);
  },
  validPostOverseas() {
    return Object.assign(this.validBase(), this.validAddressOverseas());
  },
  emptyPost() {
    return Object.assign(this.emptyBase(), this.emptyAddressUK());
  },
  emptyPostOverseas() {
    return Object.assign(this.emptyBase(), this.emptyAddressOverseas());
  },
  fieldData() {
    return {
      empty: '',
      oneCharacter: 'A',
      seventyFourCharacters: 'Qwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwer',
      invalidStart: 'test',
      invalidCharacter: 'Test@',
    };
  },
  validBase() {
    return {
      title: 'Mr',
      firstName: 'Joe',
      surname: 'Bloggs',
      nino: 'AA370773A',
      dobDay: 1,
      dobMonth: 12,
      dobYear: 1955,
      dobV: 'V',
      gender: 'Male',
    };
  },
  validUKaddress() {
    return {
      address: 'UK',
      subBuildingName: 'Sub Building Name 1',
      buildingName: 'Building Name 1',
      buildingNumber: 'Building Number 1',
      dependentThoroughfareName: 'Dependent Thoroughfare Name 1',
      thoroughfareName: 'Thoroughfare Name 1',
      dependentLocality: 'Dependent Locality 1',
      postTown: 'Post Town 1',
      postCode: 'NN3 3NN',
    };
  },
  emptyBase() {
    return {
      title: '',
      firstName: '',
      surname: '',
      nino: '',
      dobDay: '',
      dobMonth: '',
      dobYear: '',
      gender: '',
    };
  },
  emptyAddressUK() {
    return {
      address: 'UK',
      subBuildingName: '',
      buildingName: '',
      buildingNumber: '',
      dependentThoroughfareName: '',
      thoroughfareName: '',
      dependentLocality: '',
      postTown: '',
      postCode: '',
    };
  },
  emptyAddressOverseas() {
    return {
      address: 'Overseas',
      addressLine1: '',
      addressLine2: '',
      addressLine3: '',
      addressLine4: '',
      addressLine5: '',
      addressLine6: '',
      addressLine7: '',
      country: '',
    };
  },
  validAddressOverseas() {
    return {
      address: 'Overseas',
      addressLine1: 'Address Line 1',
      addressLine2: 'Address Line 2',
      addressLine3: 'Address Line 3',
      addressLine4: 'Address Line 4',
      addressLine5: 'Address Line 5',
      addressLine6: 'Address Line 6',
      addressLine7: 'Address Line 7',
      country: 'Country',
    };
  },
  longAddressOverseas() {
    return {
      address: 'Overseas',
      addressLine1: 'Qwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwer',
      addressLine2: 'Qwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwer',
      addressLine3: 'Qwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwer',
      addressLine4: 'Qwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwer',
      addressLine5: 'Qwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwer',
      addressLine6: 'Qwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwer',
      addressLine7: 'Qwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwer',
      country: 'Qwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwer',
    };
  },
  longAddressEU() {
    return {
      address: 'UK',
      subBuildingName: 'Qwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwer',
      buildingName: 'Qwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwer',
      buildingNumber: 'Qwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwer',
      dependentThoroughfareName: 'Qwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwer',
      thoroughfareName: 'Qwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwer',
      dependentLocality: 'Qwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwer',
      postTown: 'Qwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwer',
      postCode: 'Qwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwer',
    };
  },
};
