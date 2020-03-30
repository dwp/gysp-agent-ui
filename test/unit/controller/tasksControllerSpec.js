const { assert } = require('chai');
const nock = require('nock');
const httpStatus = require('http-status-codes');

const claimData = require('../../lib/claimData');

nock.disableNetConnect();

const controller = require('../../../app/routes/tasks/functions');

const responseHelper = require('../../lib/responseHelper');
const errorHelper = require('../../lib/errorHelper');

let genericResponse;

const workItemUri = '/api/workitem/next-workitem';
const putWorkItemUpdateStatusReturnedUri = '/api/workitem/update-status-returned';
const putWorkItemUpdateStatusCompleteUri = '/api/workitem/update-status-complete';
const awardByInviteKeyUri = '/api/award/award-by-invite-key';

// API Responses
const marriedWorkItem = { inviteKey: 'BLOG123456', workItemReason: 'MARRIED' };
const civilWorkItem = { inviteKey: 'BLOG123456', workItemReason: 'CIVILPARTNERSHIP' };

// Mocks
const flash = { type: '', message: '' };
const flashMock = (type, message) => {
  flash.type = type;
  flash.message = message;
};

// Requests
const emptyRequest = { session: {} };
const tasksRequest = { session: { tasks: marriedWorkItem } };

let marriedTaskRequest;
let civilTaskRequest;

describe('tasks controller ', () => {
  beforeEach(() => {
    genericResponse = responseHelper.genericResponse();
    genericResponse.locals = responseHelper.localResponse(genericResponse);

    marriedTaskRequest = { session: { tasks: { 'work-item': marriedWorkItem } }, flash: flashMock };
    civilTaskRequest = { session: { tasks: { 'work-item': civilWorkItem } }, flash: flashMock };
  });

  describe('getTasks function', () => {
    it('should return task view when requested with API response NOT_FOUND', async () => {
      nock('http://test-url/').get(workItemUri).reply(httpStatus.NOT_FOUND, {});
      await controller.getTasks(tasksRequest, genericResponse);
      assert.isUndefined(emptyRequest.session.tasks);
      assert.equal(genericResponse.viewName, 'pages/tasks/index');
      assert.isFalse(genericResponse.data.tasks);
      assert.equal(genericResponse.locals.logMessage, '');
    });

    it('should return task view when requested with API response INTERNAL_SERVER_ERROR', async () => {
      nock('http://test-url/').get(workItemUri).reply(httpStatus.INTERNAL_SERVER_ERROR, {});
      await controller.getTasks(tasksRequest, genericResponse);
      assert.isUndefined(emptyRequest.session.tasks);
      assert.equal(genericResponse.viewName, 'pages/tasks/index');
      assert.isFalse(genericResponse.data.tasks);
      assert.equal(genericResponse.locals.logMessage, '500 - 500 - {} - Requested on api/workitem/next-workitem');
    });

    it('should return task view when requested with API response OK', async () => {
      nock('http://test-url/').get(workItemUri).reply(httpStatus.OK, marriedWorkItem);
      await controller.getTasks(emptyRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/tasks/index');
      assert.isTrue(genericResponse.data.tasks);
      assert.deepEqual(emptyRequest.session.tasks['work-item'], marriedWorkItem);
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
      assert.equal(flash.message, errorHelper.errorMessage(httpStatus.NOT_FOUND));
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
      assert.equal(flash.message, errorHelper.errorMessage(httpStatus.NOT_FOUND));
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
      assert.equal(genericResponse.viewName, 'pages/tasks/detail');
      assert.isObject(genericResponse.data.details);
      assert.equal(genericResponse.data.details.partnerSummary.header, 'task-detail:partner-details.header.married');
      assert.lengthOf(genericResponse.data.details.partnerSummary.rows, '4');
    });

    it('should return task view when requested with API response OK - Civil Partnership', async () => {
      nock('http://test-url/').get(`${awardByInviteKeyUri}/${civilWorkItem.inviteKey}`).reply(httpStatus.OK, claimData.validClaimCivilPartner());
      await controller.getTaskDetail(civilTaskRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/tasks/detail');
      assert.isObject(genericResponse.data.details);
      assert.equal(genericResponse.data.details.partnerSummary.header, 'task-detail:partner-details.header.civil');
      assert.lengthOf(genericResponse.data.details.partnerSummary.rows, '4');
    });
  });

  describe('getTaskComplete function', () => {
    it('should return spouse task view when requested', () => {
      controller.getTaskComplete(marriedTaskRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/tasks/complete');
      assert.equal(genericResponse.data.details.reason, 'married');
    });
    it('should return civil partner task view when requested', () => {
      controller.getTaskComplete(civilTaskRequest, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/tasks/complete');
      assert.equal(genericResponse.data.details.reason, 'civilpartnership');
    });
  });

  describe('getEndTask function', () => {
    it('should be defined when calling function', () => {
      assert.isDefined(controller.getEndTask);
      assert.isFunction(controller.getEndTask);
    });

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
      assert.equal(flash.message, errorHelper.errorMessage(httpStatus.NOT_FOUND));
      assert.equal(genericResponse.locals.logMessage, '404 - 404 - {} - Requested on /api/workitem/update-status-complete');
    });

    it('should be return a redirect with OK message', async () => {
      nock('http://test-url/').put(putWorkItemUpdateStatusCompleteUri).reply(httpStatus.OK, {});
      await controller.getEndTask(marriedTaskRequest, genericResponse);
      assert.equal(genericResponse.address, '/tasks');
      assert.isUndefined(marriedTaskRequest.session.tasks);
    });
  });
});
