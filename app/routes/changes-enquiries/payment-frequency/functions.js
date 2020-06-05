const request = require('request-promise');
const httpStatus = require('http-status-codes');

const formValidator = require('../../../../lib/formValidator');
const requestHelper = require('../../../../lib/requestHelper');
const redirectHelper = require('../../../../lib/helpers/redirectHelper');
const freqencyScheduleObject = require('../../../../lib/objects/freqencyScheduleObject');

const putChangePaymentFrequencyApiUri = 'api/award/frequencychangeupdate';

function selectedPaymentFrequency(value, currentFrequency, inputFrequency) {
  if (inputFrequency !== false) {
    if (value === inputFrequency) {
      return true;
    }
    return false;
  }
  if (value === currentFrequency) {
    return true;
  }
  return false;
}

function getChangePaymentFrequency(req, res) {
  const { awardDetails } = req.session;
  let inputFrequency = false;
  if (req.session['payment-frequency'] && req.session['payment-frequency'].frequency) {
    inputFrequency = req.session['payment-frequency'].frequency;
  }

  res.render('pages/changes-enquiries/payment-frequency/index', {
    awardDetails,
    inputFrequency,
    selectedPaymentFrequency,
  });
}

function isFrequencySame(details, frequency) {
  return frequency === details.paymentFrequency;
}

function postChangePaymentFrequencyErrorHandler(error, req, res) {
  const traceID = requestHelper.getTraceID(error);
  requestHelper.loggingHelper(error, putChangePaymentFrequencyApiUri, traceID, res.locals.logger);
  if (error.statusCode === httpStatus.BAD_REQUEST) {
    req.flash('error', 'There has been a problem with the service, please go back and try again. This has been logged.');
  } else if (error.statusCode === httpStatus.NOT_FOUND) {
    req.flash('error', 'There has been a problem - award not found. This has been logged.');
  } else {
    req.flash('error', 'There is a problem with the service. This has been logged. Please try again later.');
  }
  res.redirect('/changes-and-enquiries/payment/frequency');
}

function postChangePaymentFrequency(req, res) {
  const details = req.body;
  const { awardDetails } = req.session;
  const errors = formValidator.paymentFrequency(details);
  if (Object.keys(errors).length === 0) {
    if (isFrequencySame(awardDetails, details.frequency)) {
      res.redirect('/changes-and-enquiries/payment');
    } else {
      const scheduleDetails = freqencyScheduleObject.formatter(
        details.frequency,
        req.session.searchedNino,
      );
      const putScheduleUpdateCall = requestHelper.generatePutCall(
        res.locals.agentGateway + putChangePaymentFrequencyApiUri,
        scheduleDetails,
        'award',
        req.user,
      );
      request(putScheduleUpdateCall).then(() => {
        redirectHelper.successAlertAndRedirect(req, res, 'payment-frequency:success-message', '/changes-and-enquiries/payment');
      }).catch((err) => {
        postChangePaymentFrequencyErrorHandler(err, req, res);
      });
    }
  } else {
    res.render('pages/changes-enquiries/payment-frequency/index', {
      awardDetails,
      selectedPaymentFrequency,
      details,
      errors,
    });
  }
}

module.exports.getChangePaymentFrequency = getChangePaymentFrequency;
module.exports.postChangePaymentFrequency = postChangePaymentFrequency;
