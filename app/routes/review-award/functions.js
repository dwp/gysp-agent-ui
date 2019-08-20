const request = require('request-promise');
const requestHelper = require('../../../lib/requestHelper');
const keyDetailsHelper = require('../../../lib/keyDetailsHelper');
const dataStore = require('../../../lib/dataStore');
const reviewAwardReasonObject = require('../../../lib/objects/reviewAwardReasonObject');

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

async function getReviewReason(req, res) {
  const reviewAwardCall = requestHelper.generateGetCall(`${res.locals.agentGateway}api/hmrccalc/next-srb`, {}, 'hmrc-calculation');
  try {
    const reviewAward = await request(reviewAwardCall);
    const awardCall = requestHelper.generateGetCall(`${res.locals.agentGateway}api/award/${reviewAward.nino}`, {}, 'batch');
    const award = await request(awardCall);
    const keyDetails = keyDetailsHelper.formatter(award);
    dataStore.save(req, 'reviewAward', reviewAward);
    dataStore.save(req, 'award', award);
    const details = reviewAwardReasonObject.formatter(reviewAward);
    res.render('pages/review-award/reason', {
      keyDetails,
      details,
    });
  } catch (err) {
    const traceID = requestHelper.getTraceID(err);
    const getPath = requestHelper.getPath(err);
    requestHelper.loggingHelper(err, getPath, traceID, res.locals.logger);
    res.render('pages/error', { status: '- There are no awards to review.' });
  }
}

module.exports.getReviewAward = getReviewAward;
module.exports.getReviewReason = getReviewReason;
