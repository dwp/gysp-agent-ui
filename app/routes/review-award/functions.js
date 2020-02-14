const request = require('request-promise');
const httpStatus = require('http-status-codes');
const querystring = require('querystring');
const dateHelper = require('../../../lib/dateHelper');
const requestHelper = require('../../../lib/requestHelper');
const deleteSession = require('../../../lib/deleteSession');
const keyDetailsHelper = require('../../../lib/keyDetailsHelper');
const dataStore = require('../../../lib/dataStore');
const reviewAwardReasonObject = require('../../../lib/objects/reviewAwardReasonObject');
const paymentObject = require('../../../lib/objects/processClaimPaymentObject');
const srbAmountUpdateObject = require('../../../lib/objects/srbAmountUpdateObject');

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
  deleteSession.deleteReviewAward(req, 'all');
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

function srbPaymentBreakdownURL(res, inviteKey, reviewAward) {
  const { newStatePensionAmount, protectedPaymentAmount, entitlementDate } = reviewAward;
  const query = querystring.stringify({
    inviteKey,
    spAmount: newStatePensionAmount,
    protectedAmount: protectedPaymentAmount,
    entitlementDate: dateHelper.timestampToDateDash(entitlementDate),
  });
  return `${res.locals.agentGateway}api/award/srbpaymentbreakdown?${query}`;
}

function getPaymentScheduleErrorHandler(err, req, res) {
  const traceID = requestHelper.getTraceID(err);
  const getPath = requestHelper.getPath(err);
  requestHelper.loggingHelper(err, getPath, traceID, res.locals.logger);
  if (err.statusCode === httpStatus.NOT_FOUND) {
    res.render('pages/error', { status: '- Payment breakdown not found.' });
  } else {
    res.render('pages/error', { status: '- Issue getting payment breakdown.' });
  }
}

async function getPaymentSchedule(req, res) {
  const award = dataStore.get(req, 'award');
  const reviewAward = dataStore.get(req, 'review-award');
  try {
    const breakDownUrl = srbPaymentBreakdownURL(res, award.inviteKey, reviewAward);
    const paymentScheduleCall = requestHelper.generateGetCall(breakDownUrl, {}, 'award');
    const body = await request(paymentScheduleCall);
    dataStore.save(req, 'srb-breakdown', body);
    const details = paymentObject.formatter(body);
    const keyDetails = keyDetailsHelper.formatter(award);
    const entitlementDate = reviewAwardNewAwardObject.entitlementDateFormatter(reviewAward);
    res.render('pages/review-award/breakdown', {
      keyDetails, details, entitlementDate,
    });
  } catch (err) {
    getPaymentScheduleErrorHandler(err, req, res);
  }
}

function postPaymentScheduleErrorHandler(err, req, res) {
  const traceID = requestHelper.getTraceID(err);
  const getPath = requestHelper.getPath(err);
  requestHelper.loggingHelper(err, getPath, traceID, res.locals.logger);

  if (err.statusCode === httpStatus.BAD_REQUEST) {
    req.flash('error', 'There has been a problem with the service, please go back and try again. This has been logged.');
  } else if (err.statusCode === httpStatus.NOT_FOUND) {
    req.flash('error', 'There has been a problem - award not found. This has been logged.');
  } else {
    req.flash('error', 'There is a problem with the service. This has been logged. Please try again later.');
  }
  res.redirect('/review-award/schedule');
}

function processSessionAndDeleteReviewAward(req) {
  deleteSession.deleteReviewAward(req, 'review-award');
  req.session.awardReviewUserHasCompleted = true;
}

async function postPaymentSchedule(req, res) {
  const { inviteKey } = dataStore.get(req, 'award');
  const reviewAward = dataStore.get(req, 'review-award');
  try {
    const putSrbAmountObject = srbAmountUpdateObject.putObject(inviteKey, reviewAward);
    const srbAmountPutCall = requestHelper.generatePutCall(`${res.locals.agentGateway}api/award/srbamountsupdate`, putSrbAmountObject, 'award', req.user);
    await request(srbAmountPutCall);
    processSessionAndDeleteReviewAward(req);
    res.redirect('/review-award/complete');
  } catch (err) {
    postPaymentScheduleErrorHandler(err, req, res);
  }
}

function getComplete(req, res) {
  const award = dataStore.get(req, 'award');
  const { arrearsPayment } = dataStore.get(req, 'srb-breakdown');
  const keyDetails = keyDetailsHelper.formatter(award);
  res.render('pages/review-award/complete', { keyDetails, arrearsPayment });
}

module.exports.getReviewAward = getReviewAward;
module.exports.getReviewReason = getReviewReason;
module.exports.getNewAward = getNewAward;
module.exports.getPaymentSchedule = getPaymentSchedule;
module.exports.postPaymentSchedule = postPaymentSchedule;
module.exports.getComplete = getComplete;
