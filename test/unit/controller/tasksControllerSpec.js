const { assert } = require('chai');
const nock = require('nock');
const httpStatus = require('http-status-codes');

nock.disableNetConnect();

const controller = require('../../../app/routes/tasks/functions');

const responseHelper = require('../../lib/responseHelper');

let genericResponse;

const workItemUri = '/api/workitem/next-workitem';

// API Responses
const marriedWorkItem = { inviteKey: 'BOB12345', workItemReason: 'MARRIED' };
const civilWorkItem = { inviteKey: 'BOB12345', workItemReason: 'CIVILPARTNERSHIP' };

const emptyRequest = { session: {} };
const tasksRequest = { session: { tasks: marriedWorkItem } };

const marriedTaskRequest = { session: { tasks: { 'work-item': marriedWorkItem } } };
const civilTaskRequest = { session: { tasks: { 'work-item': civilWorkItem } } };

describe('tasks controller ', () => {
  beforeEach(() => {
    genericResponse = responseHelper.genericResponse();
    genericResponse.locals = {
      traceID: '',
      logMessage: '',
      agentGateway: 'http://test-url/',
      logger: {
        error(traceID, errorTxt) {
          genericResponse.locals.traceID = traceID;
          genericResponse.locals.logMessage = errorTxt;
        },
      },
    };
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
});
