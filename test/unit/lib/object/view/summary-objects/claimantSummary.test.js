const { assert } = require('chai');
const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../../../../config/i18next');

const claimantSummary = require('../../../../../../lib/objects/view/summary-objects/claimantSummary');

const awardObject = {
  nino: 'AA370773A', firstName: 'Joe', surname: 'Bloggs',
};

// Formatted object
const summaryObject = {
  header: 'Claimant\'s details',
  classes: null,
  rows: [{
    key: { text: 'National Insurance number' },
    value: { text: 'AA 37 07 73 A' },
  }, {
    key: { text: 'Full name' },
    value: { text: 'Joe Bloggs' },
  }],
};

describe('claimantSummary ', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

  it('should return formatted summary object', () => {
    const summary = claimantSummary(awardObject);
    assert.deepEqual(summary, summaryObject);
  });
});
