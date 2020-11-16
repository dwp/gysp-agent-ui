module.exports = {
  validClaim() {
    return {
      ...this.validBase(), ...this.validUkAddress(), ...this.validContact(), ...this.validAccountDetails(), ...this.validAwardAmountDetails(), ...this.validMaritalSingle(),
    };
  },
  validClaimWithDeathVerified() {
    const base = { ...this.validBase() };
    base.awardStatus = 'DEAD';
    return {
      ...base, ...this.validDeathVerified(), ...this.validUkAddress(), ...this.validContact(), ...this.validAccountDetails(), ...this.validMaritalSingle(),
    };
  },
  validClaimWithDeathArrearsDue() {
    const base = { ...this.validBase() };
    base.awardStatus = 'DEAD';
    return {
      ...base, ...this.validDeathVerifiedArrears(), ...this.validUkAddress(), ...this.validContact(), ...this.validAccountDetails(), ...this.validMaritalSingle(),
    };
  },
  validClaimWithDeathNotVerified() {
    const base = { ...this.validBase() };
    base.awardStatus = 'DEADNOTVERIFIED';
    return {
      ...base, ...this.validDeathNotVerified(), ...this.validUkAddress(), ...this.validContact(), ...this.validAccountDetails(), ...this.validMaritalSingle(),
    };
  },
  validClaimWithDeferral() {
    const base = { ...this.validBase() };
    base.awardStatus = 'DEFERRED';
    return {
      ...base, ...this.validUkAddress(), ...this.validContact(), ...this.validAccountDetails(), ...this.validAwardAmountDetails(), ...this.validMaritalSingle(),
    };
  },
  validClaimSingle() {
    return {
      ...this.validBase(), ...this.validUkAddress(), ...this.validContact(), ...this.validAccountDetails(), ...this.validAwardAmountDetails(), ...this.validMaritalSingle(),
    };
  },
  validClaimNoSpouseDob() {
    return {
      ...this.validBase(), ...this.validUkAddress(), ...this.validContact(), ...this.validAccountDetails(), ...this.validAwardAmountDetails(), ...this.noSpouseDob(),
    };
  },
  validClaimSpouseDobVerified() {
    return {
      ...this.validBase(), ...this.validUkAddress(), ...this.validContact(), ...this.validAccountDetails(), ...this.validAwardAmountDetails(), ...this.spouseDobVerified(),
    };
  },
  validClaimMarried() {
    return {
      ...this.validBase(), ...this.validUkAddress(), ...this.validContact(), ...this.validAccountDetails(), ...this.validAwardAmountDetails(), ...this.validMaritalMarried(),
    };
  },
  validClaimMarriedVerified() {
    return {
      ...this.validBase(), ...this.validUkAddress(), ...this.validContact(), ...this.validAccountDetails(), ...this.validAwardAmountDetails(), ...this.validMaritalMarriedVerified(),
    };
  },
  validClaimCivilPartner() {
    return {
      ...this.validBase(), ...this.validUkAddress(), ...this.validContact(), ...this.validAccountDetails(), ...this.validAwardAmountDetails(), ...this.validMaritalCivilPartnership(),
    };
  },
  validClaimDivorced() {
    return {
      ...this.validBase(), ...this.validUkAddress(), ...this.validContact(), ...this.validAccountDetails(), ...this.validAwardAmountDetails(), ...this.validMaritalDivorced(),
    };
  },
  validClaimDissolved() {
    return {
      ...this.validBase(), ...this.validUkAddress(), ...this.validContact(), ...this.validAccountDetails(), ...this.validAwardAmountDetails(), ...this.validMaritalDissolved(),
    };
  },
  validClaimWidowed() {
    return {
      ...this.validBase(), ...this.validUkAddress(), ...this.validContact(), ...this.validAccountDetails(), ...this.validAwardAmountDetails(), ...this.validMaritalWidowed(),
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
  validClaimNullContact() {
    return {
      ...this.validBase(), ...this.validUkAddress(), ...this.validContactAllNull(), ...this.validAccountDetails(), ...this.validAwardAmountDetails(), ...this.validMaritalSingle(),
    };
  },
  validClaimWithFutureUprating() {
    return {
      ...this.validBase(), ...this.validUkAddress(), ...this.validContact(), ...this.validAccountDetails(), ...this.validAwardAmountDetailsWithCurrentAndFutureUprating(),
    };
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
  validClaimAllAddressWithLocalAuthorityData() {
    const { nino } = this.validBase();
    return { ...this.validUkAddressLocalAuthorityData(), nino, ...this.validAddressEventChangeTimeline() };
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
      deathDetail: {
        dateOfDeath: 1546300800000,
        dateOfDeathVerification: 'V',
      },
    };
  },
  validDeathNotVerified() {
    return {
      deathDetail: {
        dateOfDeath: 1546300800000,
        dateOfDeathVerification: 'NV',
        payeeDetails: {
          fullName: 'Brenda',
          phoneNumber: '23213131',
          payeeAddress: { },
          accountDetail: null,
        },
      },
    };
  },
  validDeathVerifiedArrears() {
    return {
      deathDetail: {
        dateOfDeath: '2019-01-01T00:00:00.000Z',
        dateOfDeathVerification: 'V',
        amountDetails: {
          amount: 100.0,
        },
        payeeDetails: {
          fullName: 'Adam Dennis',
          phoneNumber: '0234 1234567',
          payeeAddress: {
            buildingName: null,
            buildingNumber: '2',
            dependentLocality: null,
            dependentThoroughfareName: null,
            postCode: 'LO1 1TY',
            postTown: 'LONDON',
            subBuildingName: null,
            thoroughfareName: 'TEST WAY',
            uprn: '1230004234234',
          },
          accountDetail: null,
        },
      },
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
  validMaritalSingle() {
    return {
      maritalStatus: 'Single',
      partnerDetail: null,
    };
  },
  noSpouseDob() {
    return {
      maritalStatus: 'Married',
      maritalStatusVerified: false,
      partnerDetail: {
        firstName: 'Jane',
        surname: 'Bloggs',
        allOtherNames: 'Middle',
        marriageDate: '2000-03-19T00:00:00.000Z',
        partnerNino: 'AA123456C',
      },
    };
  },
  spouseDobVerified() {
    return {
      maritalStatus: 'Married',
      maritalStatusVerified: false,
      partnerDetail: {
        firstName: 'Jane',
        surname: 'Bloggs',
        allOtherNames: 'Middle',
        dob: '1952-03-19T00:00:00.000Z',
        dobVerified: true,
        marriageDate: '2000-03-19T00:00:00.000Z',
        partnerNino: 'AA123456C',
      },
    };
  },
  validMaritalMarried() {
    return {
      maritalStatus: 'Married',
      maritalStatusVerified: false,
      partnerDetail: {
        firstName: 'Jane',
        surname: 'Bloggs',
        allOtherNames: 'Middle',
        dob: '1952-03-19T00:00:00.000Z',
        dobVerified: false,
        marriageDate: '2000-03-19T00:00:00.000Z',
        partnerNino: 'AA123456C',
      },
    };
  },
  validMaritalMarriedVerified() {
    return {
      maritalStatus: 'Married',
      maritalStatusVerified: true,
      partnerDetail: {
        firstName: 'Jane',
        surname: 'Bloggs',
        allOtherNames: 'Middle',
        dob: '1952-03-19T00:00:00.000Z',
        dobVerified: false,
        marriageDate: '2000-03-19T00:00:00.000Z',
      },
    };
  },
  validMaritalCivilPartnership() {
    return {
      maritalStatus: 'Civil Partnership',
      maritalStatusVerified: false,
      partnerDetail: {
        firstName: 'Jane',
        surname: 'Bloggs',
        allOtherNames: 'Middle',
        dob: '1952-03-19T00:00:00.000Z',
        dobVerified: false,
        civilPartnershipDate: '2000-03-19T00:00:00.000Z',
        partnerNino: 'AA123456C',
      },
    };
  },
  validMaritalDivorced() {
    return {
      maritalStatus: 'Divorced',
      partnerDetail: {
        firstName: 'Jane',
        surname: 'Bloggs',
        allOtherNames: 'Middle',
        dob: '1952-03-19T00:00:00.000Z',
        divorcedDate: '2000-03-19T00:00:00.000Z',
      },
    };
  },
  validMaritalDissolved() {
    return {
      maritalStatus: 'Dissolved',
      partnerDetail: {
        firstName: 'Jane',
        surname: 'Bloggs',
        allOtherNames: 'Middle',
        dob: '1952-03-19T00:00:00.000Z',
        dissolvedDate: '2000-03-19T00:00:00.000Z',
      },
    };
  },
  validMaritalWidowed() {
    return {
      maritalStatus: 'Widowed',
      maritalStatusVerified: true,
      partnerDetail: {
        firstName: 'Jane',
        surname: 'Bloggs',
        allOtherNames: 'Middle',
        dob: '1952-03-19T00:00:00.000Z',
        widowedDate: '2000-03-19T00:00:00.000Z',
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
  validAwardAmountDetailsFutureUprating() {
    return {
      awardAmounts: [{
        totalAmount: 160.0,
        weeklyStatePensionAmount: 110.0,
        weeklyProtectedPaymentAmount: 20.0,
        weeklyExtraStatePensionAmount: 0.0,
        weeklyInheritedExtraStatePensionAmount: 0.0,
        fromDate: 1551830400000,
        toDate: null,
        reasonCode: 'ANNUALUPRATING',
        inPayment: false,
      }],
    };
  },
  validAwardAmountDetailsFutureUpratingIsCurrent() {
    return {
      awardAmounts: [{
        totalAmount: 160.0,
        weeklyStatePensionAmount: 110.0,
        weeklyProtectedPaymentAmount: 20.0,
        weeklyExtraStatePensionAmount: 0.0,
        weeklyInheritedExtraStatePensionAmount: 0.0,
        fromDate: 1551830400000,
        toDate: null,
        reasonCode: 'ANNUALUPRATING',
        inPayment: true,
      }],
    };
  },
  validAwardAmountDetailsWithCurrentAndFutureUprating() {
    return {
      awardAmounts: [
        {
          totalAmount: 160.0,
          weeklyStatePensionAmount: 150.0,
          weeklyProtectedPaymentAmount: 20.0,
          weeklyExtraStatePensionAmount: 0.0,
          weeklyInheritedExtraStatePensionAmount: 0.0,
          fromDate: 1551830400000,
          toDate: null,
          reasonCode: 'ANNUALUPRATING',
          inPayment: false,
        },
        {
          totalAmount: 110.0,
          weeklyStatePensionAmount: 100.0,
          weeklyProtectedPaymentAmount: 10.0,
          weeklyExtraStatePensionAmount: 0.0,
          weeklyInheritedExtraStatePensionAmount: 0.0,
          fromDate: 1551830400000,
          toDate: 1551830400000,
          reasonCode: 'FIRSTAWARD',
          inPayment: true,
        },
      ],
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
      singleLine: '148 PICCADILLY, LONDON, W1J 7NT',
      uprn: '10091853817',
    };
  },
  validUkAddressLocalAuthorityData() {
    return {
      buildingName: 'Name',
      subBuildingName: '1/L',
      buildingNumber: 1,
      dependentLocality: 'dependentLocality',
      thoroughfareName: 'MAIN STREET',
      dependentThoroughfareName: 'WINDSOR PLACE',
      postTown: 'BRIDGE OF WEIR',
      postCode: 'PA11 3AF',
      singleLine: '1/L 1 WINDSOR PLACE, MAIN STREET, BRIDGE OF WEIR, PA11 3AF',
      uprn: '10091853817',
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
      singleLine: null,
      uprn: '10091853817',
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
  validContactAllNull() {
    return {
      contactDetail: {
        email: null,
        homeTelephoneNumber: null,
        mobileTelephoneNumber: null,
        workTelephoneNumber: null,
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
      maritalStatus: 'Never been married',
      showMaritalStatusDetails: false,
      enableStopStatePension: true,
      warning: null,
    };
  },
  validPersonalDetailsMarriedViewData() {
    return {
      fullName: 'Joe Bloggs',
      nino: 'AA 37 07 73 A',
      dob: '9 November 1953',
      statePensionDate: '9 November 2018',
      maritalStatus: 'Married',
      showMaritalStatusDetails: true,
      enableStopStatePension: true,
      warning: null,
    };
  },
  validClaimWithDeathVerifiedData() {
    return {
      fullName: 'Joe Bloggs',
      nino: 'AA 37 07 73 A',
      dob: '9 November 1953',
      statePensionDate: '9 November 2018',
      maritalStatus: 'Never been married',
      showMaritalStatusDetails: false,
      enableStopStatePension: false,
      dateOfDeath: '1 January 2019',
      dateOfDeathVerification: 'Verified',
      warning: null,
    };
  },
  validClaimWithDeathNotVerifiedData() {
    return {
      fullName: 'Joe Bloggs',
      nino: 'AA 37 07 73 A',
      dob: '9 November 1953',
      statePensionDate: '9 November 2018',
      maritalStatus: 'Never been married',
      showMaritalStatusDetails: false,
      enableStopStatePension: false,
      dateOfDeath: '1 January 2019',
      dateOfDeathVerification: 'Not verified',
      warning: {
        html: 'Date of death awaiting verification<br /><a href="&#x2F;changes-and-enquiries&#x2F;personal&#x2F;death&#x2F;verify" class="govuk-link govuk-link--no-visited-state">Verify date of death</a>',
      },
    };
  },
  validClaimWithDeathVerifiedArrearsData() {
    return {
      fullName: 'Joe Bloggs',
      nino: 'AA 37 07 73 A',
      dob: '9 November 1953',
      statePensionDate: '9 November 2018',
      maritalStatus: 'Never been married',
      showMaritalStatusDetails: false,
      enableStopStatePension: false,
      warning: null,
      dateOfDeath: '1 January 2019',
      deathArrearsAmount: '£100.00',
      dateOfDeathVerification: 'Verified',
    };
  },
  validContactDetailsViewData() {
    return [{
      key: { text: 'Address', classes: 'govuk-!-width-two-thirds' },
      value: { html: 'Sub Building Name, Building Name<br />Building Number Dependent Thoroughfare Name<br />Thoroughfare Name<br />Dependent Locality<br />Post Town<br />Post Code' },
      actions: {
        items: [{
          href: '/changes-and-enquiries/address',
          text: 'Change',
          visuallyHiddenText: 'address',
          classes: 'govuk-link--no-visited-state',
        }],
      },
    }, {
      key: { text: 'Home phone number', classes: 'govuk-!-width-two-thirds' },
      value: { text: '0000000000' },
      actions: {
        items: [{
          href: '/changes-and-enquiries/contact/home',
          text: 'Change',
          visuallyHiddenText: 'home phone number',
          classes: 'govuk-link--no-visited-state',
        }],
      },
    }, {
      key: { text: 'Work phone number', classes: 'govuk-!-width-two-thirds' },
      value: { text: '2222222222' },
      actions: {
        items: [{
          href: '/changes-and-enquiries/contact/work',
          text: 'Change',
          visuallyHiddenText: 'work phone number',
          classes: 'govuk-link--no-visited-state',
        }],
      },
    }, {
      key: { text: 'Mobile phone number', classes: 'govuk-!-width-two-thirds' },
      value: { text: '1111111111' },
      actions: {
        items: [{
          href: '/changes-and-enquiries/contact/mobile',
          text: 'Change',
          visuallyHiddenText: 'mobile phone number',
          classes: 'govuk-link--no-visited-state',
        }],
      },
    }, {
      key: { text: 'Email address', classes: 'govuk-!-width-two-thirds' },
      value: { text: 'a@b.com' },
      actions: {
        items: [{
          href: '/changes-and-enquiries/contact/email',
          text: 'Change',
          visuallyHiddenText: 'email address',
          classes: 'govuk-link--no-visited-state',
        }],
      },
    }];
  },
  validContactDetailsAddViewData() {
    return [{
      key: { text: 'Address', classes: 'govuk-!-width-two-thirds' },
      value: { html: 'Sub Building Name, Building Name<br />Building Number Dependent Thoroughfare Name<br />Thoroughfare Name<br />Dependent Locality<br />Post Town<br />Post Code' },
      actions: {
        items: [{
          href: '/changes-and-enquiries/address',
          text: 'Change',
          visuallyHiddenText: 'address',
          classes: 'govuk-link--no-visited-state',
        }],
      },
    }, {
      key: { text: 'Home phone number', classes: 'govuk-!-width-two-thirds' },
      value: { text: '' },
      actions: {
        items: [{
          href: '/changes-and-enquiries/contact/home',
          text: 'Add',
          visuallyHiddenText: 'home phone number',
          classes: 'govuk-link--no-visited-state',
        }],
      },
    }, {
      key: { text: 'Work phone number', classes: 'govuk-!-width-two-thirds' },
      value: { text: '' },
      actions: {
        items: [{
          href: '/changes-and-enquiries/contact/work',
          text: 'Add',
          visuallyHiddenText: 'work phone number',
          classes: 'govuk-link--no-visited-state',
        }],
      },
    }, {
      key: { text: 'Mobile phone number', classes: 'govuk-!-width-two-thirds' },
      value: { text: '' },
      actions: {
        items: [{
          href: '/changes-and-enquiries/contact/mobile',
          text: 'Add',
          visuallyHiddenText: 'mobile phone number',
          classes: 'govuk-link--no-visited-state',
        }],
      },
    }, {
      key: { text: 'Email address', classes: 'govuk-!-width-two-thirds' },
      value: { text: '' },
      actions: {
        items: [{
          href: '/changes-and-enquiries/contact/email',
          text: 'Add',
          visuallyHiddenText: 'email address',
          classes: 'govuk-link--no-visited-state',
        }],
      },
    }];
  },

  validAwardListViewData() {
    return {
      banner: null,
      table: {
        firstCellIsHeader: false,
        head: [
          { text: 'From', classes: 'govuk-!-width-one-third' },
          { text: 'Weekly amount' },
          { text: '' },
          { text: '' },
        ],
        rows: [
          [
            { text: '6 March 2019' },
            { text: '£110.00' },
            { html: '<a href="/changes-and-enquiries/award/0" class="govuk-link">Details</a>' },
            { html: '<span class="govuk-!-font-size-16 govuk-!-font-weight-bold gysp-secondary-text-colour gysp-payment gysp-payment--active">In payment</span>' },
          ],
        ],
      },
    };
  },

  validAwardListViewDataWithFutureUprating() {
    return {
      banner: { text: 'This award will increase on 6 March 2019', link: 'View new award' },
      table: {
        firstCellIsHeader: false,
        head: [
          { text: 'From', classes: 'govuk-!-width-one-third' },
          { text: 'Weekly amount' },
          { text: '' },
          { text: '' },
        ],
        rows: [
          [
            { text: '6 March 2019' },
            { text: '£110.00' },
            { html: '<a href="/changes-and-enquiries/award/1" class="govuk-link">Details</a>' },
            { html: '<span class="govuk-!-font-size-16 govuk-!-font-weight-bold gysp-secondary-text-colour gysp-payment gysp-payment--active">In payment</span>' },
          ],
        ],
      },
    };
  },

  validAwardDetailsViewData() {
    return {
      isNewAward: false,
      header: 'Current State Pension award',
      detailsSummaryRows: [
        {
          key: { text: 'From', classes: 'govuk-!-width-two-thirds' },
          value: { text: '6 March 2019' },
        },
        {
          key: { text: 'Reason', classes: 'govuk-!-width-two-thirds' },
          value: { text: 'First award' },
        },
      ],
      amountSummaryRows: [
        {
          key: { text: 'Total', classes: 'govuk-!-width-two-thirds govuk-!-font-weight-bold' },
          value: { text: '£110.00 a week', classes: 'govuk-!-font-weight-bold' },
        },
        {
          key: { text: 'New State Pension', classes: 'govuk-!-width-two-thirds govuk-!-font-weight-regular' },
          value: { text: '£100.00' },
        },
        {
          key: { text: 'Protected payment', classes: 'govuk-!-width-two-thirds govuk-!-font-weight-regular' },
          value: { text: '£10.00' },
        },
        {
          key: { text: 'Extra State Pension', classes: 'govuk-!-width-two-thirds govuk-!-font-weight-regular' },
          value: { text: '£0.00' },
        },
        {
          key: { text: 'Inherited extra State Pension', classes: 'govuk-!-width-two-thirds govuk-!-font-weight-regular' },
          value: { text: '£0.00' },
        },
      ],
    };
  },

  validAwardDetailsViewDataWithUprating() {
    return {
      isNewAward: true,
      header: 'New State Pension award',
      detailsSummaryRows: [
        {
          key: { text: 'From', classes: 'govuk-!-width-two-thirds' },
          value: { text: '6 March 2019' },
        },
        {
          key: { text: 'Reason', classes: 'govuk-!-width-two-thirds' },
          value: { text: 'Annual uprating' },
        }],
      amountSummaryRows: [
        {
          key: { text: 'Total', classes: 'govuk-!-width-two-thirds govuk-!-font-weight-bold' },
          value: { text: '£160.00 a week', classes: 'govuk-!-font-weight-bold' },
        },
        {
          key: { text: 'New State Pension', classes: 'govuk-!-width-two-thirds govuk-!-font-weight-regular' },
          value: { text: '£150.00' },
        },
        {
          key: { text: 'Protected payment', classes: 'govuk-!-width-two-thirds govuk-!-font-weight-regular' },
          value: { text: '£20.00' },
        },
        {
          key: { text: 'Extra State Pension', classes: 'govuk-!-width-two-thirds govuk-!-font-weight-regular' },
          value: { text: '£0.00' },
        },
        {
          key: { text: 'Inherited extra State Pension', classes: 'govuk-!-width-two-thirds govuk-!-font-weight-regular' },
          value: { text: '£0.00' },
        },
      ],
    };
  },

  validAwardDetailsViewDataWithUpratingWithFrequencyAmount() {
    return {
      isNewAward: true,
      header: 'New State Pension award',
      detailsSummaryRows: [
        {
          key: { text: 'From', classes: 'govuk-!-width-two-thirds' },
          value: { text: '6 March 2019' },
        },
        {
          key: { text: '4 weekly amount', classes: 'govuk-!-width-two-thirds' },
          value: { text: '£640.00' },
        },
        {
          key: { text: 'Reason', classes: 'govuk-!-width-two-thirds' },
          value: { text: 'Annual uprating' },
        },
      ],
      amountSummaryRows: [
        {
          key: { text: 'Total', classes: 'govuk-!-width-two-thirds govuk-!-font-weight-bold' },
          value: { text: '£160.00 a week', classes: 'govuk-!-font-weight-bold' },
        },
        {
          key: { text: 'New State Pension', classes: 'govuk-!-width-two-thirds govuk-!-font-weight-regular' },
          value: { text: '£150.00' },
        },
        {
          key: { text: 'Protected payment', classes: 'govuk-!-width-two-thirds govuk-!-font-weight-regular' },
          value: { text: '£20.00' },
        },
        {
          key: { text: 'Extra State Pension', classes: 'govuk-!-width-two-thirds govuk-!-font-weight-regular' },
          value: { text: '£0.00' },
        },
        {
          key: { text: 'Inherited extra State Pension', classes: 'govuk-!-width-two-thirds govuk-!-font-weight-regular' },
          value: { text: '£0.00' },
        },
      ],
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
  validAddressSubBuildingNameBuildingName() {
    const address = { ...this.validUkAddress().residentialAddress };
    address.buildingNumber = null;
    address.dependentLocality = null;
    address.dependentThoroughfareName = null;
    address.thoroughfareName = null;
    return address;
  },
  validAddressSubBuildingNameBuildingNameResult() {
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
