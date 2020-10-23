const assert = require('assert');

const nextClaimObject = require('../../../lib/nextClaimObject');

const validDetails = {
  inviteKey: 'TEST000000',
  confirmedAddress: false,
  livedAbroad: true,
  workedAbroad: false,
  declaration: true,
  createdDate: '2017-12-01T15:25:55.605Z',
  customerDetail: {
    title: 'MR',
    createdDate: '2017-12-02T15:25:55.605Z',
    dob: '1952-10-01 15:25:55.605Z',
    statePensionDate: '2017-10-01 15:25:55.605Z',
  },
  partnerDetail: {
    dob: '1956-10-01 15:25:55.605Z',
    civilPartnershipDate: '1956-10-01 15:25:55.605Z',
    marriageDate: '1956-10-01 15:25:55.605Z',
    divorcedDate: '1956-10-01 15:25:55.605Z',
    dissolvedDate: '1956-10-01 15:25:55.605Z',
  },
  reCalculatedSpaDate: '2017-10-01 15:25:55.605Z',
  userAssertedDob: '1956-10-02 15:25:55.605Z',
};

const validJson = {
  inviteKey: 'TEST000000',
  confirmedAddress: 'No',
  livedAbroad: 'Yes',
  workedAbroad: 'No',
  declaration: 'Yes',
  createdDate: '01 12 2017',
  customerDetail: {
    title: 'Mr',
    createdDate: '02 12 2017',
    dob: '01 10 1952',
    statePensionDate: '01 10 2017',
  },
  partnerDetail: {
    dob: '01 10 1956',
    civilPartnershipDate: '01 10 1956',
    marriageDate: '01 10 1956',
    divorcedDate: '01 10 1956',
    dissolvedDate: '01 10 1956',
  },
  reCalculatedSpaDate: '01 10 2017',
  userAssertedDob: '02 10 1956',
  pdfFilename: 'sp claim 01 12 2017 TEST000000.pdf',
};

describe('Next claim object formatter', () => {
  it('should return valid json when object is called', (done) => {
    const json = nextClaimObject.formatter(validDetails);
    assert.equal(JSON.stringify(json), JSON.stringify(validJson));
    done();
  });
});
