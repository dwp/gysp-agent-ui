const { assert } = require('chai');

const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../../../config/i18next');

const taskDeathOverPaymentEmailDetailObject = require('../../../../../lib/objects/view/taskDeathOverPaymentEmailDetailObject');

const claimData = require('../../../../lib/claimData');

const workItemReason = 'DEATHOVERPAYMENTEMAIL';

describe('taskDeathOverPaymentEmailDetailObject', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

  describe('formatter', () => {
    it('should be defined when calling function', () => {
      assert.isDefined(taskDeathOverPaymentEmailDetailObject.formatter);
      assert.isFunction(taskDeathOverPaymentEmailDetailObject.formatter);
    });

    it('should return all elements with 2 summary lists', () => {
      const formatted = taskDeathOverPaymentEmailDetailObject.formatter(claimData.validClaimWithDeathOverpayment(), workItemReason);
      assert.equal(formatted.backHref, '/task');
      assert.equal(formatted.header, 'Details to send to the debt management service');
      assert.equal(formatted.hint, 'Email the following details to the debt management service so that they can be added to a previously completed overpayment referral.');
      assert.equal(formatted.buttonHref, '/tasks/task/complete');
    });
  });
});
