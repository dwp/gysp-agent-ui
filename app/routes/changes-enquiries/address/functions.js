const request = require('request-promise');
const httpStatus = require('http-status-codes');

const formValidator = require('../../../../lib/formValidator');
const requestHelper = require('../../../../lib/requestHelper');
const redirectHelper = require('../../../../lib/helpers/redirectHelper');
const dataStore = require('../../../../lib/dataStore');
const deleteSession = require('../../../../lib/deleteSession');
const validator = require('../../../../lib/validation/internationalAddressValidation');
const { getCountryList } = require('../../../../lib/helpers/countryHelper');
const { getPostCodeAddressLookup } = require('../../../../lib/helpers/locationServiceHelper');

const postcodeLookupObject = require('../../../../lib/objects/postcodeLookupObject');
const addressDetailsObject = require('../../../../lib/objects/addressDetailsObject');
const internationalAddressObject = require('../../../../lib/objects/api/internationalAddressObject');

const updateAddressDetailsApiUri = 'api/award/updateaddressdetails';
const updateOverseasAddressApiUri = 'api/award/update-overseas-address';

function getPostcodeLookup(req, res) {
  res.render('pages/changes-enquiries/address/index', {
    backHref: '/contact',
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

function postcodeLookupErrorHandler(error, req, res) {
  res.render('pages/changes-enquiries/address/index', {
    details: req.body,
    globalError: postcodeLookupGlobalErrorMessage(error),
  });
}

function postPostcodeLookup(req, res) {
  const details = req.body;
  const errors = formValidator.addressPostcodeDetails(details);
  if (Object.keys(errors).length === 0) {
    const { postcode } = postcodeLookupObject.formatter(details);
    getPostCodeAddressLookup(res, postcode).then((body) => {
      req.session.addressLookup = body;
      dataStore.save(req, 'postcode', details);
      res.redirect('/changes-and-enquiries/address/select');
    }).catch((err) => {
      postcodeLookupErrorHandler(err, req, res);
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

function saveAddressGlobalErrorMessage(error) {
  if (error.statusCode === httpStatus.BAD_REQUEST) {
    return 'Error - connection refused.';
  }
  if (error.statusCode === httpStatus.NOT_FOUND) {
    return 'Error - award not found.';
  }
  return 'Error - could not save data.';
}

function saveAddressErrorHandler(err, page, req, res, uri) {
  const traceID = requestHelper.getTraceID(err);
  requestHelper.loggingHelper(err, uri, traceID, res.locals.logger);
  res.render(`pages/changes-enquiries/address/${page}`, {
    backHref: '/address',
    details: req.body,
    globalError: saveAddressGlobalErrorMessage(err),
  });
}

function postSelectAddress(req, res) {
  const details = req.body;
  const errors = formValidator.addressDetails(details);
  if (Object.keys(errors).length === 0) {
    const addressDetails = addressDetailsObject.formatter(req.body, req.session.awardDetails.nino, req.session.addressLookup);
    const putAddressDetailCall = requestHelper.generatePutCall(res.locals.agentGateway + updateAddressDetailsApiUri, addressDetails, 'batch', req.user);
    request(putAddressDetailCall).then(() => {
      deleteSession.deleteChangeAddress(req);
      redirectHelper.successAlertAndRedirect(req, res, 'address:success-message', '/changes-and-enquiries/contact');
    }).catch((err) => {
      saveAddressErrorHandler(err, 'select', req, res, updateAddressDetailsApiUri);
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

function getInternationalAddress(req, res) {
  const countryList = getCountryList(req.body.country);
  res.render('pages/changes-enquiries/address/international-address', {
    backHref: '/address',
    countryList,
  });
}

async function postInternationalAddress(req, res) {
  const { nino } = dataStore.get(req, 'awardDetails');
  const details = req.body;
  const errors = validator.internationalAddressValidation(details);
  if (Object.keys(errors).length === 0) {
    const internationalAddress = internationalAddressObject.formatter(nino, details);
    const putCall = requestHelper.generatePutCall(res.locals.agentGateway + updateOverseasAddressApiUri, internationalAddress, 'award', req.user);
    try {
      await request(putCall);
      redirectHelper.successAlertAndRedirect(req, res, 'address:success-message', '/changes-and-enquiries/contact');
    } catch (err) {
      saveAddressErrorHandler(err, 'international-address', req, res, updateOverseasAddressApiUri);
    }
  } else {
    const countryList = getCountryList(req.body.country);
    res.render('pages/changes-enquiries/address/international-address', {
      backHref: '/address',
      countryList,
      details,
      errors,
    });
  }
}

module.exports.getPostcodeLookup = getPostcodeLookup;
module.exports.postPostcodeLookup = postPostcodeLookup;
module.exports.getSelectAddress = getSelectAddress;
module.exports.postSelectAddress = postSelectAddress;
module.exports.getInternationalAddress = getInternationalAddress;
module.exports.postInternationalAddress = postInternationalAddress;
