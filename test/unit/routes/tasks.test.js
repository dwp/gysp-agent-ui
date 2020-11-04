const { assert } = require('chai');
const nock = require('nock');
const httpStatus = require('http-status-codes');

const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../config/i18next');

const claimData = require('../../lib/claimData');

nock.disableNetConnect();

const controller = require('../../../app/routes/tasks/functions');

const responseHelper = require('../../lib/responseHelper');
const errorHelper = require('../../lib/errorHelper');

let genericResponse;

const workItemUri = '/api/workitem/next-workitem';
const putWorkItemUpdateStatusReturnedUri = '/api/workitem/update-status-returned';
const putWorkItemUpdateStatusCompleteUri = '/api/workitem/update-status-complete';
const putMaritalDetailsUri = '/api/award/update-marital-details';
const awardByInviteKeyUri = '/api/award/award-by-invite-key';

// API Responses
const marriedWorkItem = { inviteKey: 'BLOG123456', workItemReason: 'MARRIED' };
const civilWorkItem = { inviteKey: 'BLOG123456', workItemReason: 'CIVILPARTNERSHIP' };
const widowWorkItem = { inviteKey: 'BLOG123456', workItemReason: 'WIDOWED' };

// Mocks
const flash = { type: '', message: '' };
const flashMock = (type, message) => {
  flash.type = type;
  flash.message = message;
};

// Request Headers
const user = {
  cis: {
    givenname: 'Test', surname: 'User', SLOC: '123456', dwp_staffid: '12345678',
  },
};

// Requests
const emptyRequest = { session: {}, user: { ...user }, flash: flashMock };
const tasksRequest = { session: { tasks: marriedWorkItem }, flash: flashMock, user: { ...user } };

// Headers
const reqHeaders = { reqheaders: { agentRef: 'Test User', location: '123456', staffId: '12345678' } };

const updatedMaritalDetails = {
  'partner-nino': { partnerNino: 'AA654321C' },
  'date-of-birth': {
    dateYear: '1952', dateMonth: '7', dateDay: '6', verification: 'V',
  },
  'marital-date': {
    dateYear: '2000', dateMonth: '5', dateDay: '19', verification: 'V',
  },
};

let marriedTaskRequest;
let civilTaskRequest;
let widowNoTaskRequest;
let widowYesTaskRequest;
let marriedTaskWithUpdatesRequest;

describe('tasks controller ', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

  beforeEach(() => {
    genericResponse = responseHelper.genericResponse();
    genericResponse.locals = responseHelper.localResponse(genericResponse);

    marriedTaskRequest = { session: { tasks: { 'work-item': marriedWorkItem } }, flash: flashMock };
    civilTaskRequest = { session: { tasks: { 'work-item': civilWorkItem } }, flash: flashMock };
    widowNoTaskRequest = { session: { tasks: { 'work-item': widowWorkItem }, marital: { 'entitled-to-inherited-state-pension': { entitledInheritableStatePension: 'no' } } }, flash: flashMock };
    widowYesTaskRequest = { session: { tasks: { 'work-item': widowWorkItem }, marital: { 'entitled-to-inherited-state-pension': { entitledInheritableStatePension: 'yes' } } }, flash: flashMock };
    marriedTaskWithUpdatesRequest = { session: { tasks: { 'work-item': marriedWorkItem }, 'updated-entitlement-details': updatedMaritalDetails }, flash: flashMock };
  });

  describe('getTasks function', () => {
    it('should return tasks view when requested', async () => {
      controller.getTasks(emptyRequest, genericResponse);
      assert.isUndefined(emptyRequest.session.tasks);
      assert.equal(genericResponse.viewName, 'pages/tasks/index');
    });
  });

  describe('postTasks function', () => {
    it('should return tasks view when requested with API response NOT_FOUND', async () => {
      nock('http://test-url/', reqHeaders).get(workItemUri).reply(httpStatus.NOT_FOUND, {});
      await controller.postTasks(emptyRequest, genericResponse);
      assert.isUndefined(emptyRequest.session.tasks);
      assert.equal(genericResponse.viewName, 'pages/tasks/index');
      assert.isFalse(genericResponse.data.tasks);
      assert.equal(genericResponse.locals.logMessage, '');
    });

    it('should return redirect with flash error when requested with API response INTERNAL_SERVER_ERROR', async () => {
      nock('http://test-url/', reqHeaders).get(workItemUri).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
      await controller.postTasks(tasksRequest, genericResponse);
      assert(genericResponse.address, '/tasks/task');
      assert.equal(flash.type, 'error');
      assert.equal(flash.message, errorHelper.errorMessage(httpStatus.INTERNAL_SERVER_ERROR));
      assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on /api/workitem/next-workitem');
    });

    it('should return redirect when requested with API response OK', async () => {
      nock('http://test-url/', reqHeaders).get(workItemUri).reply(httpStatus.OK, marriedWorkItem);
      await controller.postTasks(emptyRequest, genericResponse);
      assert(genericResponse.address, '/tasks/task');
    });
  });

  describe('getTask function', () => {
    it('should return spouse task view when requested', () => {
      controller.getTask(marriedTaskRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/tasks/task');
      assert.equal(genericResponse.data.details.reason, 'married');
    });

    it('should return civil partner task view when requested', () => {
      controller.getTask(civilTaskRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/tasks/task');
      assert.equal(genericResponse.data.details.reason, 'civilpartnership');
    });

    it('should return widowed task view when requested', () => {
      controller.getTask(widowNoTaskRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/tasks/task');
      assert.equal(genericResponse.data.details.reason, 'widowed');
    });
  });

  describe('getReturnTaskToQueue function', () => {
    it('should be defined when calling function', () => {
      assert.isDefined(controller.getReturnTaskToQueue);
      assert.isFunction(controller.getReturnTaskToQueue);
    });

    it('should be return a redirect with INTERNAL_SERVER_ERROR message', async () => {
      nock('http://test-url/').put(putWorkItemUpdateStatusReturnedUri).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
      await controller.getReturnTaskToQueue(marriedTaskRequest, genericResponse);
      assert.equal(genericResponse.address, '/tasks/task');
      assert.equal(flash.type, 'error');
      assert.equal(flash.message, errorHelper.errorMessage(httpStatus.INTERNAL_SERVER_ERROR));
      assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on /api/workitem/update-status-returned');
    });

    it('should be return a redirect with BAD_REQUEST message', async () => {
      nock('http://test-url/').put(putWorkItemUpdateStatusReturnedUri).reply(httpStatus.BAD_REQUEST, {});
      await controller.getReturnTaskToQueue(marriedTaskRequest, genericResponse);
      assert.equal(genericResponse.address, '/tasks/task');
      assert.equal(flash.type, 'error');
      assert.equal(flash.message, errorHelper.errorMessage(httpStatus.BAD_REQUEST));
      assert.equal(genericResponse.locals.logMessage, '400 - 400 - {} - Requested on /api/workitem/update-status-returned');
    });

    it('should be return a redirect with NOT_FOUND message', async () => {
      nock('http://test-url/').put(putWorkItemUpdateStatusReturnedUri).reply(httpStatus.NOT_FOUND, {});
      await controller.getReturnTaskToQueue(marriedTaskRequest, genericResponse);
      assert.equal(genericResponse.address, '/tasks/task');
      assert.equal(flash.type, 'error');
      assert.equal(flash.message, i18next.t(errorHelper.errorMessage(httpStatus.NOT_FOUND), { SERVICE: 'work items' }));
      assert.equal(genericResponse.locals.logMessage, '404 - 404 - {} - Requested on /api/workitem/update-status-returned');
    });

    it('should be return a redirect with OK message', async () => {
      nock('http://test-url/').put(putWorkItemUpdateStatusReturnedUri).reply(httpStatus.OK, {});
      await controller.getReturnTaskToQueue(marriedTaskRequest, genericResponse);
      assert.equal(genericResponse.address, '/tasks');
      assert.isUndefined(marriedTaskRequest.session.tasks);
    });
  });

  describe('getTaskDetail function', () => {
    it('should be defined when calling', () => {
      assert.isDefined(controller.getTaskDetail);
      assert.isFunction(controller.getTaskDetail);
    });

    it('should return task view when requested with API response NOT_FOUND', async () => {
      nock('http://test-url/').get(`${awardByInviteKeyUri}/${marriedWorkItem.inviteKey}`).reply(httpStatus.NOT_FOUND, {});
      await controller.getTaskDetail(marriedTaskRequest, genericResponse);
      assert.equal(genericResponse.address, '/tasks/task');
      assert.equal(flash.type, 'error');
      assert.equal(flash.message, i18next.t(errorHelper.errorMessage(httpStatus.NOT_FOUND), { SERVICE: 'award' }));
      assert.equal(genericResponse.locals.logMessage, `404 - 404 - {} - Requested on /api/award/award-by-invite-key/${marriedWorkItem.inviteKey}`);
    });

    it('should return task view when requested with API response INTERNAL_SERVER_ERROR', async () => {
      nock('http://test-url/').get(`${awardByInviteKeyUri}/${marriedWorkItem.inviteKey}`).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
      await controller.getTaskDetail(marriedTaskRequest, genericResponse);
      assert.equal(genericResponse.address, '/tasks/task');
      assert.equal(flash.type, 'error');
      assert.equal(flash.message, errorHelper.errorMessage(httpStatus.INTERNAL_SERVER_ERROR));
      assert.equal(genericResponse.locals.logMessage, `500 - 500 - {} - Requested on /api/award/award-by-invite-key/${marriedWorkItem.inviteKey}`);
    });

    it('should return task view when requested with API response OK - Married', async () => {
      nock('http://test-url/').get(`${awardByInviteKeyUri}/${marriedWorkItem.inviteKey}`).reply(httpStatus.OK, claimData.validClaimMarried());
      await controller.getTaskDetail(marriedTaskRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/tasks/entitlement/detail');
      assert.isObject(genericResponse.data.details);
      assert.equal(genericResponse.data.details.partnerSummary.header, "Spouse's details");
      assert.lengthOf(genericResponse.data.details.partnerSummary.rows, '6');
    });

    it('should return task view when requested with API response OK - Civil Partnership', async () => {
      nock('http://test-url/').get(`${awardByInviteKeyUri}/${civilWorkItem.inviteKey}`).reply(httpStatus.OK, claimData.validClaimCivilPartner());
      await controller.getTaskDetail(civilTaskRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/tasks/entitlement/detail');
      assert.isObject(genericResponse.data.details);
      assert.equal(genericResponse.data.details.partnerSummary.header, "Civil partner's details");
      assert.lengthOf(genericResponse.data.details.partnerSummary.rows, '6');
    });

    it('should return task view when requested with API response OK - Widowed', async () => {
      nock('http://test-url/').get(`${awardByInviteKeyUri}/${civilWorkItem.inviteKey}`).reply(httpStatus.OK, claimData.validClaimWidowed());
      await controller.getTaskDetail(widowNoTaskRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/tasks/entitlement/detail');
      assert.isObject(genericResponse.data.details);
      assert.equal(genericResponse.data.details.partnerSummary.header, "Late spouse or partner's details");
      assert.lengthOf(genericResponse.data.details.partnerSummary.rows, '4');
    });
  });

  describe('getTaskComplete function', () => {
    it('should return spouse task view when requested', async () => {
      controller.getTaskComplete(marriedTaskRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/tasks/complete');
      assert.equal(genericResponse.data.details.reason, 'married');
    });

    it('should return civil partner task view when requested', async () => {
      controller.getTaskComplete(civilTaskRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/tasks/complete');
      assert.equal(genericResponse.data.details.reason, 'civilpartnership');
    });

    it('should return widow task view when requested with entitlement no', async () => {
      controller.getTaskComplete(widowNoTaskRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/tasks/complete');
      assert.equal(genericResponse.data.details.reason, 'widowed-no');
    });

    it('should return widow task view when requested with entitlement yes', async () => {
      controller.getTaskComplete(widowYesTaskRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/tasks/complete');
      assert.equal(genericResponse.data.details.reason, 'widowed-yes');
    });
  });

  describe('getEndTask function', () => {
    it('should be defined when calling function', () => {
      assert.isDefined(controller.getEndTask);
      assert.isFunction(controller.getEndTask);
    });

    describe('no award to update', () => {
      it('should be return a redirect with INTERNAL_SERVER_ERROR message', async () => {
        nock('http://test-url/').put(putWorkItemUpdateStatusCompleteUri).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
        await controller.getEndTask(marriedTaskRequest, genericResponse);
        assert.equal(genericResponse.address, '/tasks/task/complete');
        assert.equal(flash.type, 'error');
        assert.equal(flash.message, errorHelper.errorMessage(httpStatus.INTERNAL_SERVER_ERROR));
        assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on /api/workitem/update-status-complete');
      });

      it('should be return a redirect with BAD_REQUEST message', async () => {
        nock('http://test-url/').put(putWorkItemUpdateStatusCompleteUri).reply(httpStatus.BAD_REQUEST, {});
        await controller.getEndTask(marriedTaskRequest, genericResponse);
        assert.equal(genericResponse.address, '/tasks/task/complete');
        assert.equal(flash.type, 'error');
        assert.equal(flash.message, errorHelper.errorMessage(httpStatus.BAD_REQUEST));
        assert.equal(genericResponse.locals.logMessage, '400 - 400 - {} - Requested on /api/workitem/update-status-complete');
      });

      it('should be return a redirect with NOT_FOUND message', async () => {
        nock('http://test-url/').put(putWorkItemUpdateStatusCompleteUri).reply(httpStatus.NOT_FOUND, {});
        await controller.getEndTask(marriedTaskRequest, genericResponse);
        assert.equal(genericResponse.address, '/tasks/task/complete');
        assert.equal(flash.type, 'error');
        assert.equal(flash.message, i18next.t(errorHelper.errorMessage(httpStatus.NOT_FOUND), { SERVICE: 'work items' }));
        assert.equal(genericResponse.locals.logMessage, '404 - 404 - {} - Requested on /api/workitem/update-status-complete');
      });

      it('should be return a redirect with OK message', async () => {
        nock('http://test-url/').put(putWorkItemUpdateStatusCompleteUri).reply(httpStatus.OK, {});
        await controller.getEndTask(marriedTaskRequest, genericResponse);
        assert.equal(genericResponse.address, '/tasks');
        assert.isUndefined(marriedTaskRequest.session.tasks);
      });
    });

    describe('award and task status update', () => {
      it('should be return a redirect with INTERNAL_SERVER_ERROR message', async () => {
        nock('http://test-url/').get(`${awardByInviteKeyUri}/${marriedWorkItem.inviteKey}`).reply(httpStatus.OK, claimData.validClaimMarried());
        nock('http://test-url/').put(putMaritalDetailsUri).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
        await controller.getEndTask(marriedTaskWithUpdatesRequest, genericResponse);
        assert.equal(genericResponse.address, '/tasks/task/complete');
        assert.equal(flash.type, 'error');
        assert.equal(flash.message, errorHelper.errorMessage(httpStatus.INTERNAL_SERVER_ERROR));
        assert.equal(genericResponse.locals.logMessage, `500 - 500 - {} - Requested on ${putMaritalDetailsUri}`);
      });

      it('should be return a redirect with BAD_REQUEST message', async () => {
        nock('http://test-url/').get(`${awardByInviteKeyUri}/${marriedWorkItem.inviteKey}`).reply(httpStatus.OK, claimData.validClaimMarried());
        nock('http://test-url/').put(putMaritalDetailsUri).reply(httpStatus.BAD_REQUEST, {});
        await controller.getEndTask(marriedTaskWithUpdatesRequest, genericResponse);
        assert.equal(genericResponse.address, '/tasks/task/complete');
        assert.equal(flash.type, 'error');
        assert.equal(flash.message, errorHelper.errorMessage(httpStatus.BAD_REQUEST));
        assert.equal(genericResponse.locals.logMessage, `400 - 400 - {} - Requested on ${putMaritalDetailsUri}`);
      });

      it('should be return a redirect with NOT_FOUND message', async () => {
        nock('http://test-url/').get(`${awardByInviteKeyUri}/${marriedWorkItem.inviteKey}`).reply(httpStatus.OK, claimData.validClaimMarried());
        nock('http://test-url/').put(putMaritalDetailsUri).reply(httpStatus.NOT_FOUND, {});
        await controller.getEndTask(marriedTaskWithUpdatesRequest, genericResponse);
        assert.equal(genericResponse.address, '/tasks/task/complete');
        assert.equal(flash.type, 'error');
        assert.equal(flash.message, i18next.t(errorHelper.errorMessage(httpStatus.NOT_FOUND), { SERVICE: 'work items' }));
        assert.equal(genericResponse.locals.logMessage, `404 - 404 - {} - Requested on ${putMaritalDetailsUri}`);
      });

      it('should be return a redirect with OK message', async () => {
        nock('http://test-url/').get(`${awardByInviteKeyUri}/${marriedWorkItem.inviteKey}`).reply(httpStatus.OK, claimData.validClaimMarried());
        nock('http://test-url/').put(putMaritalDetailsUri).reply(httpStatus.OK, {});
        nock('http://test-url/').put(putWorkItemUpdateStatusCompleteUri).reply(httpStatus.OK, {});
        await controller.getEndTask(marriedTaskWithUpdatesRequest, genericResponse);
        assert.equal(genericResponse.address, '/tasks');
        assert.isUndefined(marriedTaskWithUpdatesRequest.session.tasks);
        assert.isUndefined(marriedTaskWithUpdatesRequest.session['updated-entitlement-details']);
      });
    });
  });
});
