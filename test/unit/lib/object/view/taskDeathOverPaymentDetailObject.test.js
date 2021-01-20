const { assert } = require('chai');

const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../../../config/i18next');

const taskDeathOverPaymentDetailObject = require('../../../../../lib/objects/view/taskDeathOverPaymentDetailObject');

const claimData = require('../../../../lib/claimData');

const workItemReason = 'DEATHOVERPAYMENT';

describe('taskDeathOverPaymentDetailObject', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

  describe('formatter', () => {
    it('should be defined when calling function', () => {
      assert.isDefined(taskDeathOverPaymentDetailObject.formatter);
      assert.isFunction(taskDeathOverPaymentDetailObject.formatter);
    });

    it('should return default elements', () => {
      const formatted = taskDeathOverPaymentDetailObject.formatter(claimData.validClaimWithDeathOverPaymentDue(-25.01), workItemReason);
      assert.equal(formatted.backHref, '/task');
      assert.equal(formatted.header, 'Overpayment referral details');
      assert.equal(formatted.hint, 'Use these details to refer the overpayment to the debt management service through the e-referral tool.');
      assert.equal(formatted.buttonHref, '/tasks/task/complete');
    });

    context('without award periods', () => {
      it('should return have 5 summary lists when amount overpaid is greater than £25', () => {
        const formatted = taskDeathOverPaymentDetailObject.formatter(claimData.validClaimWithDeathOverPaymentDue(-25.01), workItemReason);
        assert.lengthOf(formatted.summaryList, 5);
      });

      it('should return have 2 summary lists when amount overpaid is £25', () => {
        const formatted = taskDeathOverPaymentDetailObject.formatter(claimData.validClaimWithDeathOverPaymentDue(-25), workItemReason);
        assert.lengthOf(formatted.summaryList, 2);
      });

      it('should return have 2 summary lists when amount overpaid less than £25', () => {
        const formatted = taskDeathOverPaymentDetailObject.formatter(claimData.validClaimWithDeathOverPaymentDue(-24.99), workItemReason);
        assert.lengthOf(formatted.summaryList, 2);
      });
    });

    context('with award periods', () => {
      it('should return have 6 summary lists when amount overpaid is greater than £25 and has award periods', () => {
        const formatted = taskDeathOverPaymentDetailObject.formatter(claimData.validClaimWithDeathOverPaymentDuePeriods(-25.01), workItemReason);
        assert.lengthOf(formatted.summaryList, 6);
      });

      it('should return have 3 summary lists when amount overpaid is £25', () => {
        const formatted = taskDeathOverPaymentDetailObject.formatter(claimData.validClaimWithDeathOverPaymentDuePeriods(-25), workItemReason);
        assert.lengthOf(formatted.summaryList, 3);
      });

      it('should return have 3 summary lists when amount overpaid less than £25', () => {
        const formatted = taskDeathOverPaymentDetailObject.formatter(claimData.validClaimWithDeathOverPaymentDuePeriods(-24.99), workItemReason);
        assert.lengthOf(formatted.summaryList, 3);
      });
    });
  });
});
