const request = require('request-promise');
const httpStatus = require('http-status-codes');

const formValidator = require('../../../../lib/formValidator');
const requestHelper = require('../../../../lib/requestHelper');
const redirectHelper = require('../../../../lib/helpers/redirectHelper');
const dataStore = require('../../../../lib/dataStore');
const deleteSession = require('../../../../lib/deleteSession');

const postcodeLookupObject = require('../../../../lib/objects/postcodeLookupObject');
const addressDetailsObject = require('../../../../lib/objects/addressDetailsObject');

const postcodeLookupApiUri = 'addresses?postcode=';
const awardDetailsUpdateApiUri = 'api/award/updateaddressdetails';

function getPostcodeLookup(req, res) {
  res.render('pages/changes-enquiries/address/index');
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

function postPostcodeLookupErrorHandler(error, req, res) {
  const traceID = requestHelper.getTraceID(error);
  const input = postcodeLookupObject.formatter(req.body);
  const lookupUri = postcodeLookupApiUri + input.postcode;
  requestHelper.loggingHelper(error, lookupUri, traceID, res.locals.logger);
  res.render('pages/changes-enquiries/address/index', {
    details: req.body,
    globalError: postcodeLookupGlobalErrorMessage(error),
  });
}

function postPostcodeLookup(req, res) {
  const details = req.body;
  const errors = formValidator.addressPostcodeDetails(details);
  if (Object.keys(errors).length === 0) {
    const input = postcodeLookupObject.formatter(details);
    const getPostcodeLookupCall = requestHelper.generateGetCall(
      res.locals.agentGateway + postcodeLookupApiUri + input.postcode,
      {},
      'address',
    );
    request(getPostcodeLookupCall).then((body) => {
      if (body.error) {
        throw body.error;
      }
      req.session.addressLookup = body;
      dataStore.save(req, 'postcode', details);
      res.redirect('/changes-and-enquiries/address/select');
    }).catch((err) => {
      postPostcodeLookupErrorHandler(err, req, res);
    });
  } else {
    res.render('pages/changes-enquiries/address/index', {
      details: req.body,
      errors,
    });
  }
}

function getSelectAddress(req, res) {
  if (req.session.addressLookup && dataStore.get(req, 'postcode')) {
    const addressList = postcodeLookupObject.addressList(req.session.addressLookup);
    const postCodeDetails = dataStore.get(req, 'postcode');
    res.render('pages/changes-enquiries/address/select', {
      postCodeDetails,
      addressList,
    });
  } else {
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    res.render('pages/error', { status: '- Issue getting address data.' });
  }
}

function selectAddressGlobalErrorMessage(error) {
  if (error.statusCode === httpStatus.BAD_REQUEST) {
    return 'Error - connection refused.';
  }
  if (error.statusCode === httpStatus.NOT_FOUND) {
    return 'Error - award not found.';
  }
  return 'Error - could not save data.';
}

function postSelectAddressErrorHandler(error, req, res) {
  const traceID = requestHelper.getTraceID(error);
  requestHelper.loggingHelper(error, awardDetailsUpdateApiUri, traceID, res.locals.logger);
  res.render('pages/changes-enquiries/address/select', {
    details: req.body,
    globalError: selectAddressGlobalErrorMessage(error),
  });
}

function postSelectAddress(req, res) {
  const details = req.body;
  const errors = formValidator.addressDetails(details);
  if (Object.keys(errors).length === 0) {
    const addressDetails = addressDetailsObject.formatter(req.body, req.session.awardDetails.nino, req.session.addressLookup);
    const putAddressDetailCall = requestHelper.generatePutCall(
      res.locals.agentGateway + awardDetailsUpdateApiUri,
      addressDetails,
      'batch',
      req.user,
    );
    request(putAddressDetailCall).then(() => {
      deleteSession.deleteChangeAddress(req);
      redirectHelper.successAlertAndRedirect(req, res, 'address:success-message', '/changes-and-enquiries/contact');
    }).catch((err) => {
      postSelectAddressErrorHandler(err, req, res);
    });
  } else {
    const addressList = postcodeLookupObject.addressList(req.session.addressLookup);
    const postCodeDetails = dataStore.get(req, 'postcode');
    res.render('pages/changes-enquiries/address/select', {
      postCodeDetails,
      addressList,
      errors,
    });
  }
}

module.exports.getPostcodeLookup = getPostcodeLookup;
module.exports.postPostcodeLookup = postPostcodeLookup;
module.exports.getSelectAddress = getSelectAddress;
module.exports.postSelectAddress = postSelectAddress;
