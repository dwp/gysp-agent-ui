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

const currentAddAwardDetails = {
  nino: 'AA370773A',
  contactDetail: {
    homeTelephoneNumber: null,
    workTelephoneNumber: null,
    mobileTelephoneNumber: null,
    email: null,
  },
};

const validHomeJson = {
  homeTelephoneNumber: '111111111111',
  workTelephoneNumber: '000000000000',
  mobileTelephoneNumber: '000000000000',
  email: 'a@b.com',
  nino: 'AA370773A',
  eventCategory: 'CONTACT',
  eventType: 'CHANGE',
  eventName: 'contact-details:timeline.home_phone_number.changed',
};

const validAddHomeJson = {
  homeTelephoneNumber: '111111111111',
  workTelephoneNumber: null,
  mobileTelephoneNumber: null,
  email: null,
  nino: 'AA370773A',
  eventCategory: 'CONTACT',
  eventType: 'ADD',
  eventName: 'contact-details:timeline.home_phone_number.added',
};

const validWorkJson = {
  homeTelephoneNumber: '000000000000',
  workTelephoneNumber: '111111111111',
  mobileTelephoneNumber: '000000000000',
  email: 'a@b.com',
  nino: 'AA370773A',
  eventCategory: 'CONTACT',
  eventType: 'CHANGE',
  eventName: 'contact-details:timeline.work_phone_number.changed',
};

const validAddWorkJson = {
  homeTelephoneNumber: null,
  workTelephoneNumber: '111111111111',
  mobileTelephoneNumber: null,
  email: null,
  nino: 'AA370773A',
  eventCategory: 'CONTACT',
  eventType: 'ADD',
  eventName: 'contact-details:timeline.work_phone_number.added',
};

const validMobileJson = {
  homeTelephoneNumber: '000000000000',
  workTelephoneNumber: '000000000000',
  mobileTelephoneNumber: '111111111111',
  email: 'a@b.com',
  nino: 'AA370773A',
  eventCategory: 'CONTACT',
  eventType: 'CHANGE',
  eventName: 'contact-details:timeline.mobile_phone_number.changed',
};

const validAddMobileJson = {
  homeTelephoneNumber: null,
  workTelephoneNumber: null,
  mobileTelephoneNumber: '111111111111',
  email: null,
  nino: 'AA370773A',
  eventCategory: 'CONTACT',
  eventType: 'ADD',
  eventName: 'contact-details:timeline.mobile_phone_number.added',
};

const validEmailJson = {
  homeTelephoneNumber: '000000000000',
  workTelephoneNumber: '000000000000',
  mobileTelephoneNumber: '000000000000',
  email: 'b@a.com',
  nino: 'AA370773A',
  eventCategory: 'CONTACT',
  eventType: 'CHANGE',
  eventName: 'contact-details:timeline.email.changed',
};

const validAddEmailJson = {
  homeTelephoneNumber: null,
  workTelephoneNumber: null,
  mobileTelephoneNumber: null,
  email: 'b@a.com',
  nino: 'AA370773A',
  eventCategory: 'CONTACT',
  eventType: 'ADD',
  eventName: 'contact-details:timeline.email.added',
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
    it('should return valid updated json when object is called with home as type - add', (done) => {
      const details = JSON.parse(JSON.stringify(currentAddAwardDetails));
      const json = contactDetailsObject.formatter(validHomePhoneDetails, details, 'home');
      assert.equal(JSON.stringify(json), JSON.stringify(validAddHomeJson));
      done();
    });

    it('should return valid updated json when object is called with home as type - change', (done) => {
      const details = JSON.parse(JSON.stringify(currentAwardDetails));
      const json = contactDetailsObject.formatter(validHomePhoneDetails, details, 'home');
      assert.equal(JSON.stringify(json), JSON.stringify(validHomeJson));
      done();
    });

    it('should return valid updated json when object is called with work as type - add', (done) => {
      const details = JSON.parse(JSON.stringify(currentAddAwardDetails));
      const json = contactDetailsObject.formatter(validWorkPhoneDetails, details, 'work');
      assert.equal(JSON.stringify(json), JSON.stringify(validAddWorkJson));
      done();
    });

    it('should return valid updated json when object is called with work as type - change', (done) => {
      const details = JSON.parse(JSON.stringify(currentAwardDetails));
      const json = contactDetailsObject.formatter(validWorkPhoneDetails, details, 'work');
      assert.equal(JSON.stringify(json), JSON.stringify(validWorkJson));
      done();
    });

    it('should return valid updated json with when object is called with mobile as type - add', (done) => {
      const details = JSON.parse(JSON.stringify(currentAddAwardDetails));
      const json = contactDetailsObject.formatter(validMobilePhoneDetails, details, 'mobile');
      assert.equal(JSON.stringify(json), JSON.stringify(validAddMobileJson));
      done();
    });

    it('should return valid updated json with when object is called with mobile as type - change', (done) => {
      const details = JSON.parse(JSON.stringify(currentAwardDetails));
      const json = contactDetailsObject.formatter(validMobilePhoneDetails, details, 'mobile');
      assert.equal(JSON.stringify(json), JSON.stringify(validMobileJson));
      done();
    });

    it('should return valid updated json with when object is called with email as type - add', (done) => {
      const details = JSON.parse(JSON.stringify(currentAddAwardDetails));
      const json = contactDetailsObject.formatter(validEmailDetails, details, 'email');
      assert.equal(JSON.stringify(json), JSON.stringify(validAddEmailJson));
      done();
    });

    it('should return valid updated json with when object is called with email as type - change', (done) => {
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
