const assert = require('assert');

const customerObject = require('../../../lib/customerObject');

const detailsOverseas = {
  title: 'Mr',
  firstName: 'Joe',
  surname: 'Bloggs',
  nino: 'AA370773A',
  dobDay: 5,
  dobMonth: 5,
  dobYear: 1970,
  dobV: 'V',
  gender: 'Male',
  address: 'Overseas',
  addressLine1: 'Address Line 1',
  addressLine2: 'Address Line 2',
  addressLine3: 'Address Line 3',
  addressLine4: 'Address Line 4',
  addressLine5: 'Address Line 5',
  addressLine6: 'Address Line 6',
  addressLine7: 'Address Line 7',
  country: 'Country 1',
};

const detailsNoAddressLine2to7 = {
  title: 'Mr',
  firstName: 'Joe',
  surname: 'Bloggs',
  nino: 'AA370773A',
  dobDay: 5,
  dobMonth: 5,
  dobYear: 1970,
  dobV: 'V',
  gender: 'Male',
  address: 'Overseas',
  addressLine1: 'Address Line 1',
  country: 'Country 1',
};

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
  agentRef: 'test@test.com',
  overseasAddress: {
    line1: 'Address Line 1',
    country: 'Country 1',
    line2: 'Address Line 2',
    line3: 'Address Line 3',
    line4: 'Address Line 4',
    line5: 'Address Line 5',
    line6: 'Address Line 6',
    line7: 'Address Line 7',
  },
};

const validJsonNoAddressLine2to7 = {
  title: 'Mr',
  firstName: 'Joe',
  surname: 'Bloggs',
  dob: '1970-5-5T00:00:00.000Z',
  dobVerification: 'V',
  gender: 'Male',
  nino: 'AA370773A',
  agentRef: 'test@test.com',
  overseasAddress: {
    line1: 'Address Line 1',
    country: 'Country 1',
  },
};

describe('Customer object formatter overseas ', () => {
  it('should return valid json when object is called for Overseas details', (done) => {
    const json = customerObject.formatter(detailsOverseas, agentRefObject);
    assert.equal(JSON.stringify(json), JSON.stringify(validJson));
    done();
  });
  it('should return valid json with no address lines 2-7, when address lines 2-7 are empty', (done) => {
    const json = customerObject.formatter(detailsNoAddressLine2to7, agentRefObject);
    assert.equal(JSON.stringify(json), JSON.stringify(validJsonNoAddressLine2to7));
    done();
  });
});
