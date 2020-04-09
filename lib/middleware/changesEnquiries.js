const domain = require('../../lib/urlExtract');
const deleteSession = require('../../lib/deleteSession');

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
    } else if (req.url.includes('death') || req.url.includes('marital-details')) {
      if (domain.extract(req.headers.referer) === req.hostname) {
        next();
      } else {
        log.info(`Security redirect - user agent failed to match - ${req.method} ${req.path}`);
        deleteSession.deleteSessionBySection(req, 'marital');
        deleteSession.deleteDeathDetail(req);
        res.redirect('/changes-and-enquiries/personal');
      }
    } else {
      next();
    }
    if (!req.url.includes('death')) {
      deleteSession.deleteDeathDetail(req);
    }
    if (!req.url.includes('marital-details/')) {
      deleteSession.deleteSessionBySection(req, 'marital');
    }
  } else {
    next();
  }
};
