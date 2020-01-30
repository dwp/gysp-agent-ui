const assert = require('assert');
const changeCircumstancesOverview = require('../../../lib/changeCircumstancesOverview');
const claimData = require('../../lib/claimData');

describe('change of circumstances overview ', () => {
  describe('formatter ', () => {
    it('should return formatted object with populated values when every address field is complete', () => {
      const formatter = changeCircumstancesOverview.formatter(claimData.validClaim());
      assert.equal(JSON.stringify(formatter), JSON.stringify(claimData.validPersonalDetailsViewData()));
    });

    it('should return formatted object with populated values with dateOfDeath verified', () => {
      const formatter = changeCircumstancesOverview.formatter(claimData.validClaimWithDeathVerified());
      assert.equal(JSON.stringify(formatter), JSON.stringify(claimData.validClaimWithDeathVerifiedData()));
    });

    it('should return formatted object with populated values with deathArrearsAmount arrears due', () => {
      const formatter = changeCircumstancesOverview.formatter(claimData.validClaimWithDeathArrearsDue());
      assert.equal(JSON.stringify(formatter), JSON.stringify(claimData.validClaimWithDeathVerifiedArrearsData()));
    });
  });
});
