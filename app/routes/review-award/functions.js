const request = require('request-promise');
const requestHelper = require('../../../lib/requestHelper');

function getReviewAward(req, res) {
  const reviewAwards = requestHelper.generateGetCall(`${res.locals.agentGateway}api/hmrccalc/count/srb-review`, {}, 'hmrc-calculation');
  request(reviewAwards)
    .then((body) => {
      const total = body;
      res.render('pages/review-award/index', { total });
    }).catch((err) => {
      const traceID = requestHelper.getTraceID(err);
      requestHelper.loggingHelper(err, 'cannot get review award total', traceID, res.locals.logger);
      res.render('pages/error', { status: '- Issue getting awards to review.' });
    });
}

module.exports.getReviewAward = getReviewAward;
