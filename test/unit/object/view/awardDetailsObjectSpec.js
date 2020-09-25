const { assert } = require('chai');

const moment = require('moment');

const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../../config/i18next');

const awardDetailsObject = require('../../../../lib/objects/view/awardDetailsObject');
const claimData = require('../../../lib/claimData');

const detailsSummaryRowsBase = [{
  key: { text: 'From', classes: 'govuk-!-width-two-thirds' },
  value: { text: '6 March 2019' },
}, {
  key: { text: 'Reason', classes: 'govuk-!-width-two-thirds' },
  value: { text: 'First award' },
}];
const detailsSummaryRowsAnnualUprating = JSON.parse(JSON.stringify(detailsSummaryRowsBase));
detailsSummaryRowsAnnualUprating[1].value.text = 'Annual uprating';

const detailsSummaryRowsInherited = JSON.parse(JSON.stringify(detailsSummaryRowsBase));
detailsSummaryRowsInherited[1].value.text = 'Inherited from late spouse';

const detailsSummaryRowsAnnualUpratingWith4Weekly = [{
  key: { text: 'From', classes: 'govuk-!-width-two-thirds' },
  value: { text: '6 March 2019' },
}, {
  key: { text: '4 weekly amount', classes: 'govuk-!-width-two-thirds' },
  value: { text: '£640.00' },
}, {
  key: { text: 'Reason', classes: 'govuk-!-width-two-thirds' },
  value: { text: 'Annual uprating' },
}];

const amountSummaryRows = [{
  key: { text: 'Total', classes: 'govuk-!-width-two-thirds govuk-!-font-weight-bold' },
  value: { text: '£110.00 a week', classes: 'govuk-!-font-weight-bold' },
}, {
  key: { text: 'New State Pension', classes: 'govuk-!-width-two-thirds govuk-!-font-weight-regular' },
  value: { text: '£100.00' },
}, {
  key: { text: 'Protected payment', classes: 'govuk-!-width-two-thirds govuk-!-font-weight-regular' },
  value: { text: '£10.00' },
}, {
  key: { text: 'Extra State Pension', classes: 'govuk-!-width-two-thirds govuk-!-font-weight-regular' },
  value: { text: '£0.00' },
}, {
  key: { text: 'Inherited extra State Pension', classes: 'govuk-!-width-two-thirds govuk-!-font-weight-regular' },
  value: { text: '£0.00' },
}];

describe('awardDetailsObject ', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

  describe('formatter', () => {
    it('should return formatted object with arrays', () => {
      const formatted = awardDetailsObject.formatter(claimData.validAwardAmountDetails(), 0);
      assert.isArray(formatted.detailsSummaryRows);
      assert.isArray(formatted.amountSummaryRows);
    });

    it('should return formatted object with current first award', () => {
      const formatted = awardDetailsObject.formatter(claimData.validAwardAmountDetails(), 0);
      assert.deepEqual(formatted.detailsSummaryRows, detailsSummaryRowsBase);
      assert.deepEqual(formatted.header, 'Current State Pension award');
    });

    it('should return formatted object with annual uprating', () => {
      const details = claimData.validAwardAmountDetails();
      details.awardAmounts[0].reasonCode = 'ANNUALUPRATING';
      details.paymentFrequency = '1W';
      const formatted = awardDetailsObject.formatter(details, '0');
      assert.deepEqual(formatted.detailsSummaryRows, detailsSummaryRowsAnnualUprating);
    });

    it('should return formatted object with annual inherited', () => {
      const details = claimData.validAwardAmountDetails();
      details.awardAmounts[0].reasonCode = 'INHERITED';
      details.paymentFrequency = '1W';
      const formatted = awardDetailsObject.formatter(details, '0');
      assert.deepEqual(formatted.detailsSummaryRows, detailsSummaryRowsInherited);
    });

    it('should return formatted object with correct amountSummaryRows', () => {
      const formatted = awardDetailsObject.formatter(claimData.validAwardAmountDetails(), 0);
      assert.deepEqual(formatted.amountSummaryRows, amountSummaryRows);
    });

    it('should return formatted object with new uprating award and new award flag set to true', () => {
      const details = claimData.validAwardAmountDetailsFutureUprating();
      details.paymentFrequency = '1W';
      const formatted = awardDetailsObject.formatter(details, '0');
      assert.isTrue(formatted.isNewAward);
      assert.deepEqual(formatted.header, 'New State Pension award');
    });

    it('should return formatted object with extra frequency row when future uprating and not weekly', () => {
      const details = claimData.validAwardAmountDetailsFutureUprating();
      details.paymentFrequency = '4W';
      const formatted = awardDetailsObject.formatter(details, '0');
      assert.isTrue(formatted.isNewAward);
      assert.deepEqual(formatted.detailsSummaryRows, detailsSummaryRowsAnnualUpratingWith4Weekly);
    });

    it('should return formatted object with previous award', () => {
      const details = claimData.validAwardAmountDetails();
      details.awardAmounts[0].inPayment = false;
      details.awardAmounts[0].toDate = 1574812800000;
      const formatted = awardDetailsObject.formatter(details, 0);
      assert.deepEqual(formatted.detailsSummaryRows, detailsSummaryRowsBase);
      assert.deepEqual(formatted.header, 'Previous State Pension award');
    });

    it('should return current award header when first award is future', () => {
      const details = claimData.validAwardAmountDetails();
      details.awardAmounts[0].inPayment = false;
      details.awardAmounts[0].fromDate = moment().add(5, 'd').toDate().getTime();
      const formatted = awardDetailsObject.formatter(details, 0);
      assert.deepEqual(formatted.header, 'Current State Pension award');
    });

    it('should return previous award header when srb award and end date is before todays date', () => {
      const details = claimData.validAwardAmountDetails();
      details.awardAmounts[0].inPayment = false;
      details.awardAmounts[0].reasonCode = 'SRB';
      details.awardAmounts[0].fromDate = moment().add(-5, 'd').toDate().getTime();
      details.awardAmounts[0].toDate = moment().add(-2, 'd').toDate().getTime();
      const formatted = awardDetailsObject.formatter(details, 0);
      assert.deepEqual(formatted.header, 'Previous State Pension award');
    });

    it('should return previous award header when srb award and end date is after todays date and before the start date', () => {
      const details = claimData.validAwardAmountDetails();
      details.awardAmounts[0].inPayment = false;
      details.awardAmounts[0].reasonCode = 'SRB';
      details.awardAmounts[0].fromDate = moment().add(6, 'd').toDate().getTime();
      details.awardAmounts[0].toDate = moment().add(5, 'd').toDate().getTime();
      const formatted = awardDetailsObject.formatter(details, 0);
      assert.deepEqual(formatted.header, 'Previous State Pension award');
    });

    it('should return current award header when srb award and end date is after todays date and after the start date', () => {
      const details = claimData.validAwardAmountDetails();
      details.awardAmounts[0].inPayment = false;
      details.awardAmounts[0].reasonCode = 'SRB';
      details.awardAmounts[0].fromDate = moment().add(6, 'd').toDate().getTime();
      details.awardAmounts[0].toDate = moment().add(7, 'd').toDate().getTime();
      const formatted = awardDetailsObject.formatter(details, 0);
      assert.deepEqual(formatted.header, 'Current State Pension award');
    });
  });
});
