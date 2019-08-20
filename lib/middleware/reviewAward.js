const domain = require('../../lib/urlExtract');

function destroySessionAndRedirect(req, res, redirectUrl) {
  req.session.destroy(() => {
    res.redirect(redirectUrl);
  });
}

module.exports = log => (req, res, next) => {
  if (req.url.includes('review-award')) {
    if (domain.extract(req.headers.referer) === req.hostname || req.path === '/review-award') {
      next();
    } else {
      log.error(`Security redirect - user agent failed to match - ${req.method} ${req.path}`);
      destroySessionAndRedirect(req, res, '/review-award');
    }
  } else {
    next();
  }
};
