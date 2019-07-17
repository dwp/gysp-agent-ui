const assert = require('assert');

const removeContactDetailsObject = require('../../../lib/removeContactDetailsObject');

const currentAwardDetails = {
  nino: 'AA370773A',
  contactDetail: {
    homeTelephoneNumber: '000000000000',
    workTelephoneNumber: '000000000000',
    mobileTelephoneNumber: '000000000000',
  },
};

const validHomeJson = {
  homeTelephoneNumber: null,
  workTelephoneNumber: '000000000000',
  mobileTelephoneNumber: '000000000000',
  nino: 'AA370773A',
  eventCategory: 'CONTACT',
  eventType: 'DELETE',
  eventName: 'contact-details:timeline.home_phone_number.removed',
};

const validWorkJson = {
  homeTelephoneNumber: '000000000000',
  workTelephoneNumber: null,
  mobileTelephoneNumber: '000000000000',
  nino: 'AA370773A',
  eventCategory: 'CONTACT',
  eventType: 'DELETE',
  eventName: 'contact-details:timeline.work_phone_number.removed',
};

const validMobileJson = {
  homeTelephoneNumber: '000000000000',
  workTelephoneNumber: '000000000000',
  mobileTelephoneNumber: null,
  nino: 'AA370773A',
  eventCategory: 'CONTACT',
  eventType: 'DELETE',
  eventName: 'contact-details:timeline.mobile_phone_number.removed',
};

const invalidPhoneDetailsJson = {
  homeTelephoneNumber: '000000000000',
  workTelephoneNumber: '000000000000',
  mobileTelephoneNumber: '000000000000',
  nino: 'AA370773A',
};

describe('contactDetails object', () => {
  describe('formatter', () => {
    it('should return valid updated json when object is called with home as type', (done) => {
      const details = JSON.parse(JSON.stringify(currentAwardDetails));
      const json = removeContactDetailsObject.formatter(details, 'home');
      assert.equal(JSON.stringify(json), JSON.stringify(validHomeJson));
      done();
    });

    it('should return valid updated json when object is called with work as type', (done) => {
      const details = JSON.parse(JSON.stringify(currentAwardDetails));
      const json = removeContactDetailsObject.formatter(details, 'work');
      assert.equal(JSON.stringify(json), JSON.stringify(validWorkJson));
      done();
    });

    it('should return valid updated json with when object is called with mobile as type', (done) => {
      const details = JSON.parse(JSON.stringify(currentAwardDetails));
      const json = removeContactDetailsObject.formatter(details, 'mobile');
      assert.equal(JSON.stringify(json), JSON.stringify(validMobileJson));
      done();
    });

    it('should return valid json without anything updated when object is called with and unknown type', (done) => {
      const details = JSON.parse(JSON.stringify(currentAwardDetails));
      const json = removeContactDetailsObject.formatter(details, 'landline');
      assert.equal(JSON.stringify(json), JSON.stringify(invalidPhoneDetailsJson));
      done();
    });
  });
});
