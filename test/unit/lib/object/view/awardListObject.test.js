const { assert } = require('chai');

const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../../../config/i18next');

const awardListObject = require('../../../../../lib/objects/view/awardListObject');
const claimData = require('../../../../lib/claimData');

const head = [
  { text: 'From', classes: 'govuk-!-width-one-third' },
  { text: 'Weekly amount' },
  { text: '' },
  { text: '' },
];

const rowsWithPayment = [
  [
    { text: '6 March 2019' },
    { text: '£110.00' },
    { html: '<a href="/changes-and-enquiries/award/0" class="govuk-link">Details</a>' },
    { html: '<span class="govuk-!-font-size-16 govuk-!-font-weight-bold gysp-secondary-text-colour gysp-payment gysp-payment--active">In payment</span>' },
  ],
];
const rowsWithoutPayment = [
  [
    { text: '6 March 2019' },
    { text: '£110.00' },
    { html: '<a href="/changes-and-enquiries/award/0" class="govuk-link">Details</a>' },
    { text: '' },
  ],
];
const rowsWithToDate = [
  [
    { text: '6 March 2019' },
    { text: '£110.00' },
    { html: '<a href="/changes-and-enquiries/award/0" class="govuk-link">Details</a>' },
    { html: '<span class="govuk-!-font-size-16 govuk-!-font-weight-bold gysp-secondary-text-colour gysp-payment gysp-payment--active">In payment</span>' },
  ],
];
const rowsWithFutureUprating = [
  [
    { text: '6 March 2019' },
    { text: '£110.00' },
    { html: '<a href="/changes-and-enquiries/award/1" class="govuk-link">Details</a>' },
    { html: '<span class="govuk-!-font-size-16 govuk-!-font-weight-bold gysp-secondary-text-colour gysp-payment gysp-payment--active">In payment</span>' },
  ],
];
const rowsWithCurrentUprating = [
  [
    { text: '6 March 2019' },
    { text: '£160.00' },
    { html: '<a href="/changes-and-enquiries/award/0" class="govuk-link">Details</a>' },
    { html: '<span class="govuk-!-font-size-16 govuk-!-font-weight-bold gysp-secondary-text-colour gysp-payment gysp-payment--active">In payment</span>' },
  ],
];

const tableObjectWithPayment = {
  firstCellIsHeader: false,
  head,
  rows: rowsWithPayment,
};

const tableObjectWithoutPayment = {
  firstCellIsHeader: false,
  head,
  rows: rowsWithoutPayment,
};

const tableObjectWithToDate = {
  firstCellIsHeader: false,
  head,
  rows: rowsWithToDate,
};

const tableObjectWithFutureUprating = {
  firstCellIsHeader: false,
  head,
  rows: rowsWithFutureUprating,
};

const tableObjectWithCurrentUprating = {
  firstCellIsHeader: false,
  head,
  rows: rowsWithCurrentUprating,
};

const banner = {
  text: 'This award will increase on 6 March 2019',
  link: 'View new award',
};

describe('awardListObject ', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

  describe('formatter', () => {
    it('should return object', () => {
      const formatted = awardListObject.formatter(claimData.validAwardAmountDetails());
      assert.isObject(formatted.table);
    });

    it('should return formatted table object with payment and without banner', () => {
      const formatted = awardListObject.formatter(claimData.validAwardAmountDetails());
      assert.deepEqual(formatted.table, tableObjectWithPayment);
      assert.isNull(formatted.banner);
    });

    it('should return formatted table object without payment', () => {
      const details = claimData.validAwardAmountDetails();
      details.awardAmounts[0].inPayment = false;
      const formatted = awardListObject.formatter(details);
      assert.deepEqual(formatted.table, tableObjectWithoutPayment);
    });

    it('should return formatted table object with todate', () => {
      const details = claimData.validAwardAmountDetails();
      details.awardAmounts[0].toDate = 1551830400000;
      const formatted = awardListObject.formatter(details);
      assert.deepEqual(formatted.table, tableObjectWithToDate);
    });

    it('should return formatted table object without banner and annual uprating is current', () => {
      const formatted = awardListObject.formatter(claimData.validAwardAmountDetailsFutureUpratingIsCurrent());
      assert.deepEqual(formatted.table, tableObjectWithCurrentUprating);
      assert.isNull(formatted.banner);
    });

    it('should return formatted table object with banner', () => {
      const formatted = awardListObject.formatter(claimData.validAwardAmountDetailsWithCurrentAndFutureUprating());
      assert.deepEqual(formatted.table, tableObjectWithFutureUprating);
      assert.deepEqual(formatted.banner, banner);
    });
  });
});
