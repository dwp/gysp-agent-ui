const { assert } = require('chai');
const awardDetailsObject = require('../../../../lib/objects/view/awardDetailsObject');
const claimData = require('../../../lib/claimData');

const detailsSummaryRowsBase = [{
  key: { text: 'award-detail:summary-keys.from', classes: 'govuk-!-width-two-thirds' },
  value: { text: '6 March 2019' },
}, {
  key: { text: 'award-detail:summary-keys.reason', classes: 'govuk-!-width-two-thirds' },
  value: { text: 'award-detail:summary-values.reason.first-award' },
}];
const detailsSummaryRowsAnnualUprating = JSON.parse(JSON.stringify(detailsSummaryRowsBase));
detailsSummaryRowsAnnualUprating[1].value.text = 'award-detail:summary-values.reason.annual-uprating';

const amountSummaryRows = [{
  key: { text: 'award-detail:summary-keys.total', classes: 'govuk-!-width-two-thirds govuk-!-font-weight-bold' },
  value: { text: '£110.00 a week', classes: 'govuk-!-font-weight-bold' },
}, {
  key: { text: 'award-detail:summary-keys.new-state-pension', classes: 'govuk-!-width-two-thirds govuk-!-font-weight-regular' },
  value: { text: '£100.00' },
}, {
  key: { text: 'award-detail:summary-keys.protected-payment', classes: 'govuk-!-width-two-thirds govuk-!-font-weight-regular' },
  value: { text: '£10.00' },
}, {
  key: { text: 'award-detail:summary-keys.extra-state-pension', classes: 'govuk-!-width-two-thirds govuk-!-font-weight-regular' },
  value: { text: '£0.00' },
}, {
  key: { text: 'award-detail:summary-keys.inherited-extra-state-pension', classes: 'govuk-!-width-two-thirds govuk-!-font-weight-regular' },
  value: { text: '£0.00' },
}];

describe('awardDetailsObject ', () => {
  describe('formatter', () => {
    it('should return formatted object with arrays', () => {
      const formatted = awardDetailsObject.formatter(claimData.validAwardAmountDetails(), 0);
      assert.isArray(formatted.detailsSummaryRows);
      assert.isArray(formatted.amountSummaryRows);
    });

    it('should return formatted object with first award', () => {
      const formatted = awardDetailsObject.formatter(claimData.validAwardAmountDetails(), 0);
      assert.deepEqual(formatted.detailsSummaryRows, detailsSummaryRowsBase);
    });

    it('should return formatted object with annual uprating', () => {
      const details = claimData.validAwardAmountDetails();
      details.awardAmounts[0].reasonCode = 'ANNUALUPRATING';
      const formatted = awardDetailsObject.formatter(details, 0);
      assert.deepEqual(formatted.detailsSummaryRows, detailsSummaryRowsAnnualUprating);
    });

    it('should return formatted object with correct amountSummaryRows', () => {
      const formatted = awardDetailsObject.formatter(claimData.validAwardAmountDetails(), 0);
      assert.deepEqual(formatted.amountSummaryRows, amountSummaryRows);
    });
  });
});
