const { assert } = require('chai');
const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../../../../config/i18next');

const bankOrBuildingSummary = require('../../../../../../lib/objects/view/summary-objects/bankOrBuildingSummary');

const accountDetailObject = (detail) => ({ accountDetail: detail });
const bankObject = accountDetailObject({
  accountHolder: 'Joe Bloggs', accountNumber: '12345678', sortCode: '112233',
});
const buildingObject = accountDetailObject({
  accountHolder: 'Joe Bloggs', accountNumber: '12345678', sortCode: '112233', referenceNumber: 'referenceNumber213123',
});

// Formatted object
const base = {
  header: 'Bank or building society account details',
};
const summaryObjects = {
  bank: {
    ...base,
    classes: null,
    rows: [{
      key: { text: 'Account number' },
      value: { text: '12345678' },
    }, {
      key: { text: 'Sort code' },
      value: { text: '11 22 33' },
    }, {
      key: { text: 'Account holder name' },
      value: { text: 'Joe Bloggs' },
    }],
  },
  building: {
    ...base,
    classes: null,
    rows: [{
      key: { text: 'Account number' },
      value: { text: '12345678' },
    }, {
      key: { text: 'Sort code' },
      value: { text: '11 22 33' },
    }, {
      key: { text: 'Roll or reference number' },
      value: { text: 'referenceNumber213123' },
    }, {
      key: { text: 'Account holder name' },
      value: { text: 'Joe Bloggs' },
    }],
  },
};

describe('bankOrBuildingSummary ', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

  it('should return formatted bank summary object', () => {
    const summary = bankOrBuildingSummary(bankObject);
    assert.deepEqual(summary, summaryObjects.bank);
  });

  it('should return formatted building society summary object', () => {
    const summary = bankOrBuildingSummary(buildingObject);
    assert.deepEqual(summary, summaryObjects.building);
  });
});
