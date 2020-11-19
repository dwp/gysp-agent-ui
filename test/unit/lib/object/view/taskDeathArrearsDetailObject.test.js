const { assert } = require('chai');

const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../../../config/i18next');

const taskDeathArrearsDetailObject = require('../../../../../lib/objects/view/taskDeathArrearsDetailObject');

const claimData = require('../../../../lib/claimData');

const deathArrearsStatus = 'DEATHARREARS';

const summaryWidthClass = { classes: 'govuk-!-width-one-half' };
const dapSummaryRows = [{
  key: { text: 'Full name', ...summaryWidthClass },
  value: { text: 'Adam Dennis', ...summaryWidthClass },
}, {
  key: { text: 'Address', ...summaryWidthClass },
  value: { html: '2 TEST WAY<br />LONDON<br />LO1 1TY', ...summaryWidthClass },
}];

const claimantSummaryRows = [{
  key: { text: 'National Insurance number', ...summaryWidthClass },
  value: { text: 'AA 37 07 73 A', ...summaryWidthClass },
}, {
  key: { text: 'Full name', ...summaryWidthClass },
  value: { text: 'Joe Bloggs', ...summaryWidthClass },
}];

describe('taskDeathArrearsDetailObject', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

  describe('formatter', () => {
    it('should be defined when calling function', () => {
      assert.isDefined(taskDeathArrearsDetailObject.formatter);
      assert.isFunction(taskDeathArrearsDetailObject.formatter);
    });

    it('should return default elements', () => {
      const formatted = taskDeathArrearsDetailObject.formatter(claimData.validClaimWithDeathArrearsDue(), deathArrearsStatus);
      assert.equal(formatted.backHref, '/task');
      assert.equal(formatted.header, 'Send BR330 form to the person dealing with the estate');
      assert.equal(formatted.buttonHref, '/tasks/task/complete');
    });

    it('should return have 2 summary lists', () => {
      const formatted = taskDeathArrearsDetailObject.formatter(claimData.validClaimWithDeathArrearsDue(), deathArrearsStatus);
      assert.lengthOf(formatted.summaryList, 2);
    });

    context('dap summary', () => {
      it('should return an object', () => {
        const formatted = taskDeathArrearsDetailObject.formatter(claimData.validClaimWithDeathArrearsDue(), deathArrearsStatus);
        assert.isObject(formatted.summaryList[0]);
      });

      it('should throw error when undefined object is supplied', () => {
        assert.throw(() => {
          taskDeathArrearsDetailObject.formatter(undefined, deathArrearsStatus);
        }, Error, 'dapSummary: details object not in correct format');
      });

      it('should throw error when deathDetail object is supplied with no payeeDetails', () => {
        assert.throw(() => {
          taskDeathArrearsDetailObject.formatter({ deathDetail: { } }, deathArrearsStatus);
        }, Error, 'dapSummary: details object not in correct format');
      });

      it('should throw error when deathDetail object is supplied with payeeDetails with no keys', () => {
        assert.throw(() => {
          taskDeathArrearsDetailObject.formatter({ deathDetail: { payeeDetails: { } } }, deathArrearsStatus);
        }, Error, 'dapSummary: details object not in correct format');
      });

      it('should contain rows object', () => {
        const formatted = taskDeathArrearsDetailObject.formatter(claimData.validClaimWithDeathArrearsDue(), deathArrearsStatus);
        assert.containsAllKeys(formatted.summaryList[0], 'rows');
      });

      it('should have 2 objects within rows', () => {
        const formatted = taskDeathArrearsDetailObject.formatter(claimData.validClaimWithDeathArrearsDue(), deathArrearsStatus);
        assert.lengthOf(formatted.summaryList[0].rows, 2);
      });

      it('should return dap summary object', () => {
        const formatted = taskDeathArrearsDetailObject.formatter(claimData.validClaimWithDeathArrearsDue(), deathArrearsStatus);
        assert.deepEqual(formatted.summaryList[0].rows, dapSummaryRows);
      });
    });

    context('claimant summary', () => {
      it('should return an object', () => {
        const formatted = taskDeathArrearsDetailObject.formatter(claimData.validClaimWithDeathArrearsDue(), deathArrearsStatus);
        assert.isObject(formatted.summaryList[1]);
      });

      it('should contain rows object', () => {
        const formatted = taskDeathArrearsDetailObject.formatter(claimData.validClaimWithDeathArrearsDue(), deathArrearsStatus);
        assert.containsAllKeys(formatted.summaryList[1], 'rows');
      });

      it('should have 2 objects within rows', () => {
        const formatted = taskDeathArrearsDetailObject.formatter(claimData.validClaimWithDeathArrearsDue(), deathArrearsStatus);
        assert.lengthOf(formatted.summaryList[1].rows, 2);
      });

      it('should return dap summary object', () => {
        const formatted = taskDeathArrearsDetailObject.formatter(claimData.validClaimWithDeathArrearsDue(), deathArrearsStatus);
        assert.deepEqual(formatted.summaryList[1].rows, claimantSummaryRows);
      });
    });
  });
});
