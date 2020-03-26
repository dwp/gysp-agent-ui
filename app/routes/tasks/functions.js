const request = require('request-promise');
const httpStatus = require('http-status-codes');

const requestHelper = require('../../../lib/requestHelper');
const dataStore = require('../../../lib/dataStore');
const deleteSession = require('../../../lib/deleteSession');

const taskObject = require('../../../lib/objects/view/taskObject');

const getWorkItemEndPoint = 'api/workitem/next-workitem';

async function getTasks(req, res) {
  try {
    deleteSession.deleteSessionBySection(req, 'tasks');
    const workItemCall = requestHelper.generateGetCall(res.locals.agentGateway + getWorkItemEndPoint, {}, 'filter');
    const workItem = await request(workItemCall);
    dataStore.save(req, 'work-item', workItem, 'tasks');
    res.render('pages/tasks/index', {
      tasks: true,
    });
  } catch (err) {
    if (err.statusCode === httpStatus.NOT_FOUND) {
      res.render('pages/tasks/index', {
        tasks: false,
      });
    } else {
      const traceID = requestHelper.getTraceID(err);
      requestHelper.loggingHelper(err, getWorkItemEndPoint, traceID, res.locals.logger);
      res.render('pages/tasks/index', {
        tasks: false,
      });
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

module.exports.getTasks = getTasks;
module.exports.getTask = getTask;
