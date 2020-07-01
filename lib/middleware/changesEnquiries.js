const domain = require('../urlExtract');
const deleteSession = require('../deleteSession');
const dataStore = require('../dataStore');
const keyDetailsHelper = require('../keyDetailsHelper');

function checkAwardDetailsInSession(req) {
  if (req.session.searchedNino) {
    return true;
  }
  return false;
}

module.exports = (log) => (req, res, next) => {
  if (req.url.includes('changes-and-enquiries')) {
    const awardDetails = dataStore.get(req, 'awardDetails');
    if (awardDetails !== undefined) {
      res.locals.keyDetails = keyDetailsHelper.formatter(awardDetails);
    }

    if (!checkAwardDetailsInSession(req)) {
      res.redirect('/find-someone');
    } else if (req.url.includes('death') || req.url.includes('marital-details')) {
      if (domain.extract(req.headers.referer) === req.hostname) {
        next();
      } else {
        log.info(`Security redirect - user agent failed to match - ${req.method} ${req.fullUrl}`);
        deleteSession.deleteSessionBySection(req, 'marital');
        deleteSession.deleteDeathDetail(req);
        res.redirect('/changes-and-enquiries/personal');
      }
    } else {
      next();
    }
    if (!req.url.includes('death')) {
      deleteSession.deleteDeathDetail(req);
      deleteSession.deleteSessionBySection(req, 'death-payee-details-updated');
      deleteSession.deleteSessionBySection(req, 'death-payment-details');
    }
    if (!req.url.includes('marital-details/')) {
      deleteSession.deleteSessionBySection(req, 'marital');
    }
  } else {
    next();
  }
};
