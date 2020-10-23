const { assert } = require('chai');

const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../../../config/i18next');

const maritalStatePensionEntitlementObject = require('../../../../../lib/objects/view/maritalStatePensionEntitlementObject');

const allPartnerDetails = {
  maritalStatus: 'Married',
  maritalStatusVerified: true,
  residentialAddress: {
    buildingName: null,
    buildingNumber: '1',
    dependentLocality: null,
    dependentThoroughfareName: null,
    postCode: 'NE1 1AA',
    postTown: null,
    subBuildingName: null,
    thoroughfareName: 'Test Street',
    uprn: null,
  },
  partnerDetail: {
    firstName: 'Joe',
    surname: 'Bloggs',
    allOtherNames: 'Kelvin',
    dob: -529804800000,
    partnerNino: 'AA111111B',
    marriageDate: 946684800000,
  },
};
const allPartnerDetailsFormatted = {
  partnerSummary: {
    header: "Late spouse's details",
    rows: [{
      key: { text: 'National Insurance number' },
      value: { text: 'AA 11 11 11 B' },
    }, {
      key: { text: 'First name' },
      value: { text: 'Joe' },
    }, {
      key: { text: 'Last name' },
      value: { text: 'Bloggs' },
    }, {
      key: { text: 'Other names' },
      value: { text: 'Kelvin' },
    }, {
      key: { text: 'Date of birth' },
      value: { text: '19 March 1953' },
    }],
  },
  otherDetailsSummary: {
    header: 'Other details to help find spouse',
    rows: [{
      key: { text: 'Date of marriage' },
      value: { html: '1 January 2000 <span class="govuk-!-font-weight-bold govuk-!-padding-left-5 govuk-!-padding-right-2 gysp-secondary-text-colour gysp-status gysp-status--active">\n      Verified\n  </span>', classes: 'govuk-!-padding-right-0' },
    }, {
      key: { text: "Claimant's address" },
      value: { html: '1 Test Street<br />NE1 1AA' },
    }],
  },
};

const mandatoryPartnerDetails = {
  maritalStatus: 'Married',
  maritalStatusVerified: true,
  residentialAddress: {
    buildingName: null,
    buildingNumber: '1',
    dependentLocality: null,
    dependentThoroughfareName: null,
    postCode: 'NE1 1AA',
    postTown: null,
    subBuildingName: null,
    thoroughfareName: 'Test Street',
    uprn: null,
  },
  partnerDetail: {
    firstName: 'Joe',
    surname: 'Bloggs',
    allOtherNames: null,
    dob: null,
    partnerNino: null,
    marriageDate: 946684800000,
  },
};
const mandatoryPartnerDetailsFormatted = {
  partnerSummary: {
    header: "Late spouse's details",
    rows: [{
      key: { text: 'First name' },
      value: { text: 'Joe' },
    }, {
      key: { text: 'Last name' },
      value: { text: 'Bloggs' },
    }],
  },
  otherDetailsSummary: {
    header: 'Other details to help find spouse',
    rows: [{
      key: { text: 'Date of marriage' },
      value: { html: '1 January 2000 <span class="govuk-!-font-weight-bold govuk-!-padding-left-5 govuk-!-padding-right-2 gysp-secondary-text-colour gysp-status gysp-status--active">\n      Verified\n  </span>', classes: 'govuk-!-padding-right-0' },
    }, {
      key: { text: "Claimant's address" },
      value: { html: '1 Test Street<br />NE1 1AA' },
    }],
  },
};

describe('maritalStatePensionEntitlementObject ', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

  describe('formatter', () => {
    it('should be a function', () => {
      assert.isFunction(maritalStatePensionEntitlementObject.formatter);
    });

    it('should return null when partner details are null', () => {
      assert.isNull(maritalStatePensionEntitlementObject.formatter({}));
    });

    it('should return object with all details', () => {
      assert.deepEqual(maritalStatePensionEntitlementObject.formatter(allPartnerDetails), allPartnerDetailsFormatted);
    });

    it('should return object with only mandatory details', () => {
      assert.deepEqual(maritalStatePensionEntitlementObject.formatter(mandatoryPartnerDetails), mandatoryPartnerDetailsFormatted);
    });
  });
});
