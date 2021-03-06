const request = require('request-promise');
const httpStatus = require('http-status-codes');
const querystring = require('querystring');

const formValidator = require('../../../../lib/formValidator');
const dataStore = require('../../../../lib/dataStore');
const deleteSession = require('../../../../lib/deleteSession');

const requestHelper = require('../../../../lib/requestHelper');
const keyDetailsHelper = require('../../../../lib/keyDetailsHelper');
const deathHelper = require('../../../../lib/helpers/deathHelper');
const dateHelper = require('../../../../lib/dateHelper');
const generalHelper = require('../../../../lib/helpers/general');
const checkChangeHelper = require('../../../../lib/helpers/checkChangeHelper');
const requestFilterHelper = require('../../../../lib/helpers/requestFilterHelper');
const redirectHelper = require('../../../../lib/helpers/redirectHelper');
const errorHelper = require('../../../../lib/helpers/errorHelper');
const { getPostCodeAddressLookup } = require('../../../../lib/helpers/locationServiceHelper');

const deathObject = require('../../../../lib/objects/deathObject');
const deathUpdateObject = require('../../../../lib/objects/api/deathUpdateObject');
const deathPaymentObject = require('../../../../lib/objects/view/deathPaymentObject');
const deathCheckDetailsObject = require('../../../../lib/objects/view/deathCheckDetailsObject');
const postcodeLookupObject = require('../../../../lib/objects/postcodeLookupObject');
const deathReviewPayeeDetailsObject = require('../../../../lib/objects/view/deathReviewPayeeDetailsObject');

const deathDetailsUpdateApiUri = 'api/award/record-death';
const deathArrearsApiUri = 'api/payment/death-arrears';
const deathArrearsUpdateApiUri = 'api/award/update-death-calculation';

const [CANNOT_CALCULATE, OVERPAYMENT, ARREARS, NOTHING_OWED, DEATH_NOT_VERIFIED] = ['CANNOT_CALCULATE', 'OVERPAYMENT', 'ARREARS', 'NOTHING_OWED', 'DEATH_NOT_VERIFIED'];

const baseUrl = '/changes-and-enquiries/personal';
const deathDateUrl = `${baseUrl}/death`;
const canVerifyDateUrl = `${deathDateUrl}/are-you-able-to-verify-the-date-of-death`;
const verifyDateUrl = `${deathDateUrl}/verify`;
const verifiedDateUrl = `${deathDateUrl}/verified-date`;
const dapNameUrl = `${deathDateUrl}/name`;
const checkDetailsUrl = `${deathDateUrl}/check-details`;
const paymentUrl = `${deathDateUrl}/payment`;

function getAddDateDeath(req, res) {
  const { awardDetails } = req.session;
  const details = dataStore.get(req, 'date-of-death', 'death');
  res.render('pages/changes-enquiries/death/enter-date', {
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

function getRedirectToDapDetails(req, res) {
  dataStore.save(req, 'origin', 'dapOnly', 'death');
  res.redirect(dapNameUrl);
}

function dapNameBackLink(req) {
  const deathOrigin = dataStore.get(req, 'origin', 'death');
  const deathStage = dataStore.get(req, 'death-stage', 'death');
  if (checkChangeHelper.isEditMode(req, 'dap-name')) {
    return checkDetailsUrl;
  }
  if (deathHelper.isOriginDapOnly(deathOrigin)) {
    return baseUrl;
  }
  if (deathOrigin === 'canVerifyDateOfDeath') {
    if (deathStage === 'verifiedDateOfDeathYes') {
      return verifyDateUrl;
    }
    if (deathStage === 'reVerifiedDateOfDeath') {
      return verifiedDateUrl;
    }
    return canVerifyDateUrl;
  }
  return deathDateUrl;
}

function getDapName(req, res) {
  checkChangeHelper.checkAndSetEditMode(req, 'dap-name');
  const keyDetails = keyDetailsHelper.formatter(req.session.awardDetails);
  const awardDetails = dataStore.get(req, 'awardDetails');
  const details = dataStore.get(req, 'dap-name', 'death');
  const backLink = dapNameBackLink(req);
  res.render('pages/changes-enquiries/death/dap/name', {
    backLink,
    keyDetails,
    awardDetails,
    details,
  });
}

function postDapName(req, res) {
  const details = req.body;
  const errors = formValidator.deathDapNameValidation(details);
  const editMode = checkChangeHelper.isEditMode(req, 'dap-name');
  if (Object.keys(errors).length === 0) {
    const redirectUrl = redirectHelper.redirectBasedOnPageAndEditMode('dap-name', editMode);
    const filteredRequest = requestFilterHelper.requestFilter(requestFilterHelper.deathDapName(), details);
    dataStore.checkAndSave(req, 'death', 'dap-name', filteredRequest, editMode);
    checkChangeHelper.checkEditSectionAndClearCheckChange(req, editMode);
    res.redirect(redirectUrl);
  } else {
    const awardDetails = dataStore.get(req, 'awardDetails');
    const keyDetails = keyDetailsHelper.formatter(awardDetails);
    const backLink = dapNameBackLink(req);
    res.render('pages/changes-enquiries/death/dap/name', {
      keyDetails,
      awardDetails,
      details,
      errors,
      backLink,
    });
  }
}

function getDapPhoneNumber(req, res) {
  checkChangeHelper.checkAndSetEditMode(req, 'dap-phone-number');
  const keyDetails = keyDetailsHelper.formatter(req.session.awardDetails);
  const awardDetails = dataStore.get(req, 'awardDetails');
  const details = dataStore.get(req, 'dap-phone-number', 'death');
  const editMode = checkChangeHelper.isEditMode(req, 'dap-phone-number');
  res.render('pages/changes-enquiries/death/dap/phone-number', {
    keyDetails,
    awardDetails,
    details,
    editMode,
  });
}

function postDapPhoneNumber(req, res) {
  const details = req.body;
  const errors = formValidator.deathDapPhoneNumberValidation(details);
  const editMode = checkChangeHelper.isEditMode(req, 'dap-phone-number');
  if (Object.keys(errors).length === 0) {
    const redirectUrl = redirectHelper.redirectBasedOnPageAndEditMode('dap-phone-number', editMode);
    const filteredRequest = requestFilterHelper.requestFilter(requestFilterHelper.deathDapPhoneNumber(), details);
    dataStore.checkAndSave(req, 'death', 'dap-phone-number', filteredRequest, editMode);
    checkChangeHelper.checkEditSectionAndClearCheckChange(req, editMode);
    res.redirect(redirectUrl);
  } else {
    const awardDetails = dataStore.get(req, 'awardDetails');
    const keyDetails = keyDetailsHelper.formatter(awardDetails);
    res.render('pages/changes-enquiries/death/dap/phone-number', {
      keyDetails,
      awardDetails,
      details,
      errors,
      editMode,
    });
  }
}

function getDapPostcodeLookup(req, res) {
  checkChangeHelper.checkAndSetEditMode(req, 'dap-address');
  const keyDetails = keyDetailsHelper.formatter(req.session.awardDetails);
  const awardDetails = dataStore.get(req, 'awardDetails');
  const editMode = checkChangeHelper.isEditMode(req, 'dap-address');
  const details = checkChangeHelper.getEditOrPreviousData(req, 'death', 'dap-postcode', editMode);
  res.render('pages/changes-enquiries/death/dap/postcode', {
    keyDetails,
    awardDetails,
    details,
    editMode,
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
  const editMode = checkChangeHelper.isEditMode(req, 'dap-address');
  if (Object.keys(errors).length === 0) {
    const { postcode } = postcodeLookupObject.formatter(details);
    getPostCodeAddressLookup(res, postcode).then((body) => {
      const redirectUrl = redirectHelper.redirectBasedOnPageAndEditMode('dap-postcode', editMode);
      const filteredRequest = requestFilterHelper.requestFilter(requestFilterHelper.deathDapPostcode(), details);
      if (editMode) {
        dataStore.save(req, 'address-lookup__edit', body, 'death');
        dataStore.checkAndSave(req, 'death', 'dap-postcode__edit', filteredRequest, editMode);
      } else {
        dataStore.save(req, 'address-lookup', body, 'death');
        dataStore.checkAndSave(req, 'death', 'dap-postcode', filteredRequest, editMode);
      }
      res.redirect(redirectUrl);
    }).catch((err) => {
      postDapPostcodeLookupErrorHandler(err, req, res);
    });
  } else {
    res.render('pages/changes-enquiries/death/dap/postcode', {
      keyDetails,
      awardDetails,
      details,
      errors,
      editMode,
    });
  }
}

function getDapAddressSelect(req, res) {
  const editMode = checkChangeHelper.isEditMode(req, 'dap-address');
  const addressLookup = checkChangeHelper.getEditOrPreviousData(req, 'death', 'address-lookup', editMode);
  const postcode = checkChangeHelper.getEditOrPreviousData(req, 'death', 'dap-postcode', editMode);
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
      editMode,
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
  const editMode = checkChangeHelper.isEditMode(req, 'dap-address');
  if (Object.keys(errors).length === 0) {
    const redirectUrl = redirectHelper.redirectBasedOnPageAndEditMode('dap-address', editMode);
    const filteredRequest = requestFilterHelper.requestFilter(requestFilterHelper.deathDapAddress(), details);
    if (editMode) {
      dataStore.checkAndSave(req, 'death', 'dap-address__edit', filteredRequest, editMode);
    } else {
      dataStore.checkAndSave(req, 'death', 'dap-address', filteredRequest, editMode);
    }
    res.redirect(redirectUrl);
  } else {
    const addressLookup = dataStore.get(req, 'address-lookup', 'death');
    const addressList = postcodeLookupObject.addressList(addressLookup);
    const postCodeDetails = dataStore.get(req, 'dap-postcode', 'death');
    res.render('pages/changes-enquiries/death/dap/address-select', {
      keyDetails,
      postCodeDetails,
      addressList,
      errors,
      editMode,
    });
  }
}

function deathPaymentStatus(amount) {
  let status = CANNOT_CALCULATE;
  if (generalHelper.isNotUndefinedEmptyOrNull(amount)) {
    if (Math.sign(amount) < 0) {
      status = OVERPAYMENT;
    } else if (Math.sign(amount) > 0) {
      status = ARREARS;
    } else {
      status = NOTHING_OWED;
    }
  }
  return status;
}

function getDeathPaymentErrorHandler(error, req, res, keyDetails) {
  const traceID = requestHelper.getTraceID(error);
  requestHelper.loggingHelper(error, deathArrearsApiUri, traceID, res.locals.logger);
  res.render('pages/changes-enquiries/death/payment/index', {
    keyDetails,
    globalError: generalHelper.globalErrorMessage(error),
  });
}

function buildGetDeathArrearsUrl(req, res) {
  const { nino, deathDetail } = dataStore.get(req, 'awardDetails');
  const dateOfDeathPage = dataStore.get(req, 'date-of-death', 'death');
  let dateOfDeathFormatted;
  if (dateOfDeathPage) {
    const { dateYear, dateMonth, dateDay } = dateOfDeathPage;
    dateOfDeathFormatted = dateHelper.dateDash(`${dateYear}-${dateMonth}-${dateDay}`);
  } else {
    dateOfDeathFormatted = dateHelper.timestampToDateDash(deathDetail.dateOfDeath);
  }
  const urlQuerystring = querystring.stringify({
    nino,
    dateOfDeath: dateOfDeathFormatted,
  });

  return `${res.locals.agentGateway}${deathArrearsApiUri}?${urlQuerystring}`;
}

function getDeathPayment(req, res) {
  const awardDetails = dataStore.get(req, 'awardDetails');
  const deathStage = dataStore.get(req, 'death-stage', 'death');
  const deathOrigin = dataStore.get(req, 'origin', 'death');
  const { verification } = dataStore.get(req, 'date-of-death', 'death') || Object.create(null);
  const keyDetails = keyDetailsHelper.formatter(awardDetails);
  if (verification === 'V' || deathHelper.isDeathVerified(awardDetails)) {
    const getDeathArrearsCall = requestHelper.generateGetCall(buildGetDeathArrearsUrl(req, res), {}, 'payment');
    request(getDeathArrearsCall).then((details) => {
      dataStore.save(req, 'death-payment-details', details);
      const formattedDetails = deathPaymentObject.formatter(details);
      const status = deathHelper.deathPaymentStatus(details.amount);
      const pageData = deathPaymentObject.pageData(deathStage, status, deathOrigin);
      res.render(deathHelper.deathPaymentView(status), {
        keyDetails,
        details: formattedDetails,
        pageData,
      });
    }).catch((err) => {
      getDeathPaymentErrorHandler(err, req, res, keyDetails);
    });
  } else {
    const pageData = deathPaymentObject.pageDataDeathNotVerified();
    res.render('pages/changes-enquiries/death/payment/death-not-verified', {
      keyDetails,
      pageData,
    });
  }
}

function getCheckDetails(req, res) {
  checkChangeHelper.cleanUpCheckChange(req, 'death');
  const awardDetails = dataStore.get(req, 'awardDetails');
  const keyDetails = keyDetailsHelper.formatter(awardDetails);
  const death = dataStore.get(req, 'death');
  const deathPayment = dataStore.get(req, 'death-payment-details');
  let status;
  if (death['date-of-death'] && death['date-of-death'].verification === 'NV') {
    status = DEATH_NOT_VERIFIED;
  } else {
    status = deathPaymentStatus(deathPayment.amount);
  }
  const pageData = deathCheckDetailsObject.pageData(death, status);
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
  const dateOfDeath = dateHelper.timestampToDateDash(awardDetails.deathDetail.dateOfDeath);
  const getDeathArrearsCall = requestHelper.generateGetCall(`${res.locals.agentGateway}${deathArrearsApiUri}?nino=${awardDetails.nino}&dateOfDeath=${dateOfDeath}`, {}, 'payment');
  request(getDeathArrearsCall).then((details) => {
    dataStore.save(req, 'death-stage', 'retryCalc', 'death');
    dataStore.save(req, 'death-payment-details', details);
    const formattedDetails = deathPaymentObject.formatter(details);
    const status = deathHelper.deathPaymentStatus(details.amount);
    const pageData = deathPaymentObject.pageData('retryCalc', status);
    res.render(deathHelper.deathPaymentView(status), {
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

function getRecordDeath(req, res) {
  const awardDetails = dataStore.get(req, 'awardDetails');
  const death = dataStore.get(req, 'death');
  const origin = death && death.origin;
  const deathPayment = dataStore.get(req, 'death-payment-details');
  const status = (deathPayment && deathPaymentStatus(deathPayment.amount)) || DEATH_NOT_VERIFIED;
  const deathDetails = deathObject.formatter(death, deathPayment, awardDetails, status, origin);
  const putDeathDetailsCall = requestHelper.generatePutCall(res.locals.agentGateway + deathDetailsUpdateApiUri, deathDetails, 'award', req.user);
  request(putDeathDetailsCall).then(() => {
    req.flash('success', deathHelper.successMessage(deathDetails.dateOfDeathVerification, status, origin));
    deleteSession.deleteAllDeathSession(req);
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
  const deathPayment = dataStore.get(req, 'death-payment-details');
  const deathStage = dataStore.get(req, 'death-stage', 'death');
  if (generalHelper.isNotUndefinedEmptyOrNull(deathPayment.amount)) {
    const deathUpdateDetails = deathUpdateObject.formatter(deathPayment, awardDetails);
    const putDeathUpdateDetailsCall = requestHelper.generatePutCall(res.locals.agentGateway + deathArrearsUpdateApiUri, deathUpdateDetails, 'award', req.user);
    const status = deathPaymentStatus(deathPayment.amount);
    request(putDeathUpdateDetailsCall).then(() => {
      if (generalHelper.isNotUndefinedEmptyOrNull(deathPayment)) {
        req.flash('success', deathHelper.successMessage('V', status, deathStage));
      }
      deleteSession.deleteAllDeathSession(req);
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
  const backLink = details && details.origin === 'canVerifyDateOfDeath' ? canVerifyDateUrl : baseUrl;
  res.render('pages/changes-enquiries/death/verify-date', {
    keyDetails,
    awardDetails,
    details,
    dateOfDeath: dateHelper.longDate(awardDetails.deathDetail.dateOfDeath),
    backLink,
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
      const deathOrigin = dataStore.get(req, 'origin', 'death');
      dataStore.save(req, 'death-stage', 'verifiedDateOfDeathYes', 'death');
      dataStore.save(req, 'date-of-death', {
        ...dateHelper.dateComponents(awardDetails.deathDetail.dateOfDeath, 'x'),
        verification: 'V',
      }, 'death');
      const redirectUrl = deathOrigin === 'canVerifyDateOfDeath' ? dapNameUrl : paymentUrl;
      res.redirect(redirectUrl);
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

function getAddVerifiedDeath(req, res) {
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

function postAddVerifiedDeath(req, res) {
  const details = req.body;
  const { awardDetails } = req.session;
  const errors = formValidator.dateOfDeathVerifiedValidation(details);
  const keyDetails = keyDetailsHelper.formatter(awardDetails);
  if (Object.keys(errors).length === 0) {
    const deathOrigin = dataStore.get(req, 'origin', 'death');
    details.verification = 'V';
    dataStore.save(req, 'death-stage', 'reVerifiedDateOfDeath', 'death');
    dataStore.save(req, 'date-of-death', details, 'death');
    const redirectUrl = deathOrigin === 'canVerifyDateOfDeath' ? dapNameUrl : paymentUrl;
    res.redirect(redirectUrl);
  } else {
    res.render('pages/changes-enquiries/death/enter-date-verified', {
      keyDetails,
      details,
      errors,
    });
  }
}

async function getReviewPayeeDetails(req, res) {
  try {
    const { amount } = dataStore.get(req, 'death-payment-details');
    const { inviteKey } = dataStore.get(req, 'awardDetails');
    const deathStage = dataStore.get(req, 'death-stage', 'death');
    const detail = await deathHelper.payeeDetails(req, res, inviteKey);
    const status = deathHelper.deathPaymentStatus(amount);
    const pageData = deathReviewPayeeDetailsObject.pageData(detail, status, deathStage);
    res.render('pages/changes-enquiries/death-payee/check-details', { pageData });
  } catch (err) {
    errorHelper.flashErrorAndRedirect(req, res, err, 'payment', 'back');
  }
}

module.exports.getAddDateDeath = getAddDateDeath;
module.exports.postAddDateDeath = postAddDateDeath;

module.exports.getRedirectToDapDetails = getRedirectToDapDetails;

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
module.exports.getAddVerifiedDeath = getAddVerifiedDeath;
module.exports.postAddVerifiedDeath = postAddVerifiedDeath;

module.exports.getRetryCalculation = getRetryCalculation;
module.exports.getUpdateDeath = getUpdateDeath;

module.exports.getReviewPayeeDetails = getReviewPayeeDetails;
