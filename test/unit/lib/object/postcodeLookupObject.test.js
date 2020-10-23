const assert = require('assert');
const addressData = require('../../../lib/addressData');

const removeContactDetailsObject = require('../../../../lib/objects/postcodeLookupObject');

const postcodeWithSpaces = { postcode: '  NE1 1RT  ' };
const postcodeWithSpacesReturn = { postcode: 'NE11RT' };

const postcodeWithoutSpaces = { postcode: 'NE11RT' };
const postcodeWithoutSpacesReturn = { postcode: 'NE11RT' };

describe('postcodeLookup object', () => {
  describe('formatter', () => {
    it('should return valid json object with no spaces when object contains spaces', (done) => {
      const json = removeContactDetailsObject.formatter(postcodeWithSpaces);
      assert.equal(JSON.stringify(json), JSON.stringify(postcodeWithSpacesReturn));
      done();
    });

    it('should return valid json object with no spaces when object contains no spaces', (done) => {
      const json = removeContactDetailsObject.formatter(postcodeWithoutSpaces);
      assert.equal(JSON.stringify(json), JSON.stringify(postcodeWithoutSpacesReturn));
      done();
    });
  });

  describe('addressList', () => {
    it('should return valid json array in correct format and count for select box when multiple addresses are supplied', (done) => {
      const json = removeContactDetailsObject.addressList(addressData.multipleAddresses());
      assert.equal(JSON.stringify(json), JSON.stringify(addressData.multipleAddressesList()));
      assert.equal(json[0].text, '2 addresses found');
      done();
    });

    it('should return valid json array in correct format and count for select box when a single address is supplied', (done) => {
      const json = removeContactDetailsObject.addressList(addressData.singleAddress());
      assert.equal(JSON.stringify(json), JSON.stringify(addressData.singleAddressesList()));
      assert.equal(json[0].text, '1 address found');
      done();
    });
  });
});
