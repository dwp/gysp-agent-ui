const { assert } = require('chai');
const maritalDetailsObject = require('../../../../lib/objects/api/maritalDetailsEntitlementObject');

const maritalDateBaseFormatted = {
  eventCategory: null,
  eventType: null,
  eventName: null,
  nino: 'AA123456C',
};

const partnerDetail = {
  firstName: 'Jane',
  surname: 'Bloggs',
  allOtherNames: 'Middle',
  dob: null,
  partnerNino: null,
  dobVerified: null,
  civilPartnershipDate: null,
  dissolvedDate: null,
  divorcedDate: null,
  marriageDate: null,
  widowedDate: null,
};

const maritalFormatted = {
  undefined: {
    ...maritalDateBaseFormatted,
    maritalStatus: 'Married',
    maritalStatusVerified: true,
    partnerDetail: {
      ...partnerDetail,
    },
  },
  'dob-verified': {
    ...maritalDateBaseFormatted,
    maritalStatus: 'Married',
    maritalStatusVerified: true,
    partnerDetail: {
      ...partnerDetail,
      dob: '2020-03-01T00:00:00.000Z',
      dobVerified: true,
    },
  },
  'dob-not-verified': {
    ...maritalDateBaseFormatted,
    maritalStatus: 'Married',
    maritalStatusVerified: true,
    partnerDetail: {
      ...partnerDetail,
      dob: '2020-03-01T00:00:00.000Z',
      dobVerified: false,
    },
  },
  'partner-nino': {
    ...maritalDateBaseFormatted,
    maritalStatus: 'Married',
    maritalStatusVerified: true,
    partnerDetail: {
      ...partnerDetail,
      partnerNino: 'AA123456A',
    },
  },
  'married-date-verified': {
    ...maritalDateBaseFormatted,
    maritalStatus: 'Married',
    maritalStatusVerified: true,
    partnerDetail: {
      ...partnerDetail,
      marriageDate: '2020-03-01T00:00:00.000Z',
    },
  },
  'married-date-not-verified': {
    ...maritalDateBaseFormatted,
    maritalStatus: 'Married',
    maritalStatusVerified: false,
    partnerDetail: {
      ...partnerDetail,
      marriageDate: '2020-03-01T00:00:00.000Z',
    },
  },
  'civil-date-verified': {
    ...maritalDateBaseFormatted,
    maritalStatus: 'Civil Partnership',
    maritalStatusVerified: true,
    partnerDetail: {
      ...partnerDetail,
      civilPartnershipDate: '2020-03-01T00:00:00.000Z',
    },
  },
  'civil-date-not-verified': {
    ...maritalDateBaseFormatted,
    maritalStatus: 'Civil Partnership',
    maritalStatusVerified: false,
    partnerDetail: {
      ...partnerDetail,
      civilPartnershipDate: '2020-03-01T00:00:00.000Z',
    },
  },
};

const dateOfBirthVerified = {
  'date-of-birth': {
    dateYear: '2020', dateMonth: '3', dateDay: '1', verification: 'V',
  },
};

const dateOfBirthNotVerified = {
  'date-of-birth': {
    dateYear: '2020', dateMonth: '3', dateDay: '1', verification: 'NV',
  },
};

const partnerNinoDetails = {
  'partner-nino': { partnerNino: 'AA123456A' },
};

const maritalDateVerified = {
  'marital-date': {
    dateYear: '2020', dateMonth: '3', dateDay: '1', verification: 'V',
  },
};

const maritalDateNotVerified = {
  'marital-date': {
    dateYear: '2020', dateMonth: '3', dateDay: '1', verification: 'NV',
  },
};

const award = {
  maritalStatusVerified: true,
  nino: 'AA123456C',
  partnerDetail: {
    firstName: 'Jane',
    surname: 'Bloggs',
    allOtherNames: 'Middle',
    dob: null,
    partnerNino: null,
    dobVerified: null,
    civilPartnershipDate: null,
    dissolvedDate: null,
    divorcedDate: null,
    marriageDate: null,
    widowedDate: null,
  },
};
let marriedAward = {};
let civilAward = {};

describe('maritalDetailsEntitlementObject', () => {
  beforeEach(() => {
    marriedAward = { ...JSON.parse(JSON.stringify(award)), ...{ maritalStatus: 'Married' } };
    civilAward = { ...JSON.parse(JSON.stringify(award)), ...{ maritalStatus: 'Civil Partnership' } };
  });
  describe('formatter', () => {
    it('should return marital details object with event as null when update object undefined', () => {
      assert.deepEqual(maritalDetailsObject.formatter(undefined, marriedAward), maritalFormatted.undefined);
    });
    it('should return formatted marital details with partner date of birth updated and verified', () => {
      assert.deepEqual(maritalDetailsObject.formatter(dateOfBirthVerified, marriedAward), maritalFormatted['dob-verified']);
    });
    it('should return formatted marital details with partner date of birth updated and not verified', () => {
      assert.deepEqual(maritalDetailsObject.formatter(dateOfBirthNotVerified, marriedAward), maritalFormatted['dob-not-verified']);
    });
    it('should return formatted marital details with partner nino updated', () => {
      assert.deepEqual(maritalDetailsObject.formatter(partnerNinoDetails, marriedAward), maritalFormatted['partner-nino']);
    });
    it('should return formatted marital details with date of marriage updated and verified', () => {
      assert.deepEqual(maritalDetailsObject.formatter(maritalDateVerified, marriedAward), maritalFormatted['married-date-verified']);
    });
    it('should return formatted marital details with date of marriage updated and not verified', () => {
      assert.deepEqual(maritalDetailsObject.formatter(maritalDateNotVerified, marriedAward), maritalFormatted['married-date-not-verified']);
    });
    it('should return formatted marital details with date of civil partnership updated and verified', () => {
      assert.deepEqual(maritalDetailsObject.formatter(maritalDateVerified, civilAward), maritalFormatted['civil-date-verified']);
    });
    it('should return formatted marital details with date of civil partnership updated and not verified', () => {
      assert.deepEqual(maritalDetailsObject.formatter(maritalDateNotVerified, civilAward), maritalFormatted['civil-date-not-verified']);
    });
  });
});
