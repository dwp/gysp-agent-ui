const domain = require('../../lib/urlExtract');

function destroySessionAndRedirect(req, res, redirectUrl) {
  req.session.destroy(() => {
    res.redirect(redirectUrl);
  });
}

function checkPagesNotToRedirect(req) {
  if (req.path === '/review-award' || req.path === '/review-award/complete') {
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

module.exports = log => (req, res, next) => {
  if (req.url.includes('review-award')) {
    if (checkAndCompletedAndNotOnCompletePage(req)) {
      log.info('user has already processed review award');
      res.redirect('/review-award/complete');
    } else if (domain.extract(req.headers.referer) === req.hostname || req.path === '/review-award') {
      next();
    } else {
      log.error(`Security redirect - user agent failed to match - ${req.method} ${req.path}`);
      destroySessionAndRedirect(req, res, '/review-award');
    }
  } else {
    next();
  }
};
