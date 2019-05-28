const request = require('request-promise');
const httpStatus = require('http-status-codes');

const requestHelper = require('../../../../lib/requestHelper');
const keyDetailsHelper = require('../../../../lib/keyDetailsHelper');
const secondaryNavigationHelper = require('../../../../lib/helpers/secondaryNavigationHelper');
const paymentObject = require('../../../../lib/objects/processClaimPaymentObject');
const freqencyScheduleObject = require('../../../../lib/objects/freqencyScheduleObject');

const activeSecondaryNavigationSection = 'payment';
const secondaryNavigationList = secondaryNavigationHelper.navigationItems(activeSecondaryNavigationSection);

const getChangePaymentFrequencyApiUri = 'api/award/frequencychangecalc';
const putChangePaymentFrequencyApiUri = 'api/award/frequencychangeupdate';

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
  const { frequency } = req.session['payment-frequency'];
  const schedule = requestHelper.generateGetCall(
    `${res.locals.agentGateway}${getChangePaymentFrequencyApiUri}?frequency=${frequency}&nino=${req.session.searchedNino}`,
    {},
    'award',
  );
  request(schedule)
    .then((body) => {
      req.session.frequencyChangeSchedule = body;
      const details = paymentObject.formatter(body);
      const keyDetails = keyDetailsHelper.formatterDob(req.session.awardDetails, req.session.awardDetails.dob);
      if (err) {
        res.render('pages/changes-enquiries/payment-frequency-schedule/index', {
          keyDetails,
          details,
          secondaryNavigationList,
          globalError: err.message,
        });
      } else {
        res.render('pages/changes-enquiries/payment-frequency-schedule/index', {
          keyDetails,
          details,
          secondaryNavigationList,
        });
      }
    }).catch((error) => {
      getPaymentErrorHandler(error, req, res);
    });
}

function postChangePaymentFrequencyErrorHandler(error, req, res) {
  const traceID = requestHelper.getTraceID(error);
  requestHelper.loggingHelper(error, putChangePaymentFrequencyApiUri, traceID, res.locals.logger);
  if (error.statusCode === httpStatus.BAD_REQUEST) {
    req.flash('error', 'Error - connection refused.');
  } else if (error.statusCode === httpStatus.NOT_FOUND) {
    req.flash('error', 'Error - award not found.');
  } else {
    req.flash('error', 'Error - could not save data.');
  }

  res.redirect('/changes-and-enquiries/payment/frequency/schedule');
}

function getChangePaymentFrequency(req, res) {
  if (req.session.searchedNino && req.session['payment-frequency']) {
    getPaymentScheduleRequest(req, res);
  } else {
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    res.render('pages/error', { status: '- Issue getting payment schedule.' });
  }
}

function postChangePaymentFrequency(req, res) {
  const scheduleDetails = freqencyScheduleObject.formatter(
    req.session.frequencyChangeSchedule,
    req.session['payment-frequency'].frequency,
    req.session.searchedNino,
  );
  const putScheduleUpdateCall = requestHelper.generatePutCall(
    res.locals.agentGateway + putChangePaymentFrequencyApiUri,
    scheduleDetails,
    'award',
    req.user,
  );
  request(putScheduleUpdateCall).then(() => {
    res.redirect('/changes-and-enquiries/payment');
  }).catch((err) => {
    postChangePaymentFrequencyErrorHandler(err, req, res);
  });
}

module.exports.getChangePaymentFrequency = getChangePaymentFrequency;
module.exports.postChangePaymentFrequency = postChangePaymentFrequency;
