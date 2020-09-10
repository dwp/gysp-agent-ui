const request = require('request-promise');
const httpStatus = require('http-status-codes');

const requestHelper = require('../../../lib/requestHelper');
const keyDetailsHelper = require('../../../lib/keyDetailsHelper');
const deleteSession = require('../../../lib/deleteSession');
const paymentObject = require('../../../lib/objects/processClaimPaymentObject');

const noStatusCodeErrorMessage = 'Error - could not create letter.';
const error500Message = 'Try again or send claim to BAU';
const backendErrorMessage = 'Error - connection refused.';

function getPaymentErrorHandler(err, req, res) {
  const traceID = requestHelper.getTraceID(err);
  if (err.statusCode === httpStatus.NOT_FOUND) {
    requestHelper.loggingHelper(err, 'payment breakdown not found', traceID, res.locals.logger);
    res.render('pages/error', { status: '- Payment breakdown not found.' });
  } else {
    requestHelper.loggingHelper(err, 'cannot get claim payment detail', traceID, res.locals.logger);
    res.render('pages/error', { status: '- Issue getting payment breakdown.' });
  }
}

function getPayment(req, res, err) {
  const claim = requestHelper.generateGetCall(
    `${res.locals.agentGateway}api/award/paymentbreakdown/${req.session.processClaim.claimDetail.inviteKey}`,
    {},
    'award',
  );
  request(claim)
    .then((body) => {
      const details = paymentObject.formatter(body);
      const keyDetails = keyDetailsHelper.formatter(req.session.processClaim.claimDetail, false);
      if (err) {
        res.render('pages/process-claim-payment/index', { keyDetails, details, globalError: err.message });
      } else {
        res.render('pages/process-claim-payment/index', { keyDetails, details });
      }
    }).catch((error) => {
      getPaymentErrorHandler(error, req, res);
    });
}

function getProcessClaimPayment(req, res) {
  if (req.session.processClaim && req.session.processClaim.claimDetail && req.session.processClaim.claimDetail.inviteKey) {
    getPayment(req, res);
  } else {
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    res.render('pages/error', { status: '- Issue getting payment breakdown.' });
  }
}

function postProcessClaimPaymentErrorHandler(err, req, res) {
  const error = err;
  if (err.statusCode) {
    if (err.statusCode === httpStatus.INTERNAL_SERVER_ERROR) {
      error.message = error500Message;
    } else {
      error.message = backendErrorMessage;
    }
  } else {
    error.message = noStatusCodeErrorMessage;
  }
  getPayment(req, res, error);
}

function postProcessClaimPayment(req, res) {
  if (req.session.processClaim && req.session.processClaim.claimDetail && req.session.processClaim.claimDetail.inviteKey) {
    const postCreateScheduleObject = paymentObject.postObject(req.session.processClaim.claimDetail);
    const postCreateSchedule = requestHelper.generatePostCall(
      `${res.locals.agentGateway}api/award/createschedule`,
      postCreateScheduleObject,
      'award',
    );
    request(postCreateSchedule).then(() => {
      deleteSession.deleteProcessClaim(req);
      req.session.processClaim = { userHasCompleted: true };
      res.redirect('/process-claim/complete');
    }).catch((err) => {
      const traceID = requestHelper.getTraceID(err);
      requestHelper.loggingHelper(err, '/api/award/createschedule', traceID, res.locals.logger);
      postProcessClaimPaymentErrorHandler(err, req, res);
    });
  } else {
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    res.render('pages/error', { status: '- Issue creating letter.' });
  }
}

module.exports.getProcessClaimPayment = getProcessClaimPayment;
module.exports.postProcessClaimPayment = postProcessClaimPayment;
