const { assert } = require('chai');

const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../../../config/i18next');

const taskSrbOverPaymentDetailObject = require('../../../../../lib/objects/view/taskSrbOverPaymentDetailObject');

const claimData = require('../../../../lib/claimData');
const reviewData = require('../../../../lib/reviewDataObjects');

const workItemReason = 'SRBOVERPAYMENT';

describe('taskSrbOverPaymentDetailObject', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

  describe('formatter', () => {
    it('should be defined when calling function', () => {
      assert.isDefined(taskSrbOverPaymentDetailObject.formatter);
      assert.isFunction(taskSrbOverPaymentDetailObject.formatter);
    });

    it('should return all elements with 2 summary lists when overpayment does not span uprating', () => {
      const data = { award: claimData.validClaimWidowed(), srbPaymentBreakdown: reviewData.validOverPaymentApiResponse() };
      const formatted = taskSrbOverPaymentDetailObject.formatter(data, workItemReason);
      assert.lengthOf(formatted.summaryList, 2);
      assert.equal(formatted.backHref, '/review-award/schedule');
      assert.equal(formatted.header, 'Refer the overpayment to the debt management service');
      assert.equal(formatted.hint, 'Use these details to refer the overpayment to the debt management service through the e-referral tool.');
      assert.equal(formatted.buttonHref, '/review-award/complete');
    });

    it('should return all elements with 3 summary lists when overpayment spans uprating', () => {
      const data = { award: claimData.validClaimWidowed(), srbPaymentBreakdown: reviewData.validOverPaymentApiResponseSpanUprating() };
      const formatted = taskSrbOverPaymentDetailObject.formatter(data, workItemReason);
      assert.lengthOf(formatted.summaryList, 3);
      assert.equal(formatted.backHref, '/review-award/schedule');
      assert.equal(formatted.header, 'Refer the overpayment to the debt management service');
      assert.equal(formatted.hint, 'Use these details to refer the overpayment to the debt management service through the e-referral tool.');
      assert.equal(formatted.buttonHref, '/review-award/complete');
    });
  });
});
