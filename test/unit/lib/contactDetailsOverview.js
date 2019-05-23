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

  describe('address ', () => {
    it('should return formatted array the when thoroughfare name is not null', () => {
      const address = changeCircumstancesOverview.address(claimData.validAddressWithThoroughfare());
      assert.equal(JSON.stringify(address), JSON.stringify(claimData.validAddressWithThoroughfareResult()));
    });

    it('should return formatted array the when thoroughfare name is null', () => {
      const address = changeCircumstancesOverview.address(claimData.validAddressWithoutThoroughfare());
      assert.equal(JSON.stringify(address), JSON.stringify(claimData.validAddressWithoutThoroughfareResult()));
    });
  });

  describe('addressWhereThoroughfareIsNullButPostTownExists ', () => {
    it('should return formatted address array the when only subBuildingName, buildingName, postTown and postCode are present', () => {
      const address = changeCircumstancesOverview.addressWhereThoroughfareIsNullButPostTownExists(claimData.validAddressSubBuildingNamebuildingName());
      assert.equal(JSON.stringify(address), JSON.stringify(claimData.validAddressSubBuildingNamebuildingNameResult()));
    });

    it('should return formatted address array the when only subBuildingName, postTown and postCode are present', () => {
      const address = changeCircumstancesOverview.addressWhereThoroughfareIsNullButPostTownExists(claimData.validAddressSubBuildingName());
      assert.equal(JSON.stringify(address), JSON.stringify(claimData.validAddressSubBuildingNameResult()));
    });

    it('should return formatted address array the when only buildingName, postTown and postCode are present', () => {
      const address = changeCircumstancesOverview.addressWhereThoroughfareIsNullButPostTownExists(claimData.validAddressBuildingName());
      assert.equal(JSON.stringify(address), JSON.stringify(claimData.validAddressBuildingNameResult()));
    });

    it('should return formatted address array the when only buildingName, buildingNumber, dependentLocality, postTown and postCode are present', () => {
      const address = changeCircumstancesOverview.addressWhereThoroughfareIsNullButPostTownExists(claimData.validAddressBuildingNameBuildingNumberDependentLocality());
      assert.equal(JSON.stringify(address), JSON.stringify(claimData.validAddressBuildingNameBuildingNumberDependentLocalityResult()));
    });

    it('should return formatted address array the when only buildingNumber, dependentLocality, postTown and postCode are present', () => {
      const address = changeCircumstancesOverview.addressWhereThoroughfareIsNullButPostTownExists(claimData.validAddressBuildingNumberDependentLocality());
      assert.equal(JSON.stringify(address), JSON.stringify(claimData.validAddressBuildingNumberDependentLocalityResult()));
    });

    it('should return formatted address array the when only dependentLocality, postTown and postCode are present', () => {
      const address = changeCircumstancesOverview.addressWhereThoroughfareIsNullButPostTownExists(claimData.validAddressDependentLocality());
      assert.equal(JSON.stringify(address), JSON.stringify(claimData.validAddressDependentLocalityResult()));
    });

    it('should return formatted address array the when only buildingNumber, postTown and postCode are present', () => {
      const address = changeCircumstancesOverview.addressWhereThoroughfareIsNullButPostTownExists(claimData.validAddressBuildingNumber());
      assert.equal(JSON.stringify(address), JSON.stringify(claimData.validAddressBuildingNumberResult()));
    });
  });

  describe('addressDataWhereThoroughfareExists ', () => {
    it('should return formatted address array the when subBuildingName, buildingName, buildingNumber, thoroughfareName, postTown and postCode are present', () => {
      const address = changeCircumstancesOverview.addressDataWhereThoroughfareExists(claimData.validAddressSubBuildingNamebBuildingNameBuildingNumberThoroughfareName());
      assert.equal(JSON.stringify(address), JSON.stringify(claimData.validAddressSubBuildingNamebBuildingNameBuildingNumberThoroughfareNameResult()));
    });

    it('should return formatted address array the when subBuildingName, buildingName, thoroughfareName, postTown and postCode are present', () => {
      const address = changeCircumstancesOverview.addressDataWhereThoroughfareExists(claimData.validAddressSubBuildingNamebBuildingNameThoroughfareName());
      assert.equal(JSON.stringify(address), JSON.stringify(claimData.validAddressSubBuildingNamebBuildingNameThoroughfareNameResult()));
    });

    it('should return formatted address array the when subBuildingName, thoroughfareName, postTown and postCode are present', () => {
      const address = changeCircumstancesOverview.addressDataWhereThoroughfareExists(claimData.validAddressSubBuildingNamebThoroughfareName());
      assert.equal(JSON.stringify(address), JSON.stringify(claimData.validAddressSubBuildingNamebThoroughfareNameResult()));
    });

    it('should return formatted address array the when buildingName, thoroughfareName, postTown and postCode are present', () => {
      const address = changeCircumstancesOverview.addressDataWhereThoroughfareExists(claimData.validAddressBuildingNameThoroughfareName());
      assert.equal(JSON.stringify(address), JSON.stringify(claimData.validAddressBuildingNameThoroughfareNameResult()));
    });

    it('should return formatted address array the when buildingNumber, dependentThoroughfareName, thoroughfareName, postTown and postCode are present', () => {
      const address = changeCircumstancesOverview.addressDataWhereThoroughfareExists(claimData.validAddressDependentThoroughfareNameBuildingNumberThoroughfareName());
      assert.equal(JSON.stringify(address), JSON.stringify(claimData.validAddressDependentThoroughfareNameBuildingNumberThoroughfareNameResult()));
    });

    it('should return formatted address array the when buildingNumber, thoroughfareName, postTown and postCode are present', () => {
      const address = changeCircumstancesOverview.addressDataWhereThoroughfareExists(claimData.validAddressBuildingNumberThoroughfareName());
      assert.equal(JSON.stringify(address), JSON.stringify(claimData.validAddressBuildingNumberThoroughfareNameResult()));
    });
  });

  describe('depAndThoroughfareAddressLines ', () => {
    it('should return formatted address array the when dependentThoroughfareName and buildingNumber are present', () => {
      const addressArray = [];
      changeCircumstancesOverview.depAndThoroughfareAddressLines(claimData.validDependentThoroughfareNameBuildingNumber(), addressArray);
      assert.equal(JSON.stringify(addressArray), JSON.stringify(claimData.validDependentThoroughfareNameBuildingNumberResult()));
    });

    it('should return formatted address array the when dependentThoroughfareName are present', () => {
      const addressArray = [];
      changeCircumstancesOverview.depAndThoroughfareAddressLines(claimData.validDependentThoroughfareName(), addressArray);
      assert.equal(JSON.stringify(addressArray), JSON.stringify(claimData.validDependentThoroughfareNameResult()));
    });

    it('should return formatted address array the when dependentThoroughfareName is null and buildingNumber is null', () => {
      const addressArray = [];
      changeCircumstancesOverview.depAndThoroughfareAddressLines(claimData.validDependentThoroughfareNullAndBuildingNumberNull(), addressArray);
      assert.equal(JSON.stringify(addressArray), JSON.stringify(claimData.validDependentThoroughfareNullAndBuildingNumberNullResult()));
    });

    it('should return formatted address array the when dependentThoroughfareName is null and buildingNumber and thoroughfareName present ', () => {
      const addressArray = [];
      changeCircumstancesOverview.depAndThoroughfareAddressLines(claimData.validDependentThoroughfareNullAndBuildingNumber(), addressArray);
      assert.equal(JSON.stringify(addressArray), JSON.stringify(claimData.validDependentThoroughfareNullAndBuildingNumberResult()));
    });
  });
});
