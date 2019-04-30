const formValidator = require('../../../../lib/formValidator');
const keyDetailsHelper = require('../../../../lib/keyDetailsHelper');
const dataStore = require('../../../../lib/dataStore');

const activeGlobalNavigationSection = 'payment';

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
  const keyDetails = keyDetailsHelper.formatter(req.session.awardDetails);
  const { awardDetails } = req.session;
  let inputFrequency = false;
  if (req.session['payment-frequency'] && req.session['payment-frequency'].frequency) {
    inputFrequency = req.session['payment-frequency'].frequency;
  }

  res.render('pages/changes-enquiries/payment-frequency/index', {
    keyDetails,
    awardDetails,
    inputFrequency,
    activeGlobalNavigationSection,
    selectedPaymentFrequency,
  });
}

function isFrequencySame(details, frequency) {
  const frequencyString = details.paymentFrequency;
  if (frequency === frequencyString) {
    return true;
  }
  return false;
}

function postChangePaymentFrequency(req, res) {
  const details = req.body;
  const { awardDetails } = req.session;
  const errors = formValidator.paymentFrequency(details);
  const keyDetails = keyDetailsHelper.formatter(awardDetails);
  if (Object.keys(errors).length === 0) {
    if (isFrequencySame(awardDetails, details.frequency)) {
      res.redirect('/changes-and-enquiries/payment');
    } else {
      dataStore.save(req, 'payment-frequency', details);
      res.redirect('/changes-and-enquiries/payment/frequency/schedule');
    }
  } else {
    res.render('pages/changes-enquiries/payment-frequency/index', {
      keyDetails,
      awardDetails,
      activeGlobalNavigationSection,
      selectedPaymentFrequency,
      details,
      errors,
    });
  }
}

module.exports.getChangePaymentFrequency = getChangePaymentFrequency;
module.exports.postChangePaymentFrequency = postChangePaymentFrequency;
