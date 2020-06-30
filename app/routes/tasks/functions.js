const request = require('request-promise');
const httpStatus = require('http-status-codes');

const requestHelper = require('../../../lib/requestHelper');
const errorHelper = require('../../../lib/helpers/errorHelper');
const redirectHelper = require('../../../lib/helpers/redirectHelper');
const requestFilterHelper = require('../../../lib/helpers/requestFilterHelper');

const dataStore = require('../../../lib/dataStore');
const deleteSession = require('../../../lib/deleteSession');

const taskObject = require('../../../lib/objects/view/taskObject');
const taskDetailObject = require('../../../lib/objects/view/taskDetailObject');

const getWorkItemEndPoint = 'api/workitem/next-workitem';
const putWorkItemUpdateStatusReturnedEndPoint = 'api/workitem/update-status-returned';
const getAwardByInviteKeyEndPoint = 'api/award/award-by-invite-key';
const putWorkItemUpdateStatusCompleteEndPoint = 'api/workitem/update-status-complete';

function getTasks(req, res) {
  deleteSession.deleteSessionBySection(req, 'tasks');
  res.render('pages/tasks/index', { tasks: true });
}

async function postTasks(req, res) {
  try {
    const workItemCall = requestHelper.generateGetCall(res.locals.agentGateway + getWorkItemEndPoint, {}, 'work-items');
    const workItem = await request(workItemCall);
    dataStore.save(req, 'work-item', workItem, 'tasks');
    res.redirect('/tasks/task');
  } catch (err) {
    if (err.statusCode === httpStatus.NOT_FOUND) {
      res.render('pages/tasks/index', {
        tasks: false,
      });
    } else {
      const traceID = requestHelper.getTraceID(err);
      requestHelper.loggingHelper(err, getWorkItemEndPoint, traceID, res.locals.logger);
      errorHelper.flashErrorAndRedirect(req, res, err, 'work items', '/tasks');
    }
  }
}

function getTask(req, res) {
  const task = dataStore.get(req, 'work-item', 'tasks');
  const details = taskObject.formatter(task);
  res.render('pages/tasks/task', {
    details,
  });
}

async function getReturnTaskToQueue(req, res) {
  try {
    const workItem = dataStore.get(req, 'work-item', 'tasks');
    const filteredRequest = requestFilterHelper.requestFilter(requestFilterHelper.workItem(), workItem);
    const returnCall = requestHelper.generatePutCall(res.locals.agentGateway + putWorkItemUpdateStatusReturnedEndPoint, filteredRequest, 'work-items', req.user);
    await request(returnCall);
    redirectHelper.redirectAndClearSessionKey(req, res, 'tasks', '/tasks');
  } catch (err) {
    errorHelper.flashErrorAndRedirect(req, res, err, 'work items', '/tasks/task');
  }
}

async function getTaskDetail(req, res) {
  try {
    const { inviteKey } = dataStore.get(req, 'work-item', 'tasks');
    const awardCall = requestHelper.generateGetCall(`${res.locals.agentGateway}${getAwardByInviteKeyEndPoint}/${inviteKey}`, {}, 'award');
    const award = await request(awardCall);
    const details = taskDetailObject.formatter(award);
    res.render('pages/tasks/detail', {
      details,
    });
  } catch (err) {
    errorHelper.flashErrorAndRedirect(req, res, err, 'award', '/tasks/task');
  }
}

function getTaskComplete(req, res) {
  const task = dataStore.get(req, 'work-item', 'tasks');
  const details = taskObject.complete(task);
  res.render('pages/tasks/complete', {
    details,
  });
}

async function getEndTask(req, res) {
  try {
    const workItem = dataStore.get(req, 'work-item', 'tasks');
    const filteredRequest = requestFilterHelper.requestFilter(requestFilterHelper.workItem(), workItem);
    const returnCall = requestHelper.generatePutCall(res.locals.agentGateway + putWorkItemUpdateStatusCompleteEndPoint, filteredRequest, 'work-items', req.user);
    await request(returnCall);
    redirectHelper.redirectAndClearSessionKey(req, res, 'tasks', '/tasks');
  } catch (err) {
    errorHelper.flashErrorAndRedirect(req, res, err, 'work items', '/tasks/task/complete');
  }
}

module.exports.getTasks = getTasks;
module.exports.postTasks = postTasks;
module.exports.getTask = getTask;
module.exports.getReturnTaskToQueue = getReturnTaskToQueue;
module.exports.getTaskDetail = getTaskDetail;
module.exports.getTaskComplete = getTaskComplete;
module.exports.getEndTask = getEndTask;
