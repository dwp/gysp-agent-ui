const { assert } = require('chai');

const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../../../config/i18next');

const contactDetailsOverview = require('../../../../../lib/objects/view/contactDetailsOverview');
const claimData = require('../../../../lib/claimData');

describe('contactDetailsOverview ', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

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
