const { assert } = require('chai');
const maritalStatePensionEntitlementObject = require('../../../../lib/objects/view/maritalStatePensionEntitlementObject');

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
    header: 'marital-state-pension-entitlement:summary-header-1.married',
    rows: [{
      key: { text: 'marital-state-pension-entitlement:summary-keys.nino' },
      value: { text: 'AA 11 11 11 B' },
    }, {
      key: { text: 'marital-state-pension-entitlement:summary-keys.first-name' },
      value: { text: 'Joe' },
    }, {
      key: { text: 'marital-state-pension-entitlement:summary-keys.last-name' },
      value: { text: 'Bloggs' },
    }, {
      key: { text: 'marital-state-pension-entitlement:summary-keys.other-names' },
      value: { text: 'Kelvin' },
    }, {
      key: { text: 'marital-state-pension-entitlement:summary-keys.dob' },
      value: { text: '19 March 1953' },
    }],
  },
  otherDetailsSummary: {
    header: 'marital-state-pension-entitlement:summary-header-2.married',
    rows: [{
      key: { text: 'marital-state-pension-entitlement:summary-keys.marital-date.married' },
      value: { html: '1 January 2000 <span class="govuk-!-font-weight-bold govuk-!-padding-left-5 govuk-!-padding-right-2 gysp-secondary-text-colour gysp-status gysp-status--active">\n      app:verification-status.verified\n  </span>', classes: 'govuk-!-padding-right-0' },
    }, {
      key: { text: 'marital-state-pension-entitlement:summary-keys.address' },
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
    header: 'marital-state-pension-entitlement:summary-header-1.married',
    rows: [{
      key: { text: 'marital-state-pension-entitlement:summary-keys.first-name' },
      value: { text: 'Joe' },
    }, {
      key: { text: 'marital-state-pension-entitlement:summary-keys.last-name' },
      value: { text: 'Bloggs' },
    }],
  },
  otherDetailsSummary: {
    header: 'marital-state-pension-entitlement:summary-header-2.married',
    rows: [{
      key: { text: 'marital-state-pension-entitlement:summary-keys.marital-date.married' },
      value: { html: '1 January 2000 <span class="govuk-!-font-weight-bold govuk-!-padding-left-5 govuk-!-padding-right-2 gysp-secondary-text-colour gysp-status gysp-status--active">\n      app:verification-status.verified\n  </span>', classes: 'govuk-!-padding-right-0' },
    }, {
      key: { text: 'marital-state-pension-entitlement:summary-keys.address' },
      value: { html: '1 Test Street<br />NE1 1AA' },
    }],
  },
};

describe('maritalStatePensionEntitlementObject ', () => {
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
