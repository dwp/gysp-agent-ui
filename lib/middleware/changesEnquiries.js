const domain = require('../../lib/urlExtract');

function destroySessionAndRedirect(req, res, redirectUrl) {
  req.session.destroy(() => {
    res.redirect(redirectUrl);
  });
}

function checkAwardDetailsInSession(req) {
  if (req.session.searchedNino) {
    return true;
  }
  return false;
}

module.exports = log => (req, res, next) => {
  if (req.url.includes('changes-and-enquiries')) {
    if (!checkAwardDetailsInSession(req)) {
      res.redirect('/find-someone');
    } else if (domain.extract(req.headers.referer) === req.hostname) {
      next();
    } else {
      log.error(`Security redirect - user agent failed to match - ${req.method} ${req.path}`);
      destroySessionAndRedirect(req, res, '/find-someone');
    }
  } else {
    next();
  }
};
