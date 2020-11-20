const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const nock = require('nock');
const httpStatus = require('http-status-codes');

const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const { assert } = chai;
chai.use(chaiAsPromised);

const i18nextConfig = require('../../../../config/i18next');

const helper = require('../../../../lib/helpers/taskHelper');
const responseHelper = require('../../../lib/responseHelper');

const claimData = require('../../../lib/claimData');

let genericResponse = {};

const taskWorkReasons = ['MARRIED', 'CIVILPARTNERSHIP'];

const getAwardByInviteKeyUri = '/api/award/award-by-invite-key';
const putWorkItemUpdateStatusCompleteUri = '/api/workitem/update-status-complete';
const putMaritalDetailsUri = '/api/award/update-marital-details';
const putWidowDetailsUri = '/api/award/update-widow-details';

// Requests
const session = (object) => ({ session: object });
const blankSession = session({});
const taskRequest = (reason, extraSession) => session({ tasks: { 'work-item': { inviteKey: 'BLOG123456', workItemReason: reason } }, ...extraSession });

const updatedMaritalDetails = {
  'partner-nino': { partnerNino: 'AA654321C' },
  'date-of-birth': {
    dateYear: '1952', dateMonth: '7', dateDay: '6', verification: 'V',
  },
  'marital-date': {
    dateYear: '2000', dateMonth: '5', dateDay: '19', verification: 'V',
  },
};

const widowUpdateDetails = {
  marital: {
    date: { dateYear: '2000', dateMonth: '5', dateDay: '19' },
    'entitled-to-inherited-state-pension': { entitledInheritableStatePension: 'yes' },
  },
};

describe('task helper', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

  beforeEach(() => {
    genericResponse = responseHelper.genericResponse();
    genericResponse.locals = responseHelper.localResponse(genericResponse);
  });

  describe('taskDetail', () => {
    it('should throw error when work reason is not valid', () => {
      assert.throw(() => {
        helper.taskDetail(blankSession, 'INVALID', { foo: 'bar' });
      }, Error, 'Invalid workItemReason, got INVALID');
    });

    taskWorkReasons.forEach((reason) => {
      it(`should return a ${reason} entitlement detail page`, () => {
        const task = helper.taskDetail(blankSession, reason, claimData.validClaimMarried());
        assert.equal(task.view, 'detail');
        assert.isObject(task.data);
      });
    });

    it('should return a WIDOWED entitlement detail page', () => {
      const task = helper.taskDetail(blankSession, 'WIDOWED', claimData.validClaimWidowed());
      assert.equal(task.view, 'detail');
      assert.isObject(blankSession.session.marital.date);
      assert.isObject(task.data);
    });

    it('should return a DEATHARREARS entitlement detail page', () => {
      const task = helper.taskDetail(blankSession, 'DEATHARREARS', claimData.validClaimWithDeathArrearsDue());
      assert.equal(task.view, 'detail');
      assert.isObject(task.data);
    });

    it('should return a DEATHOVERPAYMENT entitlement detail under no reclaim amount - 25.00', () => {
      const task = helper.taskDetail(blankSession, 'DEATHOVERPAYMENT', claimData.validClaimWithDeathOverPaymentDue(25));
      assert.equal(task.view, 'detail');
      assert.isObject(task.data);
      assert.lengthOf(task.data.summaryList, 2);
    });

    it('should return a DEATHOVERPAYMENT entitlement detail page over no reclaim amount - 25.01', () => {
      const task = helper.taskDetail(blankSession, 'DEATHOVERPAYMENT', claimData.validClaimWithDeathOverPaymentDue(25.01));
      assert.equal(task.view, 'detail');
      assert.isObject(task.data);
      assert.lengthOf(task.data.summaryList, 5);
    });
  });

  describe('taskComplete', () => {
    it('should return a MARRIED entitlement complete page', () => {
      const task = helper.taskComplete({ ...taskRequest('MARRIED') });
      assert.equal(task.backHref, '/task/detail');
      assert.isObject(task.details);
    });

    it('should return a CIVILPARTNERSHIP entitlement complete page', () => {
      const task = helper.taskComplete({ ...taskRequest('CIVILPARTNERSHIP') });
      assert.equal(task.backHref, '/task/detail');
      assert.isObject(task.details);
    });

    it('should return a WIDOWED entitlement complete page - entitled yes', () => {
      const yes = { marital: { 'entitled-to-inherited-state-pension': { entitledInheritableStatePension: 'yes' } } };
      const task = helper.taskComplete({ ...taskRequest('WIDOWED', yes) });
      assert.equal(task.backHref, '/task/consider-entitlement/update-state-pension-award');
      assert.isObject(task.details);
    });

    it('should return a WIDOWED entitlement complete page - entitled no', () => {
      const no = { marital: { 'entitled-to-inherited-state-pension': { entitledInheritableStatePension: 'no' } } };
      const task = helper.taskComplete({ ...taskRequest('WIDOWED', no) });
      assert.equal(task.backHref, '/task/consider-entitlement/entitled-to-any-inherited-state-pension');
      assert.isObject(task.details);
    });

    it('should return a DEATHARREARS entitlement complete page - entitled no', () => {
      const task = helper.taskComplete({ ...taskRequest('DEATHARREARS') });
      assert.equal(task.backHref, '/task/detail');
      assert.isObject(task.details);
    });
  });
  describe('taskEnd', () => {
    it('should throw error when work reason is not valid', async () => {
      await assert.isRejected(helper.taskEnd(blankSession, genericResponse, 'INVALID'), Error, 'Invalid workItemReason, got INVALID');
    });

    describe('MARRIED or CIVILPARTNERSHIP', () => {
      it('should be return a array when successfully call API without updated entitlement details - MARRIED', async () => {
        nock('http://test-url/').put(putWorkItemUpdateStatusCompleteUri).reply(httpStatus.OK, {});
        const taskEnd = await helper.taskEnd(taskRequest('MARRIED'), genericResponse, 'MARRIED');
        assert.deepEqual(taskEnd, ['tasks', 'updated-entitlement-details', 'awardDetails']);
      });

      it('should be return a array when successfully call API without updated entitlement details - CIVILPARTNERSHIP', async () => {
        nock('http://test-url/').put(putWorkItemUpdateStatusCompleteUri).reply(httpStatus.OK, {});
        const taskEnd = await helper.taskEnd(taskRequest('CIVILPARTNERSHIP'), genericResponse, 'CIVILPARTNERSHIP');
        assert.deepEqual(taskEnd, ['tasks', 'updated-entitlement-details', 'awardDetails']);
      });

      it('should be return a array when successfully call API with updated entitlement details - MARRIED', async () => {
        const request = taskRequest('MARRIED', { 'updated-entitlement-details': updatedMaritalDetails });
        nock('http://test-url/').get(`${getAwardByInviteKeyUri}/${request.session.tasks['work-item'].inviteKey}`).reply(httpStatus.OK, claimData.validClaimMarried());
        nock('http://test-url/').put(putMaritalDetailsUri).reply(httpStatus.OK, {});
        nock('http://test-url/').put(putWorkItemUpdateStatusCompleteUri).reply(httpStatus.OK, {});
        const taskEnd = await helper.taskEnd(request, genericResponse, 'MARRIED');
        assert.deepEqual(taskEnd, ['tasks', 'updated-entitlement-details', 'awardDetails']);
      });

      it('should be return array when successfully call API with updated entitlement details - CIVILPARTNERSHIP', async () => {
        const request = taskRequest('CIVILPARTNERSHIP', { 'updated-entitlement-details': updatedMaritalDetails });
        nock('http://test-url/').get(`${getAwardByInviteKeyUri}/${request.session.tasks['work-item'].inviteKey}`).reply(httpStatus.OK, claimData.validClaimCivilPartner());
        nock('http://test-url/').put(putMaritalDetailsUri).reply(httpStatus.OK, {});
        nock('http://test-url/').put(putWorkItemUpdateStatusCompleteUri).reply(httpStatus.OK, {});
        const taskEnd = await helper.taskEnd(request, genericResponse, 'CIVILPARTNERSHIP');
        assert.deepEqual(taskEnd, ['tasks', 'updated-entitlement-details', 'awardDetails']);
      });
    });

    describe('WIDOWED', () => {
      it('should be return array when successfully call API with updated entitlement details - WIDOWED', async () => {
        const extra = { ...widowUpdateDetails, awardDetails: claimData.validClaimWidowed() };
        const request = taskRequest('WIDOWED', extra);
        nock('http://test-url/').get(`${getAwardByInviteKeyUri}/${request.session.tasks['work-item'].inviteKey}`).reply(httpStatus.OK, claimData.validClaimWidowed());
        nock('http://test-url/').put(putWorkItemUpdateStatusCompleteUri).reply(httpStatus.OK, {});
        nock('http://test-url/').put(putWidowDetailsUri).reply(httpStatus.OK, {});
        const taskEnd = await helper.taskEnd(request, genericResponse, 'WIDOWED');
        assert.deepEqual(taskEnd, ['tasks', 'updated-entitlement-details', 'marital', 'awardDetails']);
      });
    });

    describe('DEATHARREARS', () => {
      it('should be return a array when successfully call API - DEATHARREARS', async () => {
        nock('http://test-url/').put(putWorkItemUpdateStatusCompleteUri).reply(httpStatus.OK, {});
        const taskEnd = await helper.taskEnd(taskRequest('DEATHARREARS'), genericResponse, 'DEATHARREARS');
        assert.deepEqual(taskEnd, ['tasks', 'awardDetails']);
      });
    });

    describe('DEATHOVERPAYMENT', () => {
      it('should be return a array when successfully call API - DEATHARREARS', async () => {
        nock('http://test-url/').put(putWorkItemUpdateStatusCompleteUri).reply(httpStatus.OK, {});
        const taskEnd = await helper.taskEnd(taskRequest('DEATHOVERPAYMENT'), genericResponse, 'DEATHOVERPAYMENT');
        assert.deepEqual(taskEnd, ['tasks', 'awardDetails']);
      });
    });
  });
});
