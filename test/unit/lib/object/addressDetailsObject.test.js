const assert = require('assert');
const claimData = require('../../../lib/claimData');
const addressData = require('../../../lib/addressData');

const addressDetailsObject = require('../../../../lib/objects/addressDetailsObject');

const detailsUprn = { address: '10091853817' };

describe('addressDetails object', () => {
  describe('formatter', () => {
    it('should return valid json object with no nulls in address when address exists in data set', (done) => {
      const json = addressDetailsObject.formatter(detailsUprn, claimData.validClaim().nino, addressData.multipleAddressesNoneEmpty());
      assert.equal(JSON.stringify(json), JSON.stringify(claimData.validClaimAllAddressNotNull()));
      done();
    });

    it('should return valid json object with all nulls in address when address exists in data set', (done) => {
      const json = addressDetailsObject.formatter(detailsUprn, claimData.validClaim().nino, addressData.addressBaseAllEmpty());
      assert.equal(JSON.stringify(json), JSON.stringify(claimData.validClaimAllAddressNull()));
      done();
    });

    it('should return valid json object with thorughfare from street array and postTown from townName', (done) => {
      const json = addressDetailsObject.formatter(detailsUprn, claimData.validClaim().nino, addressData.singleAddressWithStreetArrayAndTownName());
      assert.equal(JSON.stringify(json), JSON.stringify(claimData.validClaimAllAddressWithLocalAuthorityData()));
      done();
    });
  });
});
