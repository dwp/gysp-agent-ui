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

function stopRestrictedServiceOrigin(req) {
  const referrer = req.get('Referrer') || '';
  const stopRestrictiveConditions = ['search-result', 'changes-and-enquiries', 'tasks'];
  return stopRestrictiveConditions.some((el) => referrer.includes(el));
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
