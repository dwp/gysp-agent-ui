module.exports = {
  validClaim() {
    return {
      ...this.validBase(), ...this.validUkAddress(), ...this.validContact(), ...this.validAccountDetails(), ...this.validAwardAmountDetails(),
    };
  },
  validClaimWithDeathVerified() {
    const base = { ...this.validBase() };
    base.awardStatus = 'DEAD';
    return {
      ...base, ...this.validDeathVerified(), ...this.validUkAddress(), ...this.validContact(), ...this.validAccountDetails(),
    };
  },
  validClaimWithDeathNotVerified() {
    const base = { ...this.validBase() };
    base.awardStatus = 'DEADNOTVERIFIED';
    return {
      ...base, ...this.validDeathNotVerified(), ...this.validUkAddress(), ...this.validContact(), ...this.validAccountDetails(),
    };
  },
  validClaimContactNull(type) {
    if (type === 'home') {
      return { ...this.validBase(), ...this.validUkAddress(), ...this.validContactHomeNull() };
    } if (type === 'work') {
      return { ...this.validBase(), ...this.validUkAddress(), ...this.validContactWorkNull() };
    } if (type === 'mobile') {
      return { ...this.validBase(), ...this.validUkAddress(), ...this.validContactMobileNull() };
    } if (type === 'email') {
      return { ...this.validBase(), ...this.validUkAddress(), ...this.validContactEmailNull() };
    }
    return false;
  },
  validAddressEventChangeTimeline() {
    return {
      eventCategory: 'CONTACT',
      eventType: 'CHANGE',
      eventName: 'address:timeline.address.changed',
    };
  },
  validClaimAllAddressNotNull() {
    const { nino } = this.validBase();
    return { ...this.validUkAddressNotNull(), nino, ...this.validAddressEventChangeTimeline() };
  },
  validClaimAllAddressNull() {
    const { nino } = this.validBase();
    return { ...this.validUkAddressNull(), nino, ...this.validAddressEventChangeTimeline() };
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
      awardStatus: 'INPAYMENT',
    };
  },
  validDeathVerified() {
    return {
      dateOfDeath: '2019-01-01T00:00:00.000Z',
      dateOfDeathVerification: 'V',
    };
  },
  validDeathNotVerified() {
    return {
      dateOfDeath: '2019-01-01T00:00:00.000Z',
      dateOfDeathVerification: 'NV',
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
  validAwardAmountDetails() {
    return {
      awardAmounts: [{
        totalAmount: 110.0,
        weeklyStatePensionAmount: 100.0,
        weeklyProtectedPaymentAmount: 10.0,
        weeklyExtraStatePensionAmount: 0.0,
        weeklyInheritedExtraStatePensionAmount: 0.0,
        fromDate: 1551830400000,
        toDate: null,
        reasonCode: 'FIRSTAWARD',
        inPayment: true,
      }],
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
    const contact = { ...this.validContact() };
    contact.contactDetail.homeTelephoneNumber = null;
    return contact;
  },
  validContactWorkNull() {
    const contact = { ...this.validContact() };
    contact.contactDetail.workTelephoneNumber = null;
    return contact;
  },
  validContactMobileNull() {
    const contact = { ...this.validContact() };
    contact.contactDetail.mobileTelephoneNumber = null;
    return contact;
  },
  validContactEmailNull() {
    const contact = { ...this.validContact() };
    contact.contactDetail.email = null;
    return contact;
  },
  validPersonalDetailsViewData() {
    return {
      fullName: 'Joe Bloggs',
      nino: 'AA 37 07 73 A',
      dob: '9 November 1953',
      statePensionDate: '9 November 2018',
    };
  },
  validClaimWithDeathVerifiedData() {
    return {
      fullName: 'Joe Bloggs',
      nino: 'AA 37 07 73 A',
      dob: '9 November 1953',
      statePensionDate: '9 November 2018',
      dateOfDeath: '1 January 2019',
      dateOfDeathVerification: 'Verified',
    };
  },
  validClaimWithDeathNotVerifiedData() {
    return {
      fullName: 'Joe Bloggs',
      nino: 'AA 37 07 73 A',
      dob: '9 November 1953',
      statePensionDate: '9 November 2018',
      dateOfDeath: '1 January 2019',
      dateOfDeathVerification: 'Not verified',
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
  validAwardListViewData() {
    return {
      firstCellIsHeader: false,
      head: [
        { text: 'award-list:table.head.from', classes: 'govuk-!-width-one-quarter' },
        { text: 'award-list:table.head.to', classes: 'govuk-!-width-one-quarter' },
        { text: 'award-list:table.head.weekly-amount' },
        { text: '' },
        { text: '' },
      ],
      rows: [
        [
          { text: '6 March 2019' },
          { text: '' },
          { text: '£110.00' },
          { html: '<a href="/changes-and-enquiries/award/0" class="govuk-link">Details</a>' },
          { html: '<span class="govuk-!-font-size-16 govuk-!-font-weight-bold gysp-secondary-text-colour gysp-payment gysp-payment--active">In Payment</span>' },
        ],
      ],
    };
  },
  validAwardDetailsViewData() {
    return {
      detailsSummaryRows: [{
        key: { text: 'award-detail:summary-keys.from', classes: 'govuk-!-width-two-thirds' },
        value: { text: '6 March 2019' },
      }, {
        key: { text: 'award-detail:summary-keys.reason', classes: 'govuk-!-width-two-thirds' },
        value: { text: 'award-detail:summary-values.reason.first-award' },
      }],
      amountSummaryRows: [{
        key: { text: 'award-detail:summary-keys.total', classes: 'govuk-!-width-two-thirds govuk-!-font-weight-bold' },
        value: { text: '£110.00 a week', classes: 'govuk-!-font-weight-bold' },
      }, {
        key: { text: 'award-detail:summary-keys.new-state-pension', classes: 'govuk-!-width-two-thirds govuk-!-font-weight-regular' },
        value: { text: '£100.00' },
      }, {
        key: { text: 'award-detail:summary-keys.protected-payment', classes: 'govuk-!-width-two-thirds govuk-!-font-weight-regular' },
        value: { text: '£10.00' },
      }, {
        key: { text: 'award-detail:summary-keys.extra-state-pension', classes: 'govuk-!-width-two-thirds govuk-!-font-weight-regular' },
        value: { text: '£0.00' },
      }, {
        key: { text: 'award-detail:summary-keys.inherited-extra-state-pension', classes: 'govuk-!-width-two-thirds govuk-!-font-weight-regular' },
        value: { text: '£0.00' },
      }],
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
    return { ...this.validUkAddress().residentialAddress };
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
    const address = { ...this.validUkAddress().residentialAddress };
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
    const address = { ...this.validUkAddress().residentialAddress };
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
    const address = { ...this.validUkAddress().residentialAddress };
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
    const address = { ...this.validUkAddress().residentialAddress };
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
    const address = { ...this.validUkAddress().residentialAddress };
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
    const address = { ...this.validUkAddress().residentialAddress };
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
    const address = { ...this.validUkAddress().residentialAddress };
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
    const address = { ...this.validUkAddress().residentialAddress };
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
    const address = { ...this.validUkAddress().residentialAddress };
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
    const address = { ...this.validUkAddress().residentialAddress };
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
    const address = { ...this.validUkAddress().residentialAddress };
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
    const address = { ...this.validUkAddress().residentialAddress };
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
    const address = { ...this.validUkAddress().residentialAddress };
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
    const address = { ...this.validUkAddress().residentialAddress };
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
