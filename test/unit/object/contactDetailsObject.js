const assert = require('assert');

const contactDetailsObject = require('../../../lib/contactDetailsObject');

const validHomePhoneDetails = { homePhoneNumber: '111111111111' };
const validWorkPhoneDetails = { workPhoneNumber: '111111111111' };
const validMobilePhoneDetails = { mobilePhoneNumber: '111111111111' };
const validEmailDetails = { email: 'b@a.com' };
const validEmailDetailsWithSpaces = { email: '     b@a.com     ' };
const invalidPhoneDetails = { linelinePhoneNumber: '111111111111' };

const currentAwardDetails = {
  nino: 'AA370773A',
  contactDetail: {
    homeTelephoneNumber: '000000000000',
    workTelephoneNumber: '000000000000',
    mobileTelephoneNumber: '000000000000',
    email: 'a@b.com',
  },
};

const validHomeJson = {
  homeTelephoneNumber: '111111111111',
  workTelephoneNumber: '000000000000',
  mobileTelephoneNumber: '000000000000',
  email: 'a@b.com',
  nino: 'AA370773A',
};

const validWorkJson = {
  homeTelephoneNumber: '000000000000',
  workTelephoneNumber: '111111111111',
  mobileTelephoneNumber: '000000000000',
  email: 'a@b.com',
  nino: 'AA370773A',
};

const validMobileJson = {
  homeTelephoneNumber: '000000000000',
  workTelephoneNumber: '000000000000',
  mobileTelephoneNumber: '111111111111',
  email: 'a@b.com',
  nino: 'AA370773A',
};

const validEmailJson = {
  homeTelephoneNumber: '000000000000',
  workTelephoneNumber: '000000000000',
  mobileTelephoneNumber: '000000000000',
  email: 'b@a.com',
  nino: 'AA370773A',
};

const invalidPhoneDetailsJson = {
  homeTelephoneNumber: '000000000000',
  workTelephoneNumber: '000000000000',
  mobileTelephoneNumber: '000000000000',
  email: 'a@b.com',
  nino: 'AA370773A',
};

describe('contactDetails object', () => {
  describe('formatter', () => {
    it('should return valid updated json when object is called with home as type', (done) => {
      const details = JSON.parse(JSON.stringify(currentAwardDetails));
      const json = contactDetailsObject.formatter(validHomePhoneDetails, details, 'home');
      assert.equal(JSON.stringify(json), JSON.stringify(validHomeJson));
      done();
    });

    it('should return valid updated json when object is called with work as type', (done) => {
      const details = JSON.parse(JSON.stringify(currentAwardDetails));
      const json = contactDetailsObject.formatter(validWorkPhoneDetails, details, 'work');
      assert.equal(JSON.stringify(json), JSON.stringify(validWorkJson));
      done();
    });

    it('should return valid updated json with when object is called with mobile as type', (done) => {
      const details = JSON.parse(JSON.stringify(currentAwardDetails));
      const json = contactDetailsObject.formatter(validMobilePhoneDetails, details, 'mobile');
      assert.equal(JSON.stringify(json), JSON.stringify(validMobileJson));
      done();
    });

    it('should return valid updated json with when object is called with email as type', (done) => {
      const details = JSON.parse(JSON.stringify(currentAwardDetails));
      const json = contactDetailsObject.formatter(validEmailDetails, details, 'email');
      assert.equal(JSON.stringify(json), JSON.stringify(validEmailJson));
      done();
    });

    it('should return valid updated json with when object is called with email as type and email input has spaces either side', (done) => {
      const details = JSON.parse(JSON.stringify(currentAwardDetails));
      const json = contactDetailsObject.formatter(validEmailDetailsWithSpaces, details, 'email');
      assert.equal(JSON.stringify(json), JSON.stringify(validEmailJson));
      done();
    });

    it('should return valid json without anything updated when object is called with and unknown type', (done) => {
      const details = JSON.parse(JSON.stringify(currentAwardDetails));
      const json = contactDetailsObject.formatter(invalidPhoneDetails, details, 'landline');
      assert.equal(JSON.stringify(json), JSON.stringify(invalidPhoneDetailsJson));
      done();
    });
  });
});
