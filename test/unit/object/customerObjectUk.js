const assert = require('assert');

const customerObject = require('../../../lib/customerObject');

const detailsUK = {
  title: 'Mr',
  firstName: 'Joe',
  surname: 'Bloggs',
  inviteKey: 'BLOG1234',
  dobDay: 5,
  dobMonth: 5,
  dobYear: 1970,
  dobV: 'V',
  gender: 'Male',
  nino: 'AA370773A',
  address: 'UK',
  subBuildingName: 'Sub Building Name',
  buildingName: 'Building Name',
  buildingNumber: 'Building Number',
  dependentThoroughfareName: 'Dependent Thoroughfare Name',
  thoroughfareName: 'Thoroughfare Name',
  dependentLocality: 'Dependent Locality',
  postTown: 'Post Town',
  postCode: 'Post Code',
};

const detailsNoSubBuildingNameUK = JSON.parse(JSON.stringify(detailsUK));
detailsNoSubBuildingNameUK.subBuildingName = '';

const detailsNoBuildingNameUK = JSON.parse(JSON.stringify(detailsUK));
detailsNoBuildingNameUK.buildingName = '';

const detailsNoBuildingNumberUK = JSON.parse(JSON.stringify(detailsUK));
detailsNoBuildingNumberUK.buildingNumber = '';

const detailsNoDependentThoroughfareNameUK = JSON.parse(JSON.stringify(detailsUK));
detailsNoDependentThoroughfareNameUK.dependentThoroughfareName = '';

const detailsNoThoroughfareNameUK = JSON.parse(JSON.stringify(detailsUK));
detailsNoThoroughfareNameUK.thoroughfareName = '';

const detailsNoPostTownUK = JSON.parse(JSON.stringify(detailsUK));
detailsNoPostTownUK.postTown = '';

const agentRefObject = {
  username: 'test@test.com',
};

const validJson = {
  title: 'Mr',
  firstName: 'Joe',
  surname: 'Bloggs',
  dob: '1970-5-5T00:00:00.000Z',
  dobVerification: 'V',
  gender: 'Male',
  nino: 'AA370773A',
  inviteKey: 'BLOG1234',
  agentRef: 'test@test.com',
  residentialAddress: {
    thoroughfareName: 'Thoroughfare Name',
    postCode: 'Post Code',
    subBuildingName: 'Sub Building Name',
    buildingName: 'Building Name',
    buildingNumber: 'Building Number',
    dependentThoroughfareName: 'Dependent Thoroughfare Name',
    dependentLocality: 'Dependent Locality',
    postTown: 'Post Town',
  },
};

const validJsonNoSubBuildingNameUK = JSON.parse(JSON.stringify(validJson));
delete validJsonNoSubBuildingNameUK.residentialAddress.subBuildingName;

const validJsonNoBuildingNameUK = JSON.parse(JSON.stringify(validJson));
delete validJsonNoBuildingNameUK.residentialAddress.buildingName;

const validJsonNoBuildingNumberUK = JSON.parse(JSON.stringify(validJson));
delete validJsonNoBuildingNumberUK.residentialAddress.buildingNumber;

const validJsonNoDependentThoroughfareNameUK = JSON.parse(JSON.stringify(validJson));
delete validJsonNoDependentThoroughfareNameUK.residentialAddress.dependentThoroughfareName;

const validJsonNoThoroughfareNameUK = JSON.parse(JSON.stringify(validJson));
delete validJsonNoThoroughfareNameUK.residentialAddress.thoroughfareName;

const validJsonNoPostTownUK = JSON.parse(JSON.stringify(validJson));
delete validJsonNoPostTownUK.residentialAddress.postTown;

describe('Customer object formatter in the UK ', () => {
  it('should return valid json when object is called for BST date', (done) => {
    const json = customerObject.formatter(detailsUK, agentRefObject);
    assert.equal(JSON.stringify(json), JSON.stringify(validJson));
    done();
  });
  it('should return valid json with no sub building name, when sub building name is empty', (done) => {
    const json = customerObject.formatter(detailsNoSubBuildingNameUK, agentRefObject);
    assert.equal(JSON.stringify(json), JSON.stringify(validJsonNoSubBuildingNameUK));
    done();
  });
  it('should return valid json with no building name, when building name is empty', (done) => {
    const json = customerObject.formatter(detailsNoBuildingNameUK, agentRefObject);
    assert.equal(JSON.stringify(json), JSON.stringify(validJsonNoBuildingNameUK));
    done();
  });
  it('should return valid json with no building number, when building number is empty', (done) => {
    const json = customerObject.formatter(detailsNoBuildingNumberUK, agentRefObject);
    assert.equal(JSON.stringify(json), JSON.stringify(validJsonNoBuildingNumberUK));
    done();
  });
  it('should return valid json with no dependent thoroughfare name, when dependent thoroughfare name is empty', (done) => {
    const json = customerObject.formatter(detailsNoDependentThoroughfareNameUK, agentRefObject);
    assert.equal(JSON.stringify(json), JSON.stringify(validJsonNoDependentThoroughfareNameUK));
    done();
  });
  it('should return valid json with no post town, when post town is empty', (done) => {
    const json = customerObject.formatter(detailsNoPostTownUK, agentRefObject);
    assert.equal(JSON.stringify(json), JSON.stringify(validJsonNoPostTownUK));
    done();
  });
});
