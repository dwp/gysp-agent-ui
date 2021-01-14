const domain = require('../lib/urlExtract');

function destroySessionAndRedirect(req, res, redirectUrl) {
  req.session.destroy(() => {
    res.redirect(redirectUrl);
  });
}

function checkPagesNotToRedirect(req) {
  if (req.fullUrl === '/review-award' || req.fullUrl === '/review-award/complete') {
    return true;
  }
  return false;
}

function checkAndCompletedAndNotOnCompletePage(req) {
  if (req.session.awardReviewUserHasCompleted === true && checkPagesNotToRedirect(req) === false) {
    return true;
  }
  return false;
}

module.exports = (log) => (req, res, next) => {
  if (req.url.includes('review-award')) {
    if (checkAndCompletedAndNotOnCompletePage(req)) {
      log.info('user has already processed review award');
      res.redirect('/review-award/complete');
    } else if (domain.extract(req.headers.referer) === req.hostname || req.fullUrl === '/review-award') {
      next();
    } else {
      log.info(`Security redirect - user agent failed to match - ${req.method} ${req.fullUrl}`);
      destroySessionAndRedirect(req, res, '/review-award');
    }
  } else {
    next();
  }
};
