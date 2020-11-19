const { assert } = require('chai');
const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../../../../config/i18next');

const dapSummary = require('../../../../../../lib/objects/view/summary-objects/dapSummary');

const awardObject = {
  deathDetail: {
    payeeDetails: {
      fullName: 'Adam Dennis',
      phoneNumber: '0234 1234567',
      payeeAddress: {
        buildingName: null,
        buildingNumber: '2',
        dependentLocality: null,
        dependentThoroughfareName: null,
        postCode: 'LO1 1TY',
        postTown: 'LONDON',
        subBuildingName: null,
        thoroughfareName: 'TEST WAY',
        uprn: '1230004234234',
      },
    },
  },
};

const awardObjectNoPayeeDetails = { deathDetail: { } };

// Formatted object
const summaryObjectBase = {
  header: 'Details of the person dealing with the estate',
  classes: null,
  empty: 'No details held.',
};
const summaryObject = {
  ...summaryObjectBase,
  rows: [{
    key: { text: 'Full name' },
    value: { text: 'Adam Dennis' },
  }, {
    key: { text: 'Phone number' },
    value: { text: '0234 1234567' },
  }, {
    key: { text: 'Address' },
    value: { html: '2 TEST WAY<br />LONDON<br />LO1 1TY' },
  }],
};

describe('claimantSummary ', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

  it('should return formatted summary object with rows when payeeDetails present ', () => {
    const summary = dapSummary(awardObject);
    assert.deepEqual(summary, summaryObject);
  });

  it('should return formatted summary object with rows when no payeeDetails present ', () => {
    const summary = dapSummary(awardObjectNoPayeeDetails);
    assert.deepEqual(summary, summaryObjectBase);
  });
});
