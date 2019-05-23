module.exports = {
  validClaim() {
    return Object.assign({}, this.validBase(), this.validUkAddress(), this.validContact(), this.validAccountDetails());
  },
  validClaimContactNull(type) {
    if (type === 'home') {
      return Object.assign({}, this.validBase(), this.validUkAddress(), this.validContactHomeNull());
    } if (type === 'work') {
      return Object.assign({}, this.validBase(), this.validUkAddress(), this.validContactWorkNull());
    } if (type === 'mobile') {
      return Object.assign({}, this.validBase(), this.validUkAddress(), this.validContactMobileNull());
    } if (type === 'email') {
      return Object.assign({}, this.validBase(), this.validUkAddress(), this.validContactEmailNull());
    }
    return false;
  },
  validClaimAllAddressNotNull() {
    const { nino } = this.validBase();
    return Object.assign({}, this.validUkAddressNotNull(), { nino });
  },
  validClaimAllAddressNull() {
    const { nino } = this.validBase();
    return Object.assign({}, this.validUkAddressNull(), { nino });
  },
  validBase() {
    return {
      claimCreatedDate: '2018-11-09T12:27:48.795Z',
      claimFromDate: '2018-11-09T12:27:48.795Z',
      reCalculatedSpaDate: '2018-11-09T12:27:48.795Z',
      statePensionDate: '2018-11-09T12:27:48.795Z',
      inviteKey: 'BLOG123456',
      firstName: 'Joe',
      surname: 'Bloggs',
      dob: '1953-11-09T12:27:48.795Z',
      nino: 'AA370773A',
      paymentFrequency: '4W',
    };
  },
  validAccountDetails() {
    return {
      accountDetail: {
        accountHolder: 'Joe Bloggs',
        accountNumber: '12345678',
        sortCode: '112233',
        referenceNumber: '231231232',
      },
    };
  },
  validUkAddress() {
    return {
      residentialAddress: {
        buildingName: 'Building Name',
        subBuildingName: 'Sub Building Name',
        buildingNumber: 'Building Number',
        dependentLocality: 'Dependent Locality',
        dependentThoroughfareName: 'Dependent Thoroughfare Name',
        thoroughfareName: 'Thoroughfare Name',
        postCode: 'Post Code',
        postTown: 'Post Town',
      },
    };
  },
  validUkAddressNotNull() {
    return {
      buildingName: 'buildingName',
      subBuildingName: 'subBuildingName',
      buildingNumber: 148,
      dependentLocality: 'dependentLocality',
      thoroughfareName: 'PICCADILLY',
      dependentThoroughfareName: 'dependentThoroughfareName',
      postTown: 'LONDON',
      postCode: 'W1J 7NT',
      uprn: 10091853817,
    };
  },
  validUkAddressNull() {
    return {
      buildingName: null,
      subBuildingName: null,
      buildingNumber: null,
      dependentLocality: null,
      thoroughfareName: null,
      dependentThoroughfareName: null,
      postTown: null,
      postCode: null,
      uprn: 10091853817,
    };
  },
  validContact() {
    return {
      contactDetail: {
        email: 'a@b.com',
        homeTelephoneNumber: '0000000000',
        mobileTelephoneNumber: '1111111111',
        workTelephoneNumber: '2222222222',
      },
    };
  },
  validContactHomeNull() {
    const contact = Object.assign({}, this.validContact());
    contact.contactDetail.homeTelephoneNumber = null;
    return contact;
  },
  validContactWorkNull() {
    const contact = Object.assign({}, this.validContact());
    contact.contactDetail.workTelephoneNumber = null;
    return contact;
  },
  validContactMobileNull() {
    const contact = Object.assign({}, this.validContact());
    contact.contactDetail.mobileTelephoneNumber = null;
    return contact;
  },
  validContactEmailNull() {
    const contact = Object.assign({}, this.validContact());
    contact.contactDetail.email = null;
    return contact;
  },
  validPersonalDetailsViewData() {
    return {
      fullName: 'Joe Bloggs',
      nino: 'AA 37 07 73 A',
      dob: '09 November 1953',
      statePensionDate: '09 November 2018',
    };
  },
  validContactDetailsViewData() {
    return {
      address: [
        'Sub Building Name, Building Name',
        'Building Number Dependent Thoroughfare Name',
        'Thoroughfare Name',
        'Dependent Locality',
        'Post Town',
        'Post Code',
      ],
      homeTelephoneNumber: '0000000000',
      mobileTelephoneNumber: '1111111111',
      workTelephoneNumber: '2222222222',
      email: 'a@b.com',
    };
  },
  validSearchViewData() {
    return {
      result: {
        fullName: 'Joe Bloggs',
        nino: 'AA 37 07 73 A',
      },
    };
  },
  validAddressWithThoroughfare() {
    return Object.assign({}, this.validUkAddress().residentialAddress);
  },
  validAddressWithThoroughfareResult() {
    return [
      'Sub Building Name, Building Name',
      'Building Number Dependent Thoroughfare Name',
      'Thoroughfare Name',
      'Dependent Locality',
      'Post Town',
      'Post Code',
    ];
  },
  validAddressWithoutThoroughfare() {
    const address = Object.assign({}, this.validUkAddress().residentialAddress);
    address.thoroughfareName = null;
    return address;
  },
  validAddressWithoutThoroughfareResult() {
    return [
      'Sub Building Name, Building Name',
      'Building Number Dependent Locality',
      'Post Town',
      'Post Code',
    ];
  },
  validAddressSubBuildingNamebuildingName() {
    const address = Object.assign({}, this.validUkAddress().residentialAddress);
    address.buildingNumber = null;
    address.dependentLocality = null;
    address.dependentThoroughfareName = null;
    address.thoroughfareName = null;
    return address;
  },
  validAddressSubBuildingNamebuildingNameResult() {
    return [
      'Sub Building Name, Building Name',
      'Post Town',
      'Post Code',
    ];
  },
  validAddressSubBuildingName() {
    const address = Object.assign({}, this.validUkAddress().residentialAddress);
    address.buildingName = null;
    address.buildingNumber = null;
    address.dependentLocality = null;
    address.dependentThoroughfareName = null;
    address.thoroughfareName = null;
    return address;
  },
  validAddressSubBuildingNameResult() {
    return [
      'Sub Building Name',
      'Post Town',
      'Post Code',
    ];
  },
  validAddressBuildingName() {
    const address = Object.assign({}, this.validUkAddress().residentialAddress);
    address.subBuildingName = null;
    address.buildingNumber = null;
    address.dependentLocality = null;
    address.dependentThoroughfareName = null;
    address.thoroughfareName = null;
    return address;
  },
  validAddressBuildingNameResult() {
    return [
      'Building Name',
      'Post Town',
      'Post Code',
    ];
  },
  validAddressBuildingNameBuildingNumberDependentLocality() {
    const address = Object.assign({}, this.validUkAddress().residentialAddress);
    address.subBuildingName = null;
    address.dependentThoroughfareName = null;
    address.thoroughfareName = null;
    return address;
  },
  validAddressBuildingNameBuildingNumberDependentLocalityResult() {
    return [
      'Building Name',
      'Building Number Dependent Locality',
      'Post Town',
      'Post Code',
    ];
  },
  validAddressBuildingNumberDependentLocality() {
    const address = Object.assign({}, this.validUkAddress().residentialAddress);
    address.subBuildingName = null;
    address.buildingName = null;
    address.dependentThoroughfareName = null;
    address.thoroughfareName = null;
    return address;
  },
  validAddressBuildingNumberDependentLocalityResult() {
    return [
      'Building Number Dependent Locality',
      'Post Town',
      'Post Code',
    ];
  },
  validAddressDependentLocality() {
    const address = Object.assign({}, this.validUkAddress().residentialAddress);
    address.subBuildingName = null;
    address.buildingName = null;
    address.buildingNumber = null;
    address.dependentThoroughfareName = null;
    address.thoroughfareName = null;
    return address;
  },
  validAddressDependentLocalityResult() {
    return [
      'Dependent Locality',
      'Post Town',
      'Post Code',
    ];
  },
  validAddressBuildingNumber() {
    const address = Object.assign({}, this.validUkAddress().residentialAddress);
    address.subBuildingName = null;
    address.buildingName = null;
    address.dependentLocality = null;
    address.dependentThoroughfareName = null;
    address.thoroughfareName = null;
    return address;
  },
  validAddressBuildingNumberResult() {
    return [
      'Building Number',
      'Post Town',
      'Post Code',
    ];
  },
  validAddressSubBuildingNamebBuildingNameBuildingNumberThoroughfareName() {
    const address = Object.assign({}, this.validUkAddress().residentialAddress);
    address.dependentLocality = null;
    address.dependentThoroughfareName = null;
    return address;
  },
  validAddressSubBuildingNamebBuildingNameBuildingNumberThoroughfareNameResult() {
    return [
      'Sub Building Name, Building Name',
      'Building Number Thoroughfare Name',
      'Post Town',
      'Post Code',
    ];
  },
  validAddressSubBuildingNamebBuildingNameThoroughfareName() {
    const address = Object.assign({}, this.validUkAddress().residentialAddress);
    address.buildingNumber = null;
    address.dependentLocality = null;
    address.dependentThoroughfareName = null;
    return address;
  },
  validAddressSubBuildingNamebBuildingNameThoroughfareNameResult() {
    return [
      'Sub Building Name, Building Name',
      'Thoroughfare Name',
      'Post Town',
      'Post Code',
    ];
  },
  validAddressSubBuildingNamebThoroughfareName() {
    const address = Object.assign({}, this.validUkAddress().residentialAddress);
    address.buildingNumber = null;
    address.buildingName = null;
    address.dependentLocality = null;
    address.dependentThoroughfareName = null;
    return address;
  },
  validAddressSubBuildingNamebThoroughfareNameResult() {
    return [
      'Sub Building Name',
      'Thoroughfare Name',
      'Post Town',
      'Post Code',
    ];
  },
  validAddressBuildingNameThoroughfareName() {
    const address = Object.assign({}, this.validUkAddress().residentialAddress);
    address.subBuildingName = null;
    address.buildingNumber = null;
    address.dependentThoroughfareName = null;
    address.dependentLocality = null;
    return address;
  },
  validAddressBuildingNameThoroughfareNameResult() {
    return [
      'Building Name',
      'Thoroughfare Name',
      'Post Town',
      'Post Code',
    ];
  },
  validAddressDependentThoroughfareNameBuildingNumberThoroughfareName() {
    const address = Object.assign({}, this.validUkAddress().residentialAddress);
    address.buildingName = null;
    address.subBuildingName = null;
    return address;
  },
  validAddressDependentThoroughfareNameBuildingNumberThoroughfareNameResult() {
    return [
      'Building Number Dependent Thoroughfare Name',
      'Thoroughfare Name',
      'Dependent Locality',
      'Post Town',
      'Post Code',
    ];
  },
  validAddressBuildingNumberThoroughfareName() {
    const address = Object.assign({}, this.validUkAddress().residentialAddress);
    address.subBuildingName = null;
    address.buildingName = null;
    address.dependentThoroughfareName = null;
    address.dependentLocality = null;
    return address;
  },
  validAddressBuildingNumberThoroughfareNameResult() {
    return [
      'Building Number Thoroughfare Name',
      'Post Town',
      'Post Code',
    ];
  },
  validDependentThoroughfareNameBuildingNumber() {
    return {
      buildingNumber: 'Building Number',
      dependentThoroughfareName: 'Dependent Thoroughfare Name',
      thoroughfareName: 'Thoroughfare Name',
    };
  },
  validDependentThoroughfareNameBuildingNumberResult() {
    return [
      'Building Number Dependent Thoroughfare Name',
      'Thoroughfare Name',
    ];
  },
  validDependentThoroughfareName() {
    return {
      buildingNumber: null,
      dependentThoroughfareName: 'Dependent Thoroughfare Name',
      thoroughfareName: 'Thoroughfare Name',
    };
  },
  validDependentThoroughfareNameResult() {
    return [
      'Dependent Thoroughfare Name',
      'Thoroughfare Name',
    ];
  },
  validDependentThoroughfareNullAndBuildingNumberNull() {
    return {
      buildingNumber: null,
      dependentThoroughfareName: null,
      thoroughfareName: 'Thoroughfare Name',
    };
  },
  validDependentThoroughfareNullAndBuildingNumberNullResult() {
    return [
      'Thoroughfare Name',
    ];
  },
  validDependentThoroughfareNullAndBuildingNumber() {
    return {
      buildingNumber: 'Building Number',
      dependentThoroughfareName: null,
      thoroughfareName: 'Thoroughfare Name',
    };
  },
  validDependentThoroughfareNullAndBuildingNumberResult() {
    return [
      'Building Number Thoroughfare Name',
    ];
  },
};
