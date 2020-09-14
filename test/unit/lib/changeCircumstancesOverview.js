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

    it('should return formatted object with populated values show link true when marital status is not Single', () => {
      const formatter = changeCircumstancesOverview.formatter(claimData.validClaimMarried());
      assert.equal(JSON.stringify(formatter), JSON.stringify(claimData.validPersonalDetailsMarriedViewData()));
    });

    it('should return formatted object with payment stopped link enabled - INPAYMENT', () => {
      const formatter = changeCircumstancesOverview.formatter({ ...claimData.validClaim(), awardStatus: 'INPAYMENT' });
      assert.equal(JSON.stringify(formatter), JSON.stringify(claimData.validPersonalDetailsViewData()));
    });

    it('should return formatted object with payment stopped link enabled - DEAD', () => {
      const formatter = changeCircumstancesOverview.formatter({ ...claimData.validClaim(), awardStatus: 'DEAD' });
      assert.equal(JSON.stringify(formatter), JSON.stringify({ ...claimData.validPersonalDetailsViewData(), enableStopStatePension: false }));
    });

    it('should return formatted object with payment stopped link enabled - DEADNOTVERIFIED', () => {
      const formatter = changeCircumstancesOverview.formatter({ ...claimData.validClaim(), awardStatus: 'DEADNOTVERIFIED' });
      assert.equal(JSON.stringify(formatter), JSON.stringify({ ...claimData.validPersonalDetailsViewData(), enableStopStatePension: false }));
    });

    it('should return formatted object with payment stopped link enabled - DEFERRED', () => {
      const formatter = changeCircumstancesOverview.formatter({ ...claimData.validClaim(), awardStatus: 'DEFERRED' });
      assert.equal(JSON.stringify(formatter), JSON.stringify({ ...claimData.validPersonalDetailsViewData(), enableStopStatePension: false }));
    });
  });
});
