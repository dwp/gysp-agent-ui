const request = require('request-promise');
const i18n = require('i18next');
const httpStatus = require('http-status-codes');

i18n.init({ sendMissingTo: 'fallback' });

const dataStore = require('../../../../lib/dataStore');
const requestHelper = require('../../../../lib/requestHelper');
const keyDetailsHelper = require('../../../../lib/keyDetailsHelper');
const requestFilterHelper = require('../../../../lib/helpers/requestFilterHelper');
const errorHelper = require('../../../../lib/helpers/errorHelper');
const formValidator = require('../../../../lib/formValidator');
const deleteSession = require('../../../../lib/deleteSession');
const deathCheckPayeeDetailsObject = require('../../../../lib/objects/view/deathCheckPayeeDetailsObject');
const deathPayeeAccountDetailsObject = require('../../../../lib/objects/view/deathPayeeAccountDetailsObject');
const deathPayeeContactDetailsObject = require('../../../../lib/objects/api/deathPayeeContactDetailsObject');
const deathPayeeDetailsObject = require('../../../../lib/objects/api/deathPayeeDetailsObject');
const deathPayeeArrearsObject = require('../../../../lib/objects/view/deathPayeeArrearsObject');
const postcodeLookupObject = require('../../../../lib/objects/postcodeLookupObject');

const deathPayeeAccountDetailsUpdateApiUri = 'api/award/death-payee-account-details';
const deathContactDetailsUpdateApiUri = 'api/award/death-contact-details';
const postcodeLookupApiUri = 'addresses?postcode=';

async function payeeDetail(req, res, inviteKey, sessionData) {
  if (sessionData) {
    return false;
  }
  const detail = await dataStore.cacheRetriveAndStore(req, 'death-payee-details', inviteKey, () => {
    const requestCall = requestHelper.generateGetCall(`${res.locals.agentGateway}api/award/death-payee-details/${inviteKey}`, {}, 'award');
    return request(requestCall);
  });
  return detail;
}

function updatedPayeeDetails(req) {
  const details = dataStore.get(req, 'death-payee-details-updated');
  return details || false;
}

async function getCheckPayeeDetails(req, res) {
  try {
    deleteSession.deleteDeathDetail(req);
    const awardDetails = dataStore.get(req, 'awardDetails');
    const keyDetails = keyDetailsHelper.formatter(awardDetails);
    const sessionData = updatedPayeeDetails(req);
    const detail = await payeeDetail(req, res, awardDetails.inviteKey, sessionData);
    const pageData = deathCheckPayeeDetailsObject.pageData(detail, sessionData);
    res.render('pages/changes-enquiries/death-payee/check-details', {
      keyDetails,
      pageData,
    });
  } catch (err) {
    const traceID = requestHelper.getTraceID(err);
    const getPath = requestHelper.getPath(err);
    requestHelper.loggingHelper(err, getPath, traceID, res.locals.logger);
    res.render('pages/error', { status: '- There are no payee details.' });
  }
}

function getAccountDetails(req, res) {
  const awardDetails = dataStore.get(req, 'awardDetails');
  const keyDetails = keyDetailsHelper.formatter(awardDetails);
  const pageData = deathPayeeAccountDetailsObject.pageData();
  const details = dataStore.get(req, 'death-payee-account', 'death');
  res.render('pages/changes-enquiries/death-payee/account-details', {
    keyDetails,
    pageData,
    details,
  });
}

function getPayeeName(req, res) {
  const keyDetails = keyDetailsHelper.formatter(req.session.awardDetails);
  const awardDetails = dataStore.get(req, 'awardDetails');
  const details = dataStore.get(req, 'dap-name', 'death');
  res.render('pages/changes-enquiries/death-payee/dap/name', {
    keyDetails,
    awardDetails,
    details,
  });
}

function postPayeeName(req, res) {
  const details = req.body;
  const errors = formValidator.deathDapNameValidation(details);
  if (Object.keys(errors).length === 0) {
    const filteredRequest = requestFilterHelper.requestFilter(requestFilterHelper.deathPayeeName(), details);
    dataStore.save(req, 'dap-name', filteredRequest, 'death');
    res.redirect('/changes-and-enquiries/personal/death/payee-details/phone-number');
  } else {
    const awardDetails = dataStore.get(req, 'awardDetails');
    const keyDetails = keyDetailsHelper.formatter(awardDetails);
    res.render('pages/changes-enquiries/death-payee/dap/name', {
      keyDetails,
      awardDetails,
      details,
      errors,
    });
  }
}

function getPayeePhoneNumber(req, res) {
  const keyDetails = keyDetailsHelper.formatter(req.session.awardDetails);
  const awardDetails = dataStore.get(req, 'awardDetails');
  const details = dataStore.get(req, 'dap-phone-number', 'death');
  res.render('pages/changes-enquiries/death-payee/dap/phone-number', {
    keyDetails,
    awardDetails,
    details,
  });
}

function postPayeePhoneNumber(req, res) {
  const details = req.body;
  const errors = formValidator.deathDapPhoneNumberValidation(details);
  if (Object.keys(errors).length === 0) {
    const filteredRequest = requestFilterHelper.requestFilter(requestFilterHelper.deathDapPhoneNumber(), details);
    dataStore.save(req, 'dap-phone-number', filteredRequest, 'death');
    res.redirect('/changes-and-enquiries/personal/death/payee-details/address');
  } else {
    const awardDetails = dataStore.get(req, 'awardDetails');
    const keyDetails = keyDetailsHelper.formatter(awardDetails);
    res.render('pages/changes-enquiries/death-payee/dap/phone-number', {
      keyDetails,
      awardDetails,
      details,
      errors,
    });
  }
}

function getPayeePostcodeLookup(req, res) {
  const keyDetails = keyDetailsHelper.formatter(req.session.awardDetails);
  const awardDetails = dataStore.get(req, 'awardDetails');
  const details = dataStore.get(req, 'dap-postcode', 'death');
  res.render('pages/changes-enquiries/death-payee/dap/postcode', {
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
  res.render('pages/changes-enquiries/death-payee/dap/postcode', {
    keyDetails,
    awardDetails,
    details,
    globalError: postcodeLookupGlobalErrorMessage(error),
  });
}

function postPayeePostcodeLookup(req, res) {
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
      const filteredRequest = requestFilterHelper.requestFilter(requestFilterHelper.deathPayeePostcode(), details);
      dataStore.save(req, 'address-lookup', response, 'death');
      dataStore.save(req, 'dap-postcode', filteredRequest, 'death');
      res.redirect('/changes-and-enquiries/personal/death/payee-details/address-select');
    }).catch((err) => {
      postDapPostcodeLookupErrorHandler(err, req, res);
    });
  } else {
    res.render('pages/changes-enquiries/death-payee/dap/postcode', {
      keyDetails,
      awardDetails,
      details,
      errors,
    });
  }
}

function getPayeeAddressSelect(req, res) {
  const addressLookup = dataStore.get(req, 'address-lookup', 'death');
  const postcode = dataStore.get(req, 'dap-postcode', 'death');
  if (addressLookup && postcode) {
    const awardDetails = dataStore.get(req, 'awardDetails');
    const keyDetails = keyDetailsHelper.formatter(awardDetails);
    const details = dataStore.get(req, 'dap-address', 'death');
    const addressList = postcodeLookupObject.addressList(addressLookup, details);
    res.render('pages/changes-enquiries/death-payee/dap/address-select', {
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

function saveDataToSessionAndClearFormInput(req, selectedAddress) {
  const deathFormData = dataStore.get(req, 'death');
  dataStore.save(req, 'death-payee-details-updated', { ...deathFormData, 'dap-address': selectedAddress });
  deleteSession.deleteDeathDetail(req);
}

function postPayeeAddressSelect(req, res) {
  const details = req.body;
  const errors = formValidator.addressDetails(details);
  const awardDetails = dataStore.get(req, 'awardDetails');
  const keyDetails = keyDetailsHelper.formatter(awardDetails);
  if (Object.keys(errors).length === 0) {
    const filteredRequest = requestFilterHelper.requestFilter(requestFilterHelper.deathPayeeAddress(), details);
    saveDataToSessionAndClearFormInput(req, filteredRequest);
    res.redirect('/changes-and-enquiries/personal/death/payee-details');
  } else {
    const addressLookup = dataStore.get(req, 'address-lookup', 'death');
    const addressList = postcodeLookupObject.addressList(addressLookup);
    const postCodeDetails = dataStore.get(req, 'dap-postcode', 'death');
    res.render('pages/changes-enquiries/death-payee/dap/address-select', {
      keyDetails,
      postCodeDetails,
      addressList,
      errors,
    });
  }
}

function postAccountDetails(req, res) {
  const details = req.body;
  const errors = formValidator.payeeAccountDetails(details);
  const awardDetails = dataStore.get(req, 'awardDetails');
  const keyDetails = keyDetailsHelper.formatter(awardDetails);
  if (Object.keys(errors).length === 0) {
    dataStore.save(req, 'death-payee-account', details, 'death');
    res.redirect('/changes-and-enquiries/personal/death/payee-arrears');
  } else {
    const pageData = deathPayeeAccountDetailsObject.pageData();
    res.render('pages/changes-enquiries/death-payee/account-details', {
      keyDetails,
      pageData,
      details,
      errors,
    });
  }
}

function getPayArrears(req, res) {
  const awardDetails = dataStore.get(req, 'awardDetails');
  const keyDetails = keyDetailsHelper.formatter(awardDetails);
  const paymentDetails = dataStore.get(req, awardDetails.inviteKey, 'death-payee-details');
  const payeeAccountDetails = dataStore.get(req, 'death-payee-account', 'death');
  const pageData = deathPayeeArrearsObject.pageData(paymentDetails, payeeAccountDetails);
  res.render('pages/changes-enquiries/death-payee/pay-arrears', {
    keyDetails,
    pageData,
  });
}

function getProcessArrearsErrorHandler(error, req, res) {
  const traceID = requestHelper.getTraceID(error);
  const path = requestHelper.getPath(error);
  requestHelper.loggingHelper(error, path, traceID, res.locals.logger);
  req.flash('error', errorHelper.globalErrorMessage(error, 'death payee details'));
  res.redirect('/changes-and-enquiries/personal/death/payee-arrears');
}

async function getProcessArrears(req, res) {
  const awardDetails = dataStore.get(req, 'awardDetails');
  const payeeUpdatedDetails = updatedPayeeDetails(req);
  const payeeAccountDetails = dataStore.get(req, 'death-payee-account', 'death');
  const deathAccountDetails = deathPayeeDetailsObject.formatter(payeeAccountDetails, awardDetails);
  const putAccountDetailCall = requestHelper.generatePutCall(res.locals.agentGateway + deathPayeeAccountDetailsUpdateApiUri, deathAccountDetails, 'award', req.user);
  try {
    if (payeeUpdatedDetails) {
      const deathPayeeUpdateDetails = deathPayeeContactDetailsObject.formatter(payeeUpdatedDetails, awardDetails);
      const putPayeeDetailCall = requestHelper.generatePutCall(res.locals.agentGateway + deathContactDetailsUpdateApiUri, deathPayeeUpdateDetails, 'award', req.user);
      await request(putPayeeDetailCall);
    }
    await request(putAccountDetailCall);
    req.flash('success', i18n.t('death-process-arrears:messages.success'));
    deleteSession.deleteDeathPayeeArrears(req);
    deleteSession.deleteChangesEnquiries(req);
    res.redirect('/changes-and-enquiries/personal');
  } catch (err) {
    getProcessArrearsErrorHandler(err, req, res);
  }
}

module.exports.getCheckPayeeDetails = getCheckPayeeDetails;
module.exports.getPayeeName = getPayeeName;
module.exports.postPayeeName = postPayeeName;
module.exports.getPayeePhoneNumber = getPayeePhoneNumber;
module.exports.postPayeePhoneNumber = postPayeePhoneNumber;
module.exports.getPayeePostcodeLookup = getPayeePostcodeLookup;
module.exports.postPayeePostcodeLookup = postPayeePostcodeLookup;
module.exports.getPayeeAddressSelect = getPayeeAddressSelect;
module.exports.postPayeeAddressSelect = postPayeeAddressSelect;
module.exports.getAccountDetails = getAccountDetails;
module.exports.postAccountDetails = postAccountDetails;
module.exports.getPayArrears = getPayArrears;
module.exports.getProcessArrears = getProcessArrears;
