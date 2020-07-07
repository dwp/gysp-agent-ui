const domain = require('../../lib/urlExtract');
const dataStore = require('../dataStore');

function destroySessionAndRedirect(req, res, redirectUrl) {
  req.session.destroy(() => {
    res.redirect(redirectUrl);
  });
}

module.exports = (log) => (req, res, next) => {
  if (req.fullUrl === '/tasks') {
    res.locals.restrictedService = true;
    res.locals.activeTab = 'tasks';
  }
  if (req.url.includes('tasks')) {
    res.locals.restrictedService = true;
    res.locals.origin = dataStore.get(req, 'origin');
    if (domain.extract(req.headers.referer) === req.hostname || req.fullUrl === '/tasks') {
      next();
    } else {
      log.info(`Security redirect - user agent failed to match - ${req.method} ${req.fullUrl}`);
      destroySessionAndRedirect(req, res, '/tasks');
    }
  } else {
    next();
  }
};
