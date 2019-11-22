const { assert } = require('chai');
const awardListObject = require('../../../../lib/objects/view/awardListObject');
const claimData = require('../../../lib/claimData');

const head = [
  { text: 'award-list:table.head.from', classes: 'govuk-!-width-one-quarter' },
  { text: 'award-list:table.head.to', classes: 'govuk-!-width-one-quarter' },
  { text: 'award-list:table.head.weekly-amount' },
  { text: '' },
  { text: '' },
];

const rowsWithPayment = [
  [
    { text: '6 March 2019' },
    { text: '' },
    { text: '£110.00' },
    { html: '<a href="/changes-and-enquiries/award/0" class="govuk-link">Details</a>' },
    { html: '<span class="govuk-!-font-size-16 govuk-!-font-weight-bold gysp-secondary-text-colour gysp-payment gysp-payment--active">In Payment</span>' },
  ],
];
const rowsWithoutPayment = [
  [
    { text: '6 March 2019' },
    { text: '' },
    { text: '£110.00' },
    { html: '<a href="/changes-and-enquiries/award/0" class="govuk-link">Details</a>' },
    { text: '' },
  ],
];
const rowsWithToDate = [
  [
    { text: '6 March 2019' },
    { text: '6 March 2019' },
    { text: '£110.00' },
    { html: '<a href="/changes-and-enquiries/award/0" class="govuk-link">Details</a>' },
    { html: '<span class="govuk-!-font-size-16 govuk-!-font-weight-bold gysp-secondary-text-colour gysp-payment gysp-payment--active">In Payment</span>' },
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

describe('awardListObject ', () => {
  describe('formatter', () => {
    it('should return object', () => {
      const formatted = awardListObject.formatter(claimData.validAwardAmountDetails());
      assert.isObject(formatted);
    });
    it('should return formatted table object with payment', () => {
      const formatted = awardListObject.formatter(claimData.validAwardAmountDetails());
      assert.deepEqual(formatted, tableObjectWithPayment);
    });
    it('should return formatted table object without payment', () => {
      const details = claimData.validAwardAmountDetails();
      details.awardAmounts[0].inPayment = false;
      const formatted = awardListObject.formatter(details);
      assert.deepEqual(formatted, tableObjectWithoutPayment);
    });
    it('should return formatted table object with todate', () => {
      const details = claimData.validAwardAmountDetails();
      details.awardAmounts[0].toDate = 1551830400000;
      const formatted = awardListObject.formatter(details);
      assert.deepEqual(formatted, tableObjectWithToDate);
    });
  });
});
