const domain = require('../lib/urlExtract');
const deleteSession = require('../lib/deleteSession');
const dataStore = require('../lib/dataStore');
const keyDetailsHelper = require('../lib/keyDetailsHelper');

function checkAwardDetailsNotInSession(req) {
  return !req.session.searchedNino;
}

function stopRestrictedServiceOrigin(req) {
  const referrer = req.get('Referrer') || '';
  const stopRestrictiveConditions = ['search-result', 'changes-and-enquiries', 'tasks'];
  return stopRestrictiveConditions.some((el) => referrer.includes(el));
}
function redirectWhenNotInSession(req, res, log) {
  log.info(`Redirect - user not in session - ${req.method} ${req.fullUrl}`);
  res.redirect('/find-someone');
}

module.exports = (log) => (req, res, next) => {
  if (req.fullUrl === '/find-someone') {
    if (stopRestrictedServiceOrigin(req)) {
      dataStore.save(req, 'origin', 'full-service');
    } else if (dataStore.get(req, 'origin') === null) {
      dataStore.save(req, 'origin', 'restricted-service');
    }
    res.locals.restrictedService = true;
    res.locals.origin = dataStore.get(req, 'origin');
    res.locals.activeTab = 'change-and-enquiries';
    next();
  } else if (req.url.includes('find-someone/search-result')) {
    if (checkAwardDetailsNotInSession(req)) {
      redirectWhenNotInSession(req, res, log);
    } else {
      next();
    }
  } else if (req.url.includes('find-someone')) {
    res.locals.restrictedService = true;
    res.locals.origin = dataStore.get(req, 'origin');
    next();
  } else if (req.url.includes('changes-and-enquiries')) {
    res.locals.restrictedService = true;
    res.locals.origin = dataStore.get(req, 'origin');
    const awardDetails = dataStore.get(req, 'awardDetails');
    if (awardDetails !== undefined) {
      res.locals.keyDetails = keyDetailsHelper.formatter(awardDetails);
    }
    if (checkAwardDetailsNotInSession(req)) {
      redirectWhenNotInSession(req, res, log);
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
    if (!req.url.includes('death') && !req.url.includes('deferral')) {
      deleteSession.deleteSessionBySection(req, 'stop-state-pension');
    }
    if (!req.url.includes('death')) {
      deleteSession.deleteDeathDetail(req);
      deleteSession.deleteSessionBySection(req, 'death-payee-details-updated');
      deleteSession.deleteSessionBySection(req, 'death-payment-details');
    }
    if (!req.url.includes('deferral')) {
      deleteSession.deleteSessionBySection(req, 'deferral');
    }
    if (!req.url.includes('marital-details/')) {
      deleteSession.deleteSessionBySection(req, 'marital');
    }
    if (!req.url.includes('manual-payment')) {
      deleteSession.deleteSessionBySection(req, 'manual-payment');
    }
  } else {
    next();
  }
};
