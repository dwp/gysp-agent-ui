const domain = require('../../lib/urlExtract');

function destroySessionAndRedirect(req, res, redirectUrl) {
  req.session.destroy(() => {
    res.redirect(redirectUrl);
  });
}

function checkPagesNotToRedirect(req) {
  if (req.path === '/tasks' || req.path === '/tasks/complete') {
    return true;
  }
  return false;
}

function checkAndCompletedAndNotOnCompletePage(req) {
  if (req.session.taskUserHasCompleted === true && checkPagesNotToRedirect(req) === false) {
    return true;
  }
  return false;
}

module.exports = (log) => (req, res, next) => {
  if (req.url.includes('tasks')) {
    if (checkAndCompletedAndNotOnCompletePage(req)) {
      log.info('user has already processed task');
      res.redirect('/review-award/complete');
    } else if (domain.extract(req.headers.referer) === req.hostname || req.path === '/tasks') {
      next();
    } else {
      log.info(`Security redirect - user agent failed to match - ${req.method} ${req.path}`);
      destroySessionAndRedirect(req, res, '/tasks');
    }
  } else {
    next();
  }
};
