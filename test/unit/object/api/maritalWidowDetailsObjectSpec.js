const { assert } = require('chai');
const maritalDetailsObject = require('../../../../lib/objects/api/maritalWidowDetailsObject');

const claimData = require('../../../lib/claimData');

const baseFormattedObject = {
  nino: 'AA370773A',
  eventCategory: 'PERSONAL',
  eventType: 'CHANGE',
  eventName: 'personal:timeline.marital-status',
};

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
const detailsPositiveFormatted = {
  ...baseFormattedObject,
  widowedDate: '2020-03-01',
  widowedDateVerified: true,
  checkInheritableStatePension: true,
};
const detailsNegativeFormatted = {
  ...baseFormattedObject,
  widowedDate: '2020-03-01',
  widowedDateVerified: false,
  checkInheritableStatePension: false,
};

describe('maritalWidowDetailsObject', () => {
  describe('formatter', () => {
    it('should return formatted verified widow object with check inheritable state pension as yes', () => {
      assert.deepEqual(maritalDetailsObject.formatter(detailsPositive, claimData.validClaimMarried()), detailsPositiveFormatted);
    });
    it('should return formatted not verified widow object with check inheritable state pension as no', () => {
      assert.deepEqual(maritalDetailsObject.formatter(detailsNegative, claimData.validClaimMarried()), detailsNegativeFormatted);
    });
  });
});
