const request = require('request-promise');
const httpStatus = require('http-status-codes');
const i18n = require('i18next');

i18n.init({ sendMissingTo: 'fallback' });

const formValidator = require('../../../../lib/formValidator');
const requestHelper = require('../../../../lib/requestHelper');
const keyDetailsHelper = require('../../../../lib/keyDetailsHelper');
const deathObject = require('../../../../lib/objects/deathObject');
const deathUpdateObject = require('../../../../lib/objects/api/deathUpdateObject');
const deathPaymentObject = require('../../../../lib/objects/view/deathPaymentObject');
const deathCheckDetailsObject = require('../../../../lib/objects/view/deathCheckDetailsObject');
const postcodeLookupObject = require('../../../../lib/objects/postcodeLookupObject');
const dateHelper = require('../../../../lib/dateHelper');
const generalHelper = require('../../../../lib/helpers/general');
const dataStore = require('../../../../lib/dataStore');
const deleteSession = require('../../../../lib/deleteSession');

const deathDetailsUpdateApiUri = 'api/award/record-death';
const deathArrearsApiUri = 'api/payment/death-arrears';
const deathArrearsUpdateApiUri = 'api/award/update-death-calculation';
const postcodeLookupApiUri = 'addresses?postcode=';

function getAddDateDeath(req, res) {
  const keyDetails = keyDetailsHelper.formatter(req.session.awardDetails);
  const { awardDetails } = req.session;
  const details = dataStore.get(req, 'date-of-death', 'death');
  res.render('pages/changes-enquiries/death/enter-date', {
    keyDetails,
    awardDetails,
    details,
  });
}

function postAddDateDeath(req, res) {
  const details = req.body;
  const errors = formValidator.dateOfDeathValidation(details);
  if (Object.keys(errors).length === 0) {
    dataStore.save(req, 'date-of-death', details, 'death');
    dataStore.save(req, 'death-stage', 'defaultRoute', 'death');
    res.redirect('/changes-and-enquiries/personal/death/name');
  } else {
    const awardDetails = dataStore.get(req, 'awardDetails');
    const keyDetails = keyDetailsHelper.formatter(awardDetails);
    res.render('pages/changes-enquiries/death/enter-date', {
      keyDetails,
      details,
      errors,
    });
  }
}

function getDapName(req, res) {
  const keyDetails = keyDetailsHelper.formatter(req.session.awardDetails);
  const awardDetails = dataStore.get(req, 'awardDetails');
  const details = dataStore.get(req, 'dap-name', 'death');
  res.render('pages/changes-enquiries/death/dap/name', {
    keyDetails,
    awardDetails,
    details,
  });
}

function postDapName(req, res) {
  const details = req.body;
  const errors = formValidator.deathDapNameValidation(details);
  if (Object.keys(errors).length === 0) {
    dataStore.save(req, 'dap-name', details, 'death');
    res.redirect('/changes-and-enquiries/personal/death/phone-number');
  } else {
    const awardDetails = dataStore.get(req, 'awardDetails');
    const keyDetails = keyDetailsHelper.formatter(awardDetails);
    res.render('pages/changes-enquiries/death/dap/name', {
      keyDetails,
      awardDetails,
      details,
      errors,
    });
  }
}

function getDapPhoneNumber(req, res) {
  const keyDetails = keyDetailsHelper.formatter(req.session.awardDetails);
  const awardDetails = dataStore.get(req, 'awardDetails');
  const details = dataStore.get(req, 'dap-phone-number', 'death');
  res.render('pages/changes-enquiries/death/dap/phone-number', {
    keyDetails,
    awardDetails,
    details,
  });
}

function postDapPhoneNumber(req, res) {
  const details = req.body;
  const errors = formValidator.deathDapPhoneNumberValidation(details);
  if (Object.keys(errors).length === 0) {
    dataStore.save(req, 'dap-phone-number', details, 'death');
    res.redirect('/changes-and-enquiries/personal/death/address');
  } else {
    const awardDetails = dataStore.get(req, 'awardDetails');
    const keyDetails = keyDetailsHelper.formatter(awardDetails);
    res.render('pages/changes-enquiries/death/dap/phone-number', {
      keyDetails,
      awardDetails,
      details,
      errors,
    });
  }
}

function getDapPostcodeLookup(req, res) {
  deleteSession.deleteDeathAddress(req);
  const keyDetails = keyDetailsHelper.formatter(req.session.awardDetails);
  const awardDetails = dataStore.get(req, 'awardDetails');
  const details = dataStore.get(req, 'dap-phone-number', 'death');
  res.render('pages/changes-enquiries/death/dap/postcode', {
    keyDetails,
    awardDetails,
    details,
  });
}

function postcodeLookupGlobalErrorMessage(error) {
  if (error.statusCode === httpStatus.BAD_REQUEST) {
    return 'Error - connection refused.';
  }
  if (error.statusCode === httpStatus.NOT_FOUND) {
    return 'No address found with that postcode';
  }
  if (error.statusCode === httpStatus.UNAUTHORIZED) {
    return 'Error - connection refused.';
  }
  if (error.statusCode === httpStatus.FORBIDDEN) {
    return 'Error - connection refused.';
  }
  return 'No address found with that postcode';
}

function postDapPostcodeLookupErrorHandler(error, req, res) {
  const details = req.body;
  const awardDetails = dataStore.get(req, 'awardDetails');
  const keyDetails = keyDetailsHelper.formatter(awardDetails);
  const traceID = requestHelper.getTraceID(error);
  const input = postcodeLookupObject.formatter(req.body);
  const lookupUri = postcodeLookupApiUri + input.postcode;
  requestHelper.loggingHelper(error, lookupUri, traceID, res.locals.logger);
  res.render('pages/changes-enquiries/death/dap/postcode', {
    keyDetails,
    awardDetails,
    details,
    globalError: postcodeLookupGlobalErrorMessage(error),
  });
}

function postDapPostcodeLookup(req, res) {
  const details = req.body;
  const awardDetails = dataStore.get(req, 'awardDetails');
  const keyDetails = keyDetailsHelper.formatter(awardDetails);
  const errors = formValidator.addressPostcodeDetails(details);
  if (Object.keys(errors).length === 0) {
    const input = postcodeLookupObject.formatter(details);
    const apiUri = res.locals.agentGateway + postcodeLookupApiUri + input.postcode;
    const getPostcodeLookupCall = requestHelper.generateGetCall(apiUri, {}, 'address');
    request(getPostcodeLookupCall).then((response) => {
      if (response.error) {
        throw response.error;
      }
      dataStore.save(req, 'address-lookup', response, 'death');
      dataStore.save(req, 'dap-postcode', details, 'death');
      res.redirect('/changes-and-enquiries/personal/death/address-select');
    }).catch((err) => {
      postDapPostcodeLookupErrorHandler(err, req, res);
    });
  } else {
    res.render('pages/changes-enquiries/death/dap/postcode', {
      keyDetails,
      awardDetails,
      details,
      errors,
    });
  }
}

function getDapAddressSelect(req, res) {
  const addressLookup = dataStore.get(req, 'address-lookup', 'death');
  const postcode = dataStore.get(req, 'dap-postcode', 'death');
  if (addressLookup && postcode) {
    const awardDetails = dataStore.get(req, 'awardDetails');
    const keyDetails = keyDetailsHelper.formatter(awardDetails);
    const details = dataStore.get(req, 'dap-address', 'death');
    const addressList = postcodeLookupObject.addressList(addressLookup, details);
    res.render('pages/changes-enquiries/death/dap/address-select', {
      keyDetails,
      postCodeDetails: postcode,
      addressList,
      awardDetails,
    });
  } else {
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    res.render('pages/error', { status: '- Issue getting address data.' });
  }
}

function postDapAddressSelect(req, res) {
  const details = req.body;
  const errors = formValidator.addressDetails(details);
  const awardDetails = dataStore.get(req, 'awardDetails');
  const keyDetails = keyDetailsHelper.formatter(awardDetails);
  if (Object.keys(errors).length === 0) {
    dataStore.save(req, 'dap-address', details, 'death');
    const { verification } = dataStore.get(req, 'date-of-death', 'death');
    if (verification === 'V') {
      res.redirect('/changes-and-enquiries/personal/death/payment');
    } else {
      res.redirect('/changes-and-enquiries/personal/death/record');
    }
  } else {
    const addressLookup = dataStore.get(req, 'address-lookup', 'death');
    const addressList = postcodeLookupObject.addressList(addressLookup);
    const postCodeDetails = dataStore.get(req, 'dap-postcode', 'death');
    res.render('pages/changes-enquiries/death/dap/address-select', {
      keyDetails,
      postCodeDetails,
      addressList,
      errors,
    });
  }
}

function deathPaymentView(details) {
  let viewPath = 'pages/changes-enquiries/death/payment';
  if (generalHelper.isNotUndefinedEmptyOrNull(details.amount)) {
    if (Math.sign(details.amount) < 0) {
      viewPath += '/overpayment';
    } else if (Math.sign(details.amount) > 0) {
      viewPath += '/arrears';
    } else {
      viewPath += '/nothing-owed';
    }
  } else {
    viewPath += '/cannot-calculate';
  }
  return viewPath;
}

function getDeathPaymentErrorHandler(error, req, res, keyDetails) {
  const traceID = requestHelper.getTraceID(error);
  requestHelper.loggingHelper(error, deathArrearsApiUri, traceID, res.locals.logger);
  res.render('pages/changes-enquiries/death/payment/index', {
    keyDetails,
    globalError: generalHelper.globalErrorMessage(error),
  });
}

function getDeathPayment(req, res) {
  const awardDetails = dataStore.get(req, 'awardDetails');
  const deathStage = dataStore.get(req, 'death-stage', 'death');
  const keyDetails = keyDetailsHelper.formatter(awardDetails);
  const { dateYear, dateMonth, dateDay } = dataStore.get(req, 'date-of-death', 'death');
  const dateOfDeath = dateHelper.dateDash(`${dateYear}-${dateMonth}-${dateDay}`);
  const getDeathArrearsCall = requestHelper.generateGetCall(`${res.locals.agentGateway}${deathArrearsApiUri}?nino=${awardDetails.nino}&dateOfDeath=${dateOfDeath}`, {}, 'payment');
  request(getDeathArrearsCall).then((details) => {
    dataStore.save(req, 'death-payment', details, 'death');
    const formattedDetails = deathPaymentObject.formatter(details);
    const pageData = deathPaymentObject.pageData(deathStage);
    res.render(deathPaymentView(details), {
      keyDetails,
      details: formattedDetails,
      pageData,
    });
  }).catch((err) => {
    getDeathPaymentErrorHandler(err, req, res, keyDetails);
  });
}

function getCheckDetails(req, res) {
  const awardDetails = dataStore.get(req, 'awardDetails');
  const keyDetails = keyDetailsHelper.formatter(awardDetails);
  const death = dataStore.get(req, 'death');
  const pageData = deathCheckDetailsObject.pageData(death);
  res.render('pages/changes-enquiries/death/check-details', {
    keyDetails,
    pageData,
  });
}

function getRetryCalculationErrorHandler(error, req, res) {
  const traceID = requestHelper.getTraceID(error);
  requestHelper.loggingHelper(error, deathArrearsApiUri, traceID, res.locals.logger);
  req.flash('error', generalHelper.globalErrorMessage(error, 'payment'));
  res.redirect('/changes-and-enquiries/personal');
}

function getRetryCalculation(req, res) {
  const awardDetails = dataStore.get(req, 'awardDetails');
  const keyDetails = keyDetailsHelper.formatter(awardDetails);
  const dateOfDeath = dateHelper.timestampToDateDash(awardDetails.dateOfDeath);
  const getDeathArrearsCall = requestHelper.generateGetCall(`${res.locals.agentGateway}${deathArrearsApiUri}?nino=${awardDetails.nino}&dateOfDeath=${dateOfDeath}`, {}, 'payment');
  request(getDeathArrearsCall).then((details) => {
    dataStore.save(req, 'death-payment', details, 'death');
    const formattedDetails = deathPaymentObject.formatter(details);
    const pageData = deathPaymentObject.pageData('retryCalc');
    res.render(deathPaymentView(details), {
      keyDetails,
      details: formattedDetails,
      pageData,
    });
  }).catch((err) => {
    getRetryCalculationErrorHandler(err, req, res);
  });
}

function getRecordDeathErrorHandler(error, req, res) {
  const traceID = requestHelper.getTraceID(error);
  requestHelper.loggingHelper(error, deathDetailsUpdateApiUri, traceID, res.locals.logger);
  req.flash('error', generalHelper.globalErrorMessage(error, 'award'));
  res.redirect('back');
}

function successMesssage(verification) {
  if (verification === 'V') {
    return i18n.t('death-record:messages.success.verified');
  }
  return i18n.t('death-record:messages.success.not-verified');
}

function getRecordDeath(req, res) {
  const awardDetails = dataStore.get(req, 'awardDetails');
  const death = dataStore.get(req, 'death');
  const deathDetails = deathObject.formatter(death, awardDetails);
  const putDeathDetailsCall = requestHelper.generatePutCall(res.locals.agentGateway + deathDetailsUpdateApiUri, deathDetails, 'award', req.user);
  request(putDeathDetailsCall).then(() => {
    req.flash('success', successMesssage(death['date-of-death'].verification));
    deleteSession.deleteDeathDetail(req);
    deleteSession.deleteChangesEnquiries(req);
    res.redirect('/changes-and-enquiries/personal');
  }).catch((err) => {
    getRecordDeathErrorHandler(err, req, res);
  });
}

function getUpdateDeathErrorHandler(error, req, res) {
  const traceID = requestHelper.getTraceID(error);
  requestHelper.loggingHelper(error, deathArrearsUpdateApiUri, traceID, res.locals.logger);
  req.flash('error', generalHelper.globalErrorMessage(error, 'award'));
  res.redirect('/changes-and-enquiries/personal/death/retry-calculation');
}

function getUpdateDeath(req, res) {
  const awardDetails = dataStore.get(req, 'awardDetails');
  const deathPayment = dataStore.get(req, 'death-payment', 'death');
  if (generalHelper.isNotUndefinedEmptyOrNull(deathPayment.amount)) {
    const deathUpdateDetails = deathUpdateObject.formatter(deathPayment, awardDetails);
    const putDeathUpdateDetailsCall = requestHelper.generatePutCall(res.locals.agentGateway + deathArrearsUpdateApiUri, deathUpdateDetails, 'award', req.user);
    request(putDeathUpdateDetailsCall).then(() => {
      deleteSession.deleteDeathDetail(req);
      deleteSession.deleteChangesEnquiries(req);
      res.redirect('/changes-and-enquiries/personal');
    }).catch((err) => {
      getUpdateDeathErrorHandler(err, req, res);
    });
  } else {
    res.redirect('/changes-and-enquiries/personal');
  }
}

function getVerifyDeath(req, res) {
  const keyDetails = keyDetailsHelper.formatter(req.session.awardDetails);
  const { awardDetails } = req.session;
  const details = dataStore.get(req, 'death');
  res.render('pages/changes-enquiries/death/verify-date', {
    keyDetails,
    awardDetails,
    details,
    dateOfDeath: dateHelper.longDate(awardDetails.dateOfDeath),
  });
}

function postVerifyDeath(req, res) {
  const details = req.body;
  const { awardDetails } = req.session;
  const errors = formValidator.dateOfDeathVerify(details);
  const keyDetails = keyDetailsHelper.formatter(awardDetails);
  if (Object.keys(errors).length === 0) {
    dataStore.save(req, 'verify', details.verify, 'death');
    if (details.verify === 'yes') {
      const verifiedDetails = dateHelper.dateComponents(dateHelper.timestampToDateDash(awardDetails.dateOfDeath));
      verifiedDetails.verification = 'V';
      dataStore.save(req, 'death-stage', 'verifiedDateOfDeathYes', 'death');
      dataStore.save(req, 'date-of-death', verifiedDetails, 'death');
      res.redirect('/changes-and-enquiries/personal/death/payment');
    } else {
      dataStore.save(req, 'date-of-death', null, 'death');
      res.redirect('/changes-and-enquiries/personal/death/verified-date');
    }
  } else {
    res.render('pages/changes-enquiries/death/verify-date', {
      keyDetails,
      dateOfDeath: dateHelper.longDate(awardDetails.dateOfDeath),
      details,
      errors,
    });
  }
}

function getAddVerifedDeath(req, res) {
  const keyDetails = keyDetailsHelper.formatter(req.session.awardDetails);
  const { awardDetails } = req.session;
  const details = dataStore.get(req, 'date-of-death', 'death');

  res.render('pages/changes-enquiries/death/enter-date-verified', {
    keyDetails,
    awardDetails,
    details,
    longDate: dateHelper.longDate,
  });
}

function postAddVerifedDeath(req, res) {
  const details = req.body;
  const { awardDetails } = req.session;
  const errors = formValidator.dateOfDeathVerifedValidation(details);
  const keyDetails = keyDetailsHelper.formatter(awardDetails);
  if (Object.keys(errors).length === 0) {
    details.verification = 'V';
    dataStore.save(req, 'death-stage', 'reVerifiedDateOfDeath', 'death');
    dataStore.save(req, 'date-of-death', details, 'death');
    res.redirect('/changes-and-enquiries/personal/death/payment');
  } else {
    res.render('pages/changes-enquiries/death/enter-date-verified', {
      keyDetails,
      details,
      errors,
    });
  }
}

module.exports.getAddDateDeath = getAddDateDeath;
module.exports.postAddDateDeath = postAddDateDeath;

module.exports.getDapName = getDapName;
module.exports.postDapName = postDapName;
module.exports.getDapPhoneNumber = getDapPhoneNumber;
module.exports.postDapPhoneNumber = postDapPhoneNumber;
module.exports.getDapPostcodeLookup = getDapPostcodeLookup;
module.exports.postDapPostcodeLookup = postDapPostcodeLookup;
module.exports.getDapAddressSelect = getDapAddressSelect;
module.exports.postDapAddressSelect = postDapAddressSelect;

module.exports.getRecordDeath = getRecordDeath;
module.exports.getDeathPayment = getDeathPayment;

module.exports.getCheckDetails = getCheckDetails;

module.exports.getRecordDeath = getRecordDeath;

module.exports.getVerifyDeath = getVerifyDeath;
module.exports.postVerifyDeath = postVerifyDeath;
module.exports.getAddVerifedDeath = getAddVerifedDeath;
module.exports.postAddVerifedDeath = postAddVerifedDeath;

module.exports.getRetryCalculation = getRetryCalculation;
module.exports.getUpdateDeath = getUpdateDeath;
