const { assert } = require('chai');
const maritalDetailsObject = require('../../../../../lib/objects/api/maritalWidowDetailsObject');

// Award data
const claimData = require('../../../../lib/claimData');

const awardNoInPayment = {
  nino: 'AA370773A',
  awardAmounts: [{
    totalAmount: 110.0,
    weeklyStatePensionAmount: 100.0,
    weeklyProtectedPaymentAmount: 10.0,
    weeklyExtraStatePensionAmount: 0.0,
    weeklyInheritedExtraStatePensionAmount: 0.0,
    fromDate: 1551830400000,
    toDate: null,
    reasonCode: 'FIRSTAWARD',
    inPayment: false,
  }],
};


const baseFormattedObject = {
  nino: 'AA370773A',
  eventCategory: 'PERSONAL',
  eventType: 'CHANGE',
  eventName: 'personal:timeline.marital-status',
  entitledInheritableStatePension: null,
  widowedAmounts: {
    additionalEspAmount: null,
    additionalPensionAmount: null,
    basicPensionEspAmount: null,
    graduatedBenefitAmount: null,
    graduatedBenefitEspAmount: null,
    protectedPaymentInheritableAmount: null,
    weeklyInheritedExtraStatePensionAmount: 0,
    weeklyProtectedPaymentAmount: 10,
    weeklyStatePensionAmount: 100,
  },
};

// Form objects
const detailsPositive = {
  date: {
    dateYear: '2020', dateMonth: '3', dateDay: '1', verification: 'V',
  },
  'check-for-inheritable-state-pension': {
    checkInheritableStatePension: 'yes',
  },
};
const detailsNegative = {
  date: {
    dateYear: '2020', dateMonth: '3', dateDay: '1', verification: 'NV',
  },
  'check-for-inheritable-state-pension': {
    checkInheritableStatePension: 'no',
  },
};

const detailsVerifiedNoWeeklyUpdated = {
  date: {
    dateYear: '2020', dateMonth: '3', dateDay: '1', verification: 'V',
  },
  'check-for-inheritable-state-pension': {
    checkInheritableStatePension: 'yes',
  },
  'entitled-to-inherited-state-pension': {
    entitledInheritableStatePension: 'yes',
  },
  'relevant-inherited-amounts': {
    additionalPension: '',
    graduatedBenefit: '',
    basicExtraStatePension: '',
    additionalExtraStatePension: '',
    graduatedBenefitExtraStatePension: '',
    protectedPayment: '',
  },
};

const detailsVerifiedAllUpdated = {
  date: {
    dateYear: '2020', dateMonth: '3', dateDay: '1', verification: 'V',
  },
  'check-for-inheritable-state-pension': {
    checkInheritableStatePension: 'yes',
  },
  'entitled-to-inherited-state-pension': {
    entitledInheritableStatePension: 'yes',
  },
  'relevant-inherited-amounts': {
    additionalPension: '100.00',
    graduatedBenefit: '200.00',
    basicExtraStatePension: '300.43',
    additionalExtraStatePension: '400.99',
    graduatedBenefitExtraStatePension: '500.67',
    protectedPayment: '600.10',
  },
  'update-state-pension-award-new-state-pension': {
    amount: '100.67',
  },
  'update-state-pension-award-protected-payment': {
    amount: '110.67',
  },
  'update-state-pension-award-inherited-extra-state-pension': {
    amount: '120.67',
  },
};

// Formatted objects
const detailsPositiveFormatted = {
  ...baseFormattedObject,
  widowedDate: '2020-03-01T00:00:00.000Z',
  widowedDateVerified: true,
  checkInheritableStatePension: true,
};
const detailsNegativeFormatted = {
  ...baseFormattedObject,
  widowedDate: '2020-03-01T00:00:00.000Z',
  widowedDateVerified: false,
  checkInheritableStatePension: false,
};
const detailsWithEntitledAsTrueFormatted = {
  ...baseFormattedObject,
  widowedDate: '2020-03-01T00:00:00.000Z',
  widowedDateVerified: true,
  checkInheritableStatePension: true,
  entitledInheritableStatePension: true,
};
const detailsVerifiedAllUpdatedFormatted = {
  ...baseFormattedObject,
  widowedDate: '2020-03-01T00:00:00.000Z',
  widowedDateVerified: true,
  checkInheritableStatePension: true,
  entitledInheritableStatePension: true,
  widowedAmounts: {
    additionalPensionAmount: 100,
    graduatedBenefitAmount: 200,
    basicPensionEspAmount: 300.43,
    additionalEspAmount: 400.99,
    graduatedBenefitEspAmount: 500.67,
    protectedPaymentInheritableAmount: 600.1,
    weeklyInheritedExtraStatePensionAmount: 120.67,
    weeklyProtectedPaymentAmount: 110.67,
    weeklyStatePensionAmount: 100.67,
  },
};

describe('maritalWidowDetailsObject', () => {
  describe('formatter', () => {
    it('should return formatted verified widow object with check inheritable state pension as yes', () => {
      assert.deepEqual(maritalDetailsObject.formatter(detailsPositive, claimData.validClaimMarried()), detailsPositiveFormatted);
    });

    it('should return formatted not verified widow object with check inheritable state pension as no', () => {
      assert.deepEqual(maritalDetailsObject.formatter(detailsNegative, claimData.validClaimMarried()), detailsNegativeFormatted);
    });
    it('should return formatted verified widow object with updated widowedAmounts', () => {
      assert.deepEqual(maritalDetailsObject.formatter(detailsVerifiedAllUpdated, claimData.validClaimMarried()), detailsVerifiedAllUpdatedFormatted);
    });
    it('should return formatted verified widow object with no in payment award', () => {
      assert.deepEqual(maritalDetailsObject.formatter(detailsVerifiedNoWeeklyUpdated, awardNoInPayment), detailsWithEntitledAsTrueFormatted);
    });
  });
});
