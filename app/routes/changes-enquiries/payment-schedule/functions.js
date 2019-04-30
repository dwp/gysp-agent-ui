const request = require('request-promise');
const httpStatus = require('http-status-codes');

const requestHelper = require('../../../../lib/requestHelper');
const keyDetailsHelper = require('../../../../lib/keyDetailsHelper');
const paymentObject = require('../../../../lib/objects/processClaimPaymentObject');

function getPaymentErrorHandler(err, req, res) {
  const traceID = requestHelper.getTraceID(err);
  if (err.statusCode === httpStatus.NOT_FOUND) {
    requestHelper.loggingHelper(err, 'payment schedule not found', traceID, res.locals.logger);
    res.render('pages/error', { status: '- Payment schedule not found.' });
  } else {
    requestHelper.loggingHelper(err, 'cannot get payment schedule', traceID, res.locals.logger);
    res.render('pages/error', { status: '- Issue getting payment schedule.' });
  }
}

function getPaymentScheduleRequest(req, res, err) {
  const schedule = requestHelper.generateGetCall(
    `${res.locals.agentGateway}api/payment/paymentbreakdown/${req.session.searchedNino}`,
    {},
    'payment',
  );
  request(schedule)
    .then((body) => {
      const details = paymentObject.formatter(body);
      const keyDetails = keyDetailsHelper.formatter(req.session.awardDetails);
      if (err) {
        res.render('pages/changes-enquiries/payment-schedule/index', { keyDetails, details, globalError: err.message });
      } else {
        res.render('pages/changes-enquiries/payment-schedule/index', { keyDetails, details });
      }
    }).catch((error) => {
      getPaymentErrorHandler(error, req, res);
    });
}

function getPaymentSchedule(req, res) {
  if (req.session.searchedNino) {
    getPaymentScheduleRequest(req, res);
  } else {
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    res.render('pages/error', { status: '- Issue getting payment schedule.' });
  }
}

module.exports.getPaymentSchedule = getPaymentSchedule;
