const domain = require('../../lib/urlExtract');
const dataStore = require('../dataStore');
const deleteSession = require('../deleteSession');

function destroySessionAndRedirect(req, res, redirectUrl) {
  req.session.destroy(() => {
    res.redirect(redirectUrl);
  });
}

function isTasksInSession(req) {
  const task = dataStore.get(req, 'work-item', 'tasks');
  return task !== undefined;
}

module.exports = (log) => (req, res, next) => {
  if (req.fullUrl === '/tasks') {
    res.locals.restrictedService = true;
    res.locals.activeTab = 'tasks';
    deleteSession.deleteTasksSession(req);
  }
  if (req.url.includes('tasks')) {
    res.locals.restrictedService = true;
    res.locals.origin = dataStore.get(req, 'origin');
    if (!isTasksInSession(req) && req.url.includes('/tasks/task')) {
      log.info(`Redirect - user not in session - ${req.method} ${req.fullUrl}`);
      res.redirect('/');
    } else if (domain.extract(req.headers.referer) === req.hostname || req.fullUrl === '/tasks') {
      next();
    } else {
      log.info(`Security redirect - user agent failed to match - ${req.method} ${req.fullUrl}`);
      destroySessionAndRedirect(req, res, '/tasks');
    }
  } else {
    next();
  }
};
