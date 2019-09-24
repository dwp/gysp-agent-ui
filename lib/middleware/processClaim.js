const domain = require('../../lib/urlExtract');

function destroySessionAndRedirect(req, res, redirectUrl) {
  req.session.destroy(() => {
    res.redirect(redirectUrl);
  });
}

function checkPagesNotToRedirect(req) {
  if (req.path === '/process-claim' || req.path === '/process-claim/complete') {
    return true;
  }
  return false;
}

function checkProcessClaimAndCompletedAndNotOnCompletePage(req) {
  if (req.session.processClaim && req.session.processClaim.userHasCompleted === true && checkPagesNotToRedirect(req) === false) {
    return true;
  }
  return false;
}

function sessionIsPresent(req) {
  if (req.session.processClaim === undefined && req.path !== '/process-claim/detail' && req.path !== '/process-claim/all-claims-to-bau') {
    return false;
  }
  if (req.path === '/process-claim/payment' && req.session.processClaim.claimDetail === undefined) {
    return false;
  }

  return true;
}

module.exports = (log) => (req, res, next) => {
  if (req.url.includes('process-claim')) {
    if (!sessionIsPresent(req) && checkPagesNotToRedirect(req) === false) {
      log.info('session is not defined - redirect to /process-claim');
      res.redirect('/process-claim');
    } else if (checkProcessClaimAndCompletedAndNotOnCompletePage(req)) {
      log.info('user has already processed claim');
      res.redirect('/process-claim/complete');
    } else if (domain.extract(req.headers.referer) === req.hostname || req.path === '/process-claim') {
      next();
    } else {
      log.info(`Security redirect - user agent failed to match - ${req.method} ${req.path}`);
      destroySessionAndRedirect(req, res, '/process-claim');
    }
  } else {
    next();
  }
};
