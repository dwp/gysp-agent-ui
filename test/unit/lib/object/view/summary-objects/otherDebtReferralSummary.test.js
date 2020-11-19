const { assert } = require('chai');
const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../../../../config/i18next');

const otherDebtReferralSummary = require('../../../../../../lib/objects/view/summary-objects/otherDebtReferralSummary');

const awardObjectBase = {
  paymentDay: 'MONDAY',
  paymentFrequency: '2W',
};
const awardObjectWithNotification = {
  ...awardObjectBase,
  deathDetail: {
    notificationDate: 1526191200000,
  },
};

// Formatted object
const summaryObjectBase = {
  header: 'Other debt referral details',
  classes: null,
};
const summaryWithoutNotificationObject = {
  ...summaryObjectBase,
  rows: [{
    key: { text: 'Payment day' },
    value: { text: 'Monday' },
  }, {
    key: { text: 'Payment frequency' },
    value: { text: '2 weekly' },
  }],
};
const summaryWithNotificationObject = {
  ...summaryObjectBase,
  rows: [{
    key: { text: 'Payment day' },
    value: { text: 'Monday' },
  }, {
    key: { text: 'Payment frequency' },
    value: { text: '2 weekly' },
  }, {
    key: { text: 'Date the death was recorded' },
    value: { text: '13 May 2018' },
  }],
};

describe('claimantSummary ', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

  it('should return formatted summary object with no death recorded date', () => {
    const summary = otherDebtReferralSummary(awardObjectBase);
    assert.deepEqual(summary, summaryWithoutNotificationObject);
  });

  it('should return formatted summary object with rows when no payeeDetails present ', () => {
    const summary = otherDebtReferralSummary(awardObjectWithNotification);
    assert.deepEqual(summary, summaryWithNotificationObject);
  });
});
