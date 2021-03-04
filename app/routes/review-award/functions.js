const httpStatus = require('http-status-codes');
const querystring = require('querystring');
const request = require('request-promise');

const dataStore = require('../../../lib/dataStore');
const dateHelper = require('../../../lib/dateHelper');
const deleteSession = require('../../../lib/deleteSession');
const formValidator = require('../../../lib/formValidator');
const keyDetailsHelper = require('../../../lib/keyDetailsHelper');
const reviewAwardScheduleObject = require('../../../lib/objects/view/reviewAwardScheduleObject');
const redirectHelper = require('../../../lib/helpers/redirectHelper');
const requestHelper = require('../../../lib/requestHelper');
const taskHelper = require('../../../lib/helpers/taskHelper');
const errorHelper = require('../../../lib/helpers/errorHelper');
const reviewAwardNewAwardObject = require('../../../lib/objects/reviewAwardNewAwardObject');
const reviewAwardReasonObject = require('../../../lib/objects/reviewAwardReasonObject');
const srbAmountUpdateObject = require('../../../lib/objects/srbAmountUpdateObject');

function getReviewAward(req, res) {
  deleteSession.deleteReviewAward(req, 'all');
  const reviewAwards = requestHelper.generateGetCall(`${res.locals.agentGateway}api/hmrccalc/count/srb-review`, {}, 'hmrc-calculation', req.user);
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
    const reviewAward = await dataStore.cacheRetrieveAndStore(req, null, 'review-award', () => {
      const reviewAwardCall = requestHelper.generateGetCall(`${res.locals.agentGateway}api/hmrccalc/next-srb`, {}, 'hmrc-calculation', req.user);
      return request(reviewAwardCall);
    });

    const award = await dataStore.cacheRetrieveAndStore(req, null, 'award', () => {
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
    const reviewAwardDate = dataStore.get(req, 'review-award-date');
    const award = dataStore.get(req, 'award');
    const keyDetails = keyDetailsHelper.formatter(award);
    const details = reviewAwardNewAwardObject.formatter(reviewAward, reviewAwardDate);
    const spDate = reviewAwardNewAwardObject.spDateFormatter(award.statePensionDate);
    res.render('pages/review-award/new-award', {
      keyDetails, details, reviewAward, spDate,
    });
  } catch (err) {
    res.render('pages/error', { status: '- Issue getting award to review.' });
  }
}

function formatEntitlementDate(entitlementDate, reviewAwardDate) {
  if (reviewAwardDate !== undefined) {
    return dateHelper.timestampToDateDash(`${reviewAwardDate.dateYear}-${reviewAwardDate.dateMonth}-${reviewAwardDate.dateDay}`);
  }
  return dateHelper.timestampToDateDash(entitlementDate);
}

function srbPaymentBreakdownRequest(res, inviteKey, reviewAward, reviewAwardDate) {
  const { newStatePensionAmount, protectedPaymentAmount, entitlementDate } = reviewAward;
  const query = querystring.stringify({
    inviteKey,
    spAmount: newStatePensionAmount,
    protectedAmount: protectedPaymentAmount,
    entitlementDate: formatEntitlementDate(entitlementDate, reviewAwardDate),
  });
  const paymentScheduleCall = requestHelper.generateGetCall(`${res.locals.agentGateway}api/award/srbpaymentbreakdown?${query}`, {}, 'award');
  return request(paymentScheduleCall);
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
  const reviewAwardDate = dataStore.get(req, 'review-award-date');
  try {
    const srbPaymentBreakdown = await srbPaymentBreakdownRequest(res, award.inviteKey, reviewAward, reviewAwardDate);
    dataStore.save(req, 'srb-payment-breakdown', srbPaymentBreakdown);
    const details = reviewAwardScheduleObject.formatter(srbPaymentBreakdown);
    const keyDetails = keyDetailsHelper.formatter(award);
    const spDate = reviewAwardNewAwardObject.spDateFormatter(award.statePensionDate);
    res.render('pages/review-award/breakdown', {
      keyDetails, details, spDate,
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

function updateSrbRequest(req, res) {
  const { inviteKey } = dataStore.get(req, 'award');
  const reviewAward = dataStore.get(req, 'review-award');
  const reviewAwardDate = dataStore.get(req, 'review-award-date');
  const putSrbAmountObject = srbAmountUpdateObject.putObject(inviteKey, reviewAward, reviewAwardDate);
  const srbAmountPutCall = requestHelper.generatePutCall(`${res.locals.agentGateway}api/award/srbamountsupdate`, putSrbAmountObject, 'award', req.user);
  return request(srbAmountPutCall);
}

async function postPaymentSchedule(req, res) {
  try {
    const srbPaymentBreakdown = dataStore.get(req, 'srb-payment-breakdown');
    if (srbPaymentBreakdown && taskHelper.isAwardOverpayment(srbPaymentBreakdown.totalOverpayment)) {
      res.redirect('/review-award/refer-overpayment');
    } else {
      await updateSrbRequest(req, res);
      processSessionAndDeleteReviewAward(req);
      res.redirect('/review-award');
    }
  } catch (err) {
    postPaymentScheduleErrorHandler(err, req, res);
  }
}

function getReferOverPayment(req, res) {
  try {
    const award = dataStore.get(req, 'award');
    const srbPaymentBreakdown = dataStore.get(req, 'srb-payment-breakdown');
    const { view, data } = taskHelper.taskDetail(req, 'SRBOVERPAYMENT', { award, srbPaymentBreakdown });
    res.render(`pages/tasks/${view}`, data);
  } catch (err) {
    errorHelper.flashErrorAndRedirect(req, res, err, 'award', '/review-award/refer-overpayment');
  }
}

function getTaskComplete(req, res) {
  res.render('pages/tasks/complete-overpayment', {
    backHref: '/review-award/refer-overpayment',
    buttonHref: '/review-award/end',
    details: {
      reason: 'srboverpayment',
    },
  });
}

async function getEndTask(req, res) {
  try {
    await updateSrbRequest(req, res);
    processSessionAndDeleteReviewAward(req);
    res.redirect('/review-award');
  } catch (err) {
    errorHelper.flashErrorAndRedirect(req, res, err, 'award', '/review-award/complete');
  }
}

function getNewEntitlementDate(req, res) {
  const award = dataStore.get(req, 'award');
  const keyDetails = keyDetailsHelper.formatter(award);
  const spDate = reviewAwardNewAwardObject.spDateFormatter(award.statePensionDate);
  res.render('pages/review-award/date', { keyDetails, spDate });
}

function postNewEntitlementDate(req, res) {
  const details = req.body;
  const award = dataStore.get(req, 'award');
  const errors = formValidator.reviewAwardEntitlementDateValidation(award.statePensionDate, details);
  if (Object.keys(errors).length === 0) {
    dataStore.save(req, 'review-award-date', details);
    redirectHelper.successAlertAndRedirect(req, res, 'new-award:success-message.entitlement-date.changed', '/review-award/new-award');
  } else {
    const keyDetails = keyDetailsHelper.formatter(award);
    const spDate = reviewAwardNewAwardObject.spDateFormatter(award.statePensionDate);
    res.render('pages/review-award/date', {
      keyDetails,
      spDate,
      details,
      errors,
    });
  }
}

module.exports = {
  getReviewAward,
  getReviewReason,
  getNewAward,
  getPaymentSchedule,
  postPaymentSchedule,
  getNewEntitlementDate,
  postNewEntitlementDate,
  getReferOverPayment,
  getTaskComplete,
  getEndTask,
};
