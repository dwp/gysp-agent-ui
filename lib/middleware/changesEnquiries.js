const domain = require('../../lib/urlExtract');
const deleteSession = require('../../lib/deleteSession');

function destroyDeathSessionAndRedirect(req, res, redirectUrl) {
  deleteSession.deleteDeathDetail(req);
  res.redirect(redirectUrl);
}

function checkAwardDetailsInSession(req) {
  if (req.session.searchedNino) {
    return true;
  }
  return false;
}

module.exports = (log) => (req, res, next) => {
  if (req.url.includes('changes-and-enquiries')) {
    if (!checkAwardDetailsInSession(req)) {
      res.redirect('/find-someone');
    } else if (req.url.includes('death')) {
      if (domain.extract(req.headers.referer) === req.hostname) {
        next();
      } else {
        log.info(`Security redirect - user agent failed to match - ${req.method} ${req.path}`);
        destroyDeathSessionAndRedirect(req, res, '/changes-and-enquiries/personal');
      }
    } else {
      next();
    }
    if (!req.url.includes('death')) {
      deleteSession.deleteDeathDetail(req);
    }
  } else {
    next();
  }
};
