const { assert } = require('chai');
const maritalDetailsObject = require('../../../../../lib/objects/api/maritalDetailsObject');

const claimData = require('../../../../lib/claimData');

const marriedToDivorcedVerifiedFormatted = {
  nino: 'AA370773A',
  eventCategory: 'PERSONAL',
  eventType: 'CHANGE',
  eventName: 'personal:timeline.marital-status',
  maritalStatus: 'Divorced',
  maritalStatusVerified: true,
  partnerDetail: {
    firstName: 'Jane',
    surname: 'Bloggs',
    allOtherNames: 'Middle',
    dob: '1952-03-19T00:00:00.000Z',
    marriageDate: null,
    divorcedDate: '2020-03-01T00:00:00.000Z',
    dobVerified: false,
    partnerNino: 'AA123456C',
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
    surname: 'Bloggs',
    allOtherNames: 'Middle',
    dob: '1952-03-19T00:00:00.000Z',
    marriageDate: null,
    widowedDate: '2020-03-01T00:00:00.000Z',
    partnerNino: 'AA123456C',
    dobVerified: false,
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
    surname: 'Bloggs',
    allOtherNames: 'Middle',
    dob: '1952-03-19T00:00:00.000Z',
    civilPartnershipDate: null,
    dissolvedDate: '2020-03-01T00:00:00.000Z',
    partnerNino: 'AA123456C',
    dobVerified: false,
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
    surname: 'Bloggs',
    allOtherNames: 'Middle',
    dob: '1952-03-19T00:00:00.000Z',
    civilPartnershipDate: null,
    widowedDate: '2020-03-01T00:00:00.000Z',
    partnerNino: 'AA123456C',
    dobVerified: false,
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
    surname: 'Bloggs',
    allOtherNames: 'Middle',
    dob: '1952-03-19T00:00:00.000Z',
    dobVerified: false,
    marriageDate: '2000-03-19T00:00:00.000Z',
    partnerNino: 'AA123456A',
  },
};
const ninoChangeFormatted = Object.assign(JSON.parse(JSON.stringify(ninoAddFormatted)), { eventType: 'CHANGE' });

const dobAddFormatted = {
  nino: 'AA370773A',
  eventCategory: 'PERSONAL',
  eventType: 'ADD',
  eventName: 'personal:timeline.marital-partner.married',
  maritalStatus: 'Married',
  maritalStatusVerified: true,
  partnerDetail: {
    firstName: 'Jane',
    surname: 'Bloggs',
    allOtherNames: 'Middle',
    dob: '1952-03-19T00:00:00.000Z',
    dobVerified: true,
    marriageDate: '2000-03-19T00:00:00.000Z',
  },
};
const dobChangeFormatted = Object.assign(JSON.parse(JSON.stringify(dobAddFormatted)), { eventType: 'CHANGE' });

const fullMaritalStatusAllDataChangeFormattedVerified = {
  nino: 'AA370773A',
  eventCategory: 'PERSONAL',
  eventType: 'CHANGE',
  eventName: 'personal:timeline.marital-status',
  maritalStatus: 'Married',
  maritalStatusVerified: true,
  partnerDetail: {
    firstName: 'Jane',
    surname: 'Bloggs',
    allOtherNames: 'Middle',
    dob: '1952-03-19T00:00:00.000Z',
    marriageDate: '2020-03-01T00:00:00.000Z',
    partnerNino: 'AA123456A',
  },
};

const fullMaritalStatusOnlyRequiredDataChangeFormattedNonVerified = {
  nino: 'AA370773A',
  eventCategory: 'PERSONAL',
  eventType: 'CHANGE',
  eventName: 'personal:timeline.marital-status',
  maritalStatus: 'Married',
  maritalStatusVerified: false,
  partnerDetail: {
    firstName: 'Jane',
    surname: 'Bloggs',
    marriageDate: '2020-03-01T00:00:00.000Z',
  },
};
const otherName = JSON.parse(JSON.stringify(fullMaritalStatusOnlyRequiredDataChangeFormattedNonVerified));
otherName.partnerDetail.allOtherNames = 'Middle';

const dob = JSON.parse(JSON.stringify(fullMaritalStatusOnlyRequiredDataChangeFormattedNonVerified));
dob.partnerDetail.dob = '1952-03-19T00:00:00.000Z';

const partnerNino = JSON.parse(JSON.stringify(fullMaritalStatusOnlyRequiredDataChangeFormattedNonVerified));
partnerNino.partnerDetail.partnerNino = 'AA123456A';

const maritalDateBaseFormatted = {
  nino: 'AA370773A',
  eventCategory: 'PERSONAL',
  eventType: 'CHANGE',
};

const partnerDetail = {
  firstName: 'Jane',
  surname: 'Bloggs',
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
      dobVerified: false,
      partnerNino: 'AA123456C',
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
      dobVerified: false,
      partnerNino: 'AA123456C',
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

const partnerDobDetails = {
  dobYear: '1952', dobMonth: '03', dobDay: '19', dobVerified: 'V',
};

const partnerAllDetails = {
  firstName: 'Jane',
  lastName: 'Bloggs',
  otherName: 'Middle',
  dobYear: '1952',
  dobMonth: '03',
  dobDay: '19',
  dobVerified: 'V',
  partnerNino: 'AA123456A',
};

const partnerOptionalNotCompleteDetails = {
  firstName: 'Jane',
  lastName: 'Bloggs',
  otherName: '',
  dobYear: '',
  dobMonth: '',
  dobDay: '',
  dobVerified: 'NV',
  partnerNino: '',
};

const maritalDataMarriedVerified = {
  maritalStatus: 'married',
  date: {
    dateYear: '2020', dateMonth: '03', dateDay: '01', verification: 'V',
  },
};
const maritalDataMarriedNoneVerified = {
  maritalStatus: 'married',
  date: {
    dateYear: '2020', dateMonth: '03', dateDay: '01', verification: 'NV',
  },
};

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

  describe('partnerDetailByItemFormatter', () => {
    describe('nino', () => {
      it('should return formatted add object with nino updated when nino supplied but not complete in partner details', () => {
        assert.deepEqual(maritalDetailsObject.partnerDetailByItemFormatter(partnerNinoDetails, 'married', claimData.validClaimMarriedVerified()), ninoAddFormatted);
      });

      it('should return formatted change object with nino updated when nino supplied and complete in partner details', () => {
        const award = claimData.validClaimMarriedVerified();
        award.partnerDetail.partnerNino = 'AA654321C';
        assert.deepEqual(maritalDetailsObject.partnerDetailByItemFormatter(partnerNinoDetails, 'married', award), ninoChangeFormatted);
      });
    });

    describe('dob', () => {
      it('should return formatted add object with dob updated when dob day, month and year supplied but not complete in partner details', () => {
        const award = claimData.validClaimMarriedVerified();
        award.partnerDetail.dob = null;
        assert.deepEqual(maritalDetailsObject.partnerDetailByItemFormatter(partnerDobDetails, 'married', award), dobAddFormatted);
      });

      it('should return formatted change object with dob updated when dob day, month and year supplied and complete in partner details', () => {
        const award = claimData.validClaimMarriedVerified();
        award.partnerDetail.dob = '1960-01-01T00:00:00.000Z';
        assert.deepEqual(maritalDetailsObject.partnerDetailByItemFormatter(partnerDobDetails, 'married', award), dobChangeFormatted);
      });
    });
  });

  describe('partnerDetailFormatter', () => {
    it('should return verified formatted object with all optional field present when all data is supplied', () => {
      assert.deepEqual(maritalDetailsObject.partnerDetailFormatter(partnerAllDetails, maritalDataMarriedVerified, claimData.validClaimSingle()), fullMaritalStatusAllDataChangeFormattedVerified);
    });

    it('should return non verified formatted object with no optional field present when optional fields are blank', () => {
      assert.deepEqual(maritalDetailsObject.partnerDetailFormatter(partnerOptionalNotCompleteDetails, maritalDataMarriedNoneVerified, claimData.validClaimSingle()), fullMaritalStatusOnlyRequiredDataChangeFormattedNonVerified);
    });

    it('should return formatted object with all required partner fields present plus otherName when all required partner fields and otherName are complete', () => {
      assert.deepEqual(maritalDetailsObject.partnerDetailFormatter({ ...partnerOptionalNotCompleteDetails, otherName: 'Middle' }, maritalDataMarriedNoneVerified, claimData.validClaimSingle()), otherName);
    });

    it('should return formatted object with all required partner fields present plus dob when all required partner fields and dob are complete', () => {
      assert.deepEqual(maritalDetailsObject.partnerDetailFormatter({
        ...partnerOptionalNotCompleteDetails, dobYear: '1952', dobMonth: '03', dobDay: '19',
      }, maritalDataMarriedNoneVerified, claimData.validClaimSingle()), dob);
    });

    it('should return formatted object with all required partner fields present plus partnerNino when all required partner fields and partnerNino are complete', () => {
      assert.deepEqual(maritalDetailsObject.partnerDetailFormatter({
        ...partnerOptionalNotCompleteDetails, partnerNino: 'AA123456A',
      }, maritalDataMarriedNoneVerified, claimData.validClaimSingle()), partnerNino);
    });
  });
});
