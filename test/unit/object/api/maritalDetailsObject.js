const { assert } = require('chai');
const maritalDetailsObject = require('../../../../lib/objects/api/maritalDetailsObject');

const claimData = require('../../../lib/claimData');

const marriedToDivorcedVerifiedFormatted = {
  nino: 'AA370773A',
  eventCategory: 'PERSONAL',
  eventType: 'CHANGE',
  eventName: 'personal:timeline.marital-status',
  maritalStatus: 'Divorced',
  maritalStatusVerified: true,
  partnerDetail: {
    firstName: 'Jane',
    surname: 'Bloogs',
    allOtherNames: 'Middle',
    dob: '1952-03-19T00:00:00.000Z',
    marriageDate: null,
    divorcedDate: '2020-03-01T00:00:00.000Z',
  },
};
const marriedToDivorcedNonVerifiedFormatted = Object.assign(JSON.parse(JSON.stringify(marriedToDivorcedVerifiedFormatted)), { maritalStatusVerified: false });

const marriedToWidowedVerifiedFormatted = {
  nino: 'AA370773A',
  eventCategory: 'PERSONAL',
  eventType: 'CHANGE',
  eventName: 'personal:timeline.marital-status',
  maritalStatus: 'Widowed',
  maritalStatusVerified: true,
  partnerDetail: {
    firstName: 'Jane',
    surname: 'Bloogs',
    allOtherNames: 'Middle',
    dob: '1952-03-19T00:00:00.000Z',
    marriageDate: null,
    widowedDate: '2020-03-01T00:00:00.000Z',
  },
};
const marriedToWidowedNonVerifiedFormatted = Object.assign(JSON.parse(JSON.stringify(marriedToWidowedVerifiedFormatted)), { maritalStatusVerified: false });

const civilToDissolvedVerifiedFormatted = {
  nino: 'AA370773A',
  eventCategory: 'PERSONAL',
  eventType: 'CHANGE',
  eventName: 'personal:timeline.marital-status',
  maritalStatus: 'Dissolved',
  maritalStatusVerified: true,
  partnerDetail: {
    firstName: 'Jane',
    surname: 'Bloogs',
    allOtherNames: 'Middle',
    dob: '1952-03-19T00:00:00.000Z',
    civilPartnershipDate: null,
    dissolvedDate: '2020-03-01T00:00:00.000Z',
  },
};
const civilToDissolvedNonVerifiedFormatted = Object.assign(JSON.parse(JSON.stringify(civilToDissolvedVerifiedFormatted)), { maritalStatusVerified: false });

const civilToWidowedVerifiedFormatted = {
  nino: 'AA370773A',
  eventCategory: 'PERSONAL',
  eventType: 'CHANGE',
  eventName: 'personal:timeline.marital-status',
  maritalStatus: 'Widowed',
  maritalStatusVerified: true,
  partnerDetail: {
    firstName: 'Jane',
    surname: 'Bloogs',
    allOtherNames: 'Middle',
    dob: '1952-03-19T00:00:00.000Z',
    civilPartnershipDate: null,
    widowedDate: '2020-03-01T00:00:00.000Z',
  },
};
const civilToWidowedNonVerifiedFormatted = Object.assign(JSON.parse(JSON.stringify(civilToWidowedVerifiedFormatted)), { maritalStatusVerified: false });

const ninoAddFormatted = {
  nino: 'AA370773A',
  eventCategory: 'PERSONAL',
  eventType: 'ADD',
  eventName: 'personal:timeline.marital-partner.married',
  maritalStatus: 'Married',
  maritalStatusVerified: true,
  partnerDetail: {
    firstName: 'Jane',
    surname: 'Bloogs',
    allOtherNames: 'Middle',
    dob: '1952-03-19T00:00:00.000Z',
    marriageDate: '2000-03-19T00:00:00.000Z',
    partnerNino: 'AA123456A',
  },
};
const ninoChangeFormatted = Object.assign(JSON.parse(JSON.stringify(ninoAddFormatted)), { eventType: 'CHANGE' });


const maritalDateBaseFormatted = {
  nino: 'AA370773A',
  eventCategory: 'PERSONAL',
  eventType: 'CHANGE',
};

const partnerDetail = {
  firstName: 'Jane',
  surname: 'Bloogs',
  allOtherNames: 'Middle',
  dob: '1952-03-19T00:00:00.000Z',
};

const maritalDateFormatted = {
  'married-verified': {
    ...maritalDateBaseFormatted,
    eventName: 'personal:timeline.marital-date.married.verified',
    maritalStatus: 'Married',
    maritalStatusVerified: true,
    partnerDetail: {
      ...partnerDetail,
      marriageDate: '2020-03-01T00:00:00.000Z',
    },
  },
  'civil-verified': {
    ...maritalDateBaseFormatted,
    eventName: 'personal:timeline.marital-date.civil.verified',
    maritalStatus: 'Civil Partnership',
    maritalStatusVerified: true,
    partnerDetail: {
      ...partnerDetail,
      civilPartnershipDate: '2020-03-01T00:00:00.000Z',
    },
  },
  'divorced-verified': {
    ...maritalDateBaseFormatted,
    eventName: 'personal:timeline.marital-date.divorced.verified',
    maritalStatus: 'Divorced',
    maritalStatusVerified: true,
    partnerDetail: {
      ...partnerDetail,
      divorcedDate: '2020-03-01T00:00:00.000Z',
    },
  },
  'dissolved-verified': {
    ...maritalDateBaseFormatted,
    eventName: 'personal:timeline.marital-date.dissolved.verified',
    maritalStatus: 'Dissolved',
    maritalStatusVerified: true,
    partnerDetail: {
      ...partnerDetail,
      dissolvedDate: '2020-03-01T00:00:00.000Z',
    },
  },
  'widowed-verified': {
    ...maritalDateBaseFormatted,
    eventName: 'personal:timeline.marital-date.widowed.verified',
    maritalStatus: 'Widowed',
    maritalStatusVerified: true,
    partnerDetail: {
      ...partnerDetail,
      widowedDate: '2020-03-01T00:00:00.000Z',
    },
  },
};

const dateDetailsVerified = {
  dateYear: '2020', dateMonth: '3', dateDay: '1', verification: 'V',
};
const dateDetailsNotVerified = {
  dateYear: '2020', dateMonth: '3', dateDay: '1', verification: 'NV',
};

const partnerNinoDetails = { partnerNino: 'AA123456A' };

describe('maritalDetailsObject', () => {
  describe('formatter', () => {
    describe('marital status', () => {
      describe('Current marital status - Married', () => {
        it('should return formatted update divorced marital details object when verified divorced date supplied', () => {
          assert.deepEqual(maritalDetailsObject.formatter(dateDetailsVerified, 'divorced', claimData.validClaimMarried()), marriedToDivorcedVerifiedFormatted);
        });
        it('should return formatted update divorced marital details object when non verified divorced date supplied', () => {
          assert.deepEqual(maritalDetailsObject.formatter(dateDetailsNotVerified, 'divorced', claimData.validClaimMarried()), marriedToDivorcedNonVerifiedFormatted);
        });
        it('should return formatted update widowed marital details object when verified widowed date supplied', () => {
          assert.deepEqual(maritalDetailsObject.formatter(dateDetailsVerified, 'widowed', claimData.validClaimMarried()), marriedToWidowedVerifiedFormatted);
        });
        it('should return formatted update widowed marital details object when non verified widowed date supplied', () => {
          assert.deepEqual(maritalDetailsObject.formatter(dateDetailsNotVerified, 'widowed', claimData.validClaimMarried()), marriedToWidowedNonVerifiedFormatted);
        });
      });
      describe('Current marital status - Civil Partnership', () => {
        it('should return formatted update dissolved marital details object when verified dissolved date supplied ', () => {
          assert.deepEqual(maritalDetailsObject.formatter(dateDetailsVerified, 'dissolved', claimData.validClaimCivilPartner()), civilToDissolvedVerifiedFormatted);
        });
        it('should return formatted update dissolved marital details object when non verified dissolved date supplied', () => {
          assert.deepEqual(maritalDetailsObject.formatter(dateDetailsNotVerified, 'dissolved', claimData.validClaimCivilPartner()), civilToDissolvedNonVerifiedFormatted);
        });
        it('should return formatted update widowed marital details object when verified widowed date supplied', () => {
          assert.deepEqual(maritalDetailsObject.formatter(dateDetailsVerified, 'widowed', claimData.validClaimCivilPartner()), civilToWidowedVerifiedFormatted);
        });
        it('should return formatted update widowed marital details object when non verified widowed date supplied', () => {
          assert.deepEqual(maritalDetailsObject.formatter(dateDetailsNotVerified, 'widowed', claimData.validClaimCivilPartner()), civilToWidowedNonVerifiedFormatted);
        });
      });
    });
    describe('marital date', () => {
      it('should return formatted married marital details object when status has not changed', () => {
        assert.deepEqual(maritalDetailsObject.formatter(dateDetailsVerified, 'married', claimData.validClaimMarried()), maritalDateFormatted['married-verified']);
      });
      it('should return formatted civil partner marital details object when status has not changed', () => {
        assert.deepEqual(maritalDetailsObject.formatter(dateDetailsVerified, 'civil', claimData.validClaimCivilPartner()), maritalDateFormatted['civil-verified']);
      });
      it('should return formatted divorced marital details object when status has not changed', () => {
        assert.deepEqual(maritalDetailsObject.formatter(dateDetailsVerified, 'divorced', claimData.validClaimDivorced()), maritalDateFormatted['divorced-verified']);
      });
      it('should return formatted dissolved marital details object when status has not changed', () => {
        assert.deepEqual(maritalDetailsObject.formatter(dateDetailsVerified, 'dissolved', claimData.validClaimDissolved()), maritalDateFormatted['dissolved-verified']);
      });
      it('should return formatted widowed marital details object when status has not changed', () => {
        assert.deepEqual(maritalDetailsObject.formatter(dateDetailsVerified, 'widowed', claimData.validClaimWidowed()), maritalDateFormatted['widowed-verified']);
      });
    });
  });

  describe('partnerDetailFormatter', () => {
    it('should return formatted add object with nino updated when nino supplied but not complete in partner details', () => {
      assert.deepEqual(maritalDetailsObject.partnerDetailFormatter(partnerNinoDetails, 'married', claimData.validClaimMarriedVerified()), ninoAddFormatted);
    });
    it('should return formatted change object with nino updated when nino supplied and complete in partner details', () => {
      const award = claimData.validClaimMarriedVerified();
      award.partnerDetail.partnerNino = 'AA654321C';
      assert.deepEqual(maritalDetailsObject.partnerDetailFormatter(partnerNinoDetails, 'married', award), ninoChangeFormatted);
    });
  });
});
