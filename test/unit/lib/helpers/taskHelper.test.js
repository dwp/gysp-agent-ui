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
        assert.equal(task.view, 'entitlement/detail');
        assert.isObject(task.data);
      });
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
        assert.deepEqual(taskEnd, ['tasks', 'updated-entitlement-details']);
      });

      it('should be return a array when successfully call API without updated entitlement details - CIVILPARTNERSHIP', async () => {
        nock('http://test-url/').put(putWorkItemUpdateStatusCompleteUri).reply(httpStatus.OK, {});
        const taskEnd = await helper.taskEnd(taskRequest('CIVILPARTNERSHIP'), genericResponse, 'CIVILPARTNERSHIP');
        assert.deepEqual(taskEnd, ['tasks', 'updated-entitlement-details']);
      });

      it('should be return a array when successfully call API with updated entitlement details - MARRIED', async () => {
        const request = taskRequest('MARRIED', { 'updated-entitlement-details': updatedMaritalDetails });
        nock('http://test-url/').get(`${getAwardByInviteKeyUri}/${request.session.tasks['work-item'].inviteKey}`).reply(httpStatus.OK, claimData.validClaimMarried());
        nock('http://test-url/').put(putMaritalDetailsUri).reply(httpStatus.OK, {});
        nock('http://test-url/').put(putWorkItemUpdateStatusCompleteUri).reply(httpStatus.OK, {});
        const taskEnd = await helper.taskEnd(request, genericResponse, 'MARRIED');
        assert.deepEqual(taskEnd, ['tasks', 'updated-entitlement-details']);
      });

      it('should be return array when successfully call API with updated entitlement details - CIVILPARTNERSHIP', async () => {
        const request = taskRequest('CIVILPARTNERSHIP', { 'updated-entitlement-details': updatedMaritalDetails });
        nock('http://test-url/').get(`${getAwardByInviteKeyUri}/${request.session.tasks['work-item'].inviteKey}`).reply(httpStatus.OK, claimData.validClaimCivilPartner());
        nock('http://test-url/').put(putMaritalDetailsUri).reply(httpStatus.OK, {});
        nock('http://test-url/').put(putWorkItemUpdateStatusCompleteUri).reply(httpStatus.OK, {});
        const taskEnd = await helper.taskEnd(request, genericResponse, 'CIVILPARTNERSHIP');
        assert.deepEqual(taskEnd, ['tasks', 'updated-entitlement-details']);
      });
    });
  });
});
