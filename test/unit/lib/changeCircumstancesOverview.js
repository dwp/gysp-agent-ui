const assert = require('assert');

const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../config/i18next');

const changeCircumstancesOverview = require('../../../lib/changeCircumstancesOverview');
const claimData = require('../../lib/claimData');

describe('change of circumstances overview ', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

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
  });
});
