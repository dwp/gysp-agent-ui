const assert = require('assert');
const claimData = require('../../lib/claimData');

const object = require('../../../lib/objects/accountDetailsObject');

const numericSortCode = { accountName: 'Mr Joe Bloggs', accountNumber: '12345678', sortCode: '112233' };
const numericSortCodeResponse = {
  accountName: 'Mr Joe Bloggs',
  accountNumber: '12345678',
  sortCode: '112233',
  nino: 'AA370773A',
  eventCategory: 'PAYMENT',
  eventType: 'CHANGE',
  eventName: 'payment:timeline.banking_details.changed',
};

const numericHyphenedSortCode = { accountName: 'Mr Joe Bloggs', accountNumber: '12345678', sortCode: '11-22-33' };
const numericHyphenedSortCodeResponse = {
  accountName: 'Mr Joe Bloggs',
  accountNumber: '12345678',
  sortCode: '112233',
  nino: 'AA370773A',
  eventCategory: 'PAYMENT',
  eventType: 'CHANGE',
  eventName: 'payment:timeline.banking_details.changed',
};

const numericSpacesSortCode = { accountName: 'Mr Joe Bloggs', accountNumber: '12345678', sortCode: '11 22 33' };
const numericSpacesSortCodeResponse = {
  accountName: 'Mr Joe Bloggs',
  accountNumber: '12345678',
  sortCode: '112233',
  nino: 'AA370773A',
  eventCategory: 'PAYMENT',
  eventType: 'CHANGE',
  eventName: 'payment:timeline.banking_details.changed',
};

const numericHyphenedSpacesSortCode = { accountName: 'Mr Joe Bloggs', accountNumber: '12345678', sortCode: '  11-22-33  ' };
const numericHyphenedSpacesSortCodeResponse = {
  accountName: 'Mr Joe Bloggs',
  accountNumber: '12345678',
  sortCode: '112233',
  nino: 'AA370773A',
  eventCategory: 'PAYMENT',
  eventType: 'CHANGE',
  eventName: 'payment:timeline.banking_details.changed',
};

const referenceNumber = {
  accountName: 'Mr Joe Bloggs', accountNumber: '12345678', sortCode: '112233', referenceNumber: '1234567',
};
const referenceNumberResponse = {
  accountName: 'Mr Joe Bloggs',
  accountNumber: '12345678',
  sortCode: '112233',
  nino: 'AA370773A',
  referenceNumber: '1234567',
  eventCategory: 'PAYMENT',
  eventType: 'CHANGE',
  eventName: 'payment:timeline.banking_details.changed',
};

describe('accountDetailsObject object', () => {
  describe('formatter', () => {
    it('should return valid json object when sort code is numeric', (done) => {
      const json = object.formatter(numericSortCode, claimData.validClaim());
      assert.equal(JSON.stringify(json), JSON.stringify(numericSortCodeResponse));
      done();
    });

    it('should return valid json object when sort code is numeric and hyphened', (done) => {
      const json = object.formatter(numericHyphenedSortCode, claimData.validClaim());
      assert.equal(JSON.stringify(json), JSON.stringify(numericHyphenedSortCodeResponse));
      done();
    });

    it('should return valid json object when sort code is numeric and spaces', (done) => {
      const json = object.formatter(numericSpacesSortCode, claimData.validClaim());
      assert.equal(JSON.stringify(json), JSON.stringify(numericSpacesSortCodeResponse));
      done();
    });

    it('should return valid json object when sort code is numeric, hyphened and spaces', (done) => {
      const json = object.formatter(numericHyphenedSpacesSortCode, claimData.validClaim());
      assert.equal(JSON.stringify(json), JSON.stringify(numericHyphenedSpacesSortCodeResponse));
      done();
    });

    it('should return valid json object with referenceNumber when referenceNumber is present', (done) => {
      const json = object.formatter(referenceNumber, claimData.validClaim());
      assert.equal(JSON.stringify(json), JSON.stringify(referenceNumberResponse));
      done();
    });
  });
});
