const assert = require('assert');
const changeCircumstancesOverview = require('../../../lib/contactDetailsOverview');
const claimData = require('../../lib/claimData');

describe('contact details overview', () => {
  describe('formatter ', () => {
    it('should return formatted object with populated values when every address field is complete', () => {
      const formatter = changeCircumstancesOverview.formatter(claimData.validClaim());
      assert.equal(JSON.stringify(formatter), JSON.stringify(claimData.validContactDetailsViewData()));
    });
  });
});
