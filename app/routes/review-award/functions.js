const request = require('request-promise');
const requestHelper = require('../../../lib/requestHelper');
const deleteSession = require('../../../lib/deleteSession');
const keyDetailsHelper = require('../../../lib/keyDetailsHelper');
const dataStore = require('../../../lib/dataStore');
const reviewAwardReasonObject = require('../../../lib/objects/reviewAwardReasonObject');

async function cacheRetriveAndStore(req, key, apiCall) {
  if (dataStore.get(req, key)) {
    return dataStore.get(req, key);
  }
  const data = await apiCall();
  dataStore.save(req, key, data);
  return data;
}

const reviewAwardNewAwardObject = require('../../../lib/objects/reviewAwardNewAwardObject');

function getReviewAward(req, res) {
  deleteSession.deleteReviewAward(req);
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
  try {
    const reviewAward = await cacheRetriveAndStore(req, 'review-award', () => {
      const reviewAwardCall = requestHelper.generateGetCall(`${res.locals.agentGateway}api/hmrccalc/next-srb`, {}, 'hmrc-calculation');
      return request(reviewAwardCall);
    });

    const award = await cacheRetriveAndStore(req, 'award', () => {
      const awardCall = requestHelper.generateGetCall(`${res.locals.agentGateway}api/award/${reviewAward.nino}`, {}, 'batch');
      return request(awardCall);
    });
    const keyDetails = keyDetailsHelper.formatter(award);
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

function getNewAward(req, res) {
  try {
    const reviewAward = dataStore.get(req, 'review-award');
    const award = dataStore.get(req, 'award');
    const keyDetails = keyDetailsHelper.formatter(award);
    const details = reviewAwardNewAwardObject.formatter(reviewAward);
    const entitlementDate = reviewAwardNewAwardObject.entitlementDateFormatter(reviewAward);
    res.render('pages/review-award/new-award', {
      keyDetails, details, reviewAward, entitlementDate,
    });
  } catch (err) {
    res.render('pages/error', { status: '- Issue getting award to review.' });
  }
}

module.exports.getReviewAward = getReviewAward;
module.exports.getReviewReason = getReviewReason;
module.exports.getNewAward = getNewAward;
