const { assert } = require('chai');
const contactDetailsOverview = require('../../../../lib/objects/view/contactDetailsOverview');
const claimData = require('../../../lib/claimData');

describe('contactDetailsOverview ', () => {
  describe('formatter', () => {
    it('should return formatted object with array', () => {
      const formatted = contactDetailsOverview.formatter(claimData.validClaim());
      assert.isArray(formatted.contactDetailsSummaryRows);
    });
    it('should return formatted object with array change links', () => {
      const formatted = contactDetailsOverview.formatter(claimData.validClaim());
      assert.deepEqual(formatted.contactDetailsSummaryRows, claimData.validContactDetailsViewData());
    });
    it('should return formatted object with array add links', () => {
      const formatted = contactDetailsOverview.formatter(claimData.validClaimNullContact());
      assert.deepEqual(formatted.contactDetailsSummaryRows, claimData.validContactDetailsAddViewData());
    });
  });
});
