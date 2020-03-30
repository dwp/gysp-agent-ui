const domain = require('../../lib/urlExtract');

function destroySessionAndRedirect(req, res, redirectUrl) {
  req.session.destroy(() => {
    res.redirect(redirectUrl);
  });
}

module.exports = (log) => (req, res, next) => {
  if (req.url.includes('tasks')) {
    if (domain.extract(req.headers.referer) === req.hostname || req.path === '/tasks') {
      next();
    } else {
      log.info(`Security redirect - user agent failed to match - ${req.method} ${req.path}`);
      destroySessionAndRedirect(req, res, '/tasks');
    }
  } else {
    next();
  }
};
