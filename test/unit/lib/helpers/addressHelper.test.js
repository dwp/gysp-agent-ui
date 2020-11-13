const { assert } = require('chai');

const helper = require('../../../../lib/helpers/addressHelper');
const claimData = require('../../../lib/claimData');
const addressData = require('../../../lib/addressData');

const detailsUprn = { address: '10091853817' };

describe('address helper', () => {
  describe('address', () => {
    it('should return formatted array the when thoroughfare name is not null', () => {
      const address = helper.address(claimData.validAddressWithThoroughfare());
      assert.equal(JSON.stringify(address), JSON.stringify(claimData.validAddressWithThoroughfareResult()));
    });

    it('should return formatted array the when thoroughfare name is null', () => {
      const address = helper.address(claimData.validAddressWithoutThoroughfare());
      assert.equal(JSON.stringify(address), JSON.stringify(claimData.validAddressWithoutThoroughfareResult()));
    });
  });

  describe('addressWhereThoroughfareIsNullButPostTownExists ', () => {
    it('should return formatted address array the when only subBuildingName, buildingName, postTown and postCode are present', () => {
      const address = helper.address(claimData.validAddressSubBuildingNameBuildingName());
      assert.equal(JSON.stringify(address), JSON.stringify(claimData.validAddressSubBuildingNameBuildingNameResult()));
    });

    it('should return formatted address array the when only subBuildingName, postTown and postCode are present', () => {
      const address = helper.address(claimData.validAddressSubBuildingName());
      assert.equal(JSON.stringify(address), JSON.stringify(claimData.validAddressSubBuildingNameResult()));
    });

    it('should return formatted address array the when only buildingName, postTown and postCode are present', () => {
      const address = helper.address(claimData.validAddressBuildingName());
      assert.equal(JSON.stringify(address), JSON.stringify(claimData.validAddressBuildingNameResult()));
    });

    it('should return formatted address array the when only buildingName, buildingNumber, dependentLocality, postTown and postCode are present', () => {
      const address = helper.address(claimData.validAddressBuildingNameBuildingNumberDependentLocality());
      assert.equal(JSON.stringify(address), JSON.stringify(claimData.validAddressBuildingNameBuildingNumberDependentLocalityResult()));
    });

    it('should return formatted address array the when only buildingNumber, dependentLocality, postTown and postCode are present', () => {
      const address = helper.address(claimData.validAddressBuildingNumberDependentLocality());
      assert.equal(JSON.stringify(address), JSON.stringify(claimData.validAddressBuildingNumberDependentLocalityResult()));
    });

    it('should return formatted address array the when only dependentLocality, postTown and postCode are present', () => {
      const address = helper.address(claimData.validAddressDependentLocality());
      assert.equal(JSON.stringify(address), JSON.stringify(claimData.validAddressDependentLocalityResult()));
    });

    it('should return formatted address array the when only buildingNumber, postTown and postCode are present', () => {
      const address = helper.address(claimData.validAddressBuildingNumber());
      assert.equal(JSON.stringify(address), JSON.stringify(claimData.validAddressBuildingNumberResult()));
    });
  });

  describe('addressDataWhereThoroughfareExists ', () => {
    it('should return formatted address array the when subBuildingName, buildingName, buildingNumber, thoroughfareName, postTown and postCode are present', () => {
      const address = helper.address(claimData.validAddressSubBuildingNamebBuildingNameBuildingNumberThoroughfareName());
      assert.equal(JSON.stringify(address), JSON.stringify(claimData.validAddressSubBuildingNamebBuildingNameBuildingNumberThoroughfareNameResult()));
    });

    it('should return formatted address array the when subBuildingName, buildingName, thoroughfareName, postTown and postCode are present', () => {
      const address = helper.address(claimData.validAddressSubBuildingNamebBuildingNameThoroughfareName());
      assert.equal(JSON.stringify(address), JSON.stringify(claimData.validAddressSubBuildingNamebBuildingNameThoroughfareNameResult()));
    });

    it('should return formatted address array the when subBuildingName, thoroughfareName, postTown and postCode are present', () => {
      const address = helper.address(claimData.validAddressSubBuildingNamebThoroughfareName());
      assert.equal(JSON.stringify(address), JSON.stringify(claimData.validAddressSubBuildingNamebThoroughfareNameResult()));
    });

    it('should return formatted address array the when buildingName, thoroughfareName, postTown and postCode are present', () => {
      const address = helper.address(claimData.validAddressBuildingNameThoroughfareName());
      assert.equal(JSON.stringify(address), JSON.stringify(claimData.validAddressBuildingNameThoroughfareNameResult()));
    });

    it('should return formatted address array the when buildingNumber, dependentThoroughfareName, thoroughfareName, postTown and postCode are present', () => {
      const address = helper.address(claimData.validAddressDependentThoroughfareNameBuildingNumberThoroughfareName());
      assert.equal(JSON.stringify(address), JSON.stringify(claimData.validAddressDependentThoroughfareNameBuildingNumberThoroughfareNameResult()));
    });

    it('should return formatted address array the when buildingNumber, thoroughfareName, postTown and postCode are present', () => {
      const address = helper.address(claimData.validAddressBuildingNumberThoroughfareName());
      assert.equal(JSON.stringify(address), JSON.stringify(claimData.validAddressBuildingNumberThoroughfareNameResult()));
    });
  });

  describe('depAndThoroughfareAddressLines ', () => {
    it('should return formatted address array the when dependentThoroughfareName and buildingNumber are present', () => {
      const addressArray = helper.address(claimData.validDependentThoroughfareNameBuildingNumber());
      assert.equal(JSON.stringify(addressArray), JSON.stringify(claimData.validDependentThoroughfareNameBuildingNumberResult()));
    });

    it('should return formatted address array the when dependentThoroughfareName are present', () => {
      const addressArray = helper.address(claimData.validDependentThoroughfareName());
      assert.equal(JSON.stringify(addressArray), JSON.stringify(claimData.validDependentThoroughfareNameResult()));
    });

    it('should return formatted address array the when dependentThoroughfareName is null and buildingNumber is null', () => {
      const addressArray = helper.address(claimData.validDependentThoroughfareNullAndBuildingNumberNull());
      assert.equal(JSON.stringify(addressArray), JSON.stringify(claimData.validDependentThoroughfareNullAndBuildingNumberNullResult()));
    });

    it('should return formatted address array the when dependentThoroughfareName is null and buildingNumber and thoroughfareName present ', () => {
      const addressArray = helper.address(claimData.validDependentThoroughfareNullAndBuildingNumber());
      assert.equal(JSON.stringify(addressArray), JSON.stringify(claimData.validDependentThoroughfareNullAndBuildingNumberResult()));
    });
  });
  describe('AddressLookupApiFormatter ', () => {
    it('should return valid json object with thorughfare from street array and postTown from townName', (done) => {
      const json = helper.addressLookupApiFormatter(detailsUprn, addressData.singleAddressWithStreetArrayAndTownName());
      assert.equal(JSON.stringify(json), JSON.stringify(claimData.validUkAddressLocalAuthorityData()));
      done();
    });
  });
});
