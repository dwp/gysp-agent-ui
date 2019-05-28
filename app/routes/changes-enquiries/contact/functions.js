const request = require('request-promise');
const httpStatus = require('http-status-codes');

const formValidator = require('../../../../lib/formValidator');
const requestHelper = require('../../../../lib/requestHelper');
const keyDetailsHelper = require('../../../../lib/keyDetailsHelper');
const secondaryNavigationHelper = require('../../../../lib/helpers/secondaryNavigationHelper');
const contactDetailsObject = require('../../../../lib/contactDetailsObject');
const removeContactDetailsObject = require('../../../../lib/removeContactDetailsObject');
const contactDetailsOverview = require('../../../../lib/contactDetailsOverview');

const contactDetailsUpdateUri = 'api/award/updatecontactdetails';

const activeSecondaryNavigationSection = 'contact';
const secondaryNavigationList = secondaryNavigationHelper.navigationItems(activeSecondaryNavigationSection);

function isAddOrChange(details, type) {
  const telephone = new RegExp('^(?:home|mobile|work)$');
  const email = new RegExp('^(?:email)$');
  if (telephone.test(type)) {
    if (details[`${type}TelephoneNumber`] === null) {
      return 'add';
    }
    return 'change';
  }
  if (email.test(type)) {
    if (details[type] === null) {
      return 'add';
    }
    return 'change';
  }
  return 'change';
}

function globalErrorMessage(error) {
  if (error.statusCode === httpStatus.BAD_REQUEST) {
    return 'Error - connection refused.';
  }
  if (error.statusCode === httpStatus.NOT_FOUND) {
    return 'Error - award not found.';
  }
  return 'Error - could not save data.';
}

function contactDetailsView(type) {
  if (type === 'email') {
    return 'pages/changes-enquiries/contact/email';
  }
  return 'pages/changes-enquiries/contact/index';
}

function contactDetailsRemoveView(type) {
  if (type === 'email') {
    return 'pages/changes-enquiries/contact/remove-email';
  }
  return 'pages/changes-enquiries/contact/remove';
}

function getContactDetails(req, res) {
  const award = requestHelper.generateGetCall(`${res.locals.agentGateway}api/award/${req.session.searchedNino}`, {}, 'batch');
  request(award)
    .then((body) => {
      req.session.awardDetails = body;
      req.session.awardDetails.status = 'RECEIVING STATE PENSION';
      const details = contactDetailsOverview.formatter(body);
      const keyDetails = keyDetailsHelper.formatter(req.session.awardDetails);
      res.render('pages/changes-enquiries/contact/overview', { details, keyDetails, secondaryNavigationList });
    }).catch((err) => {
      const traceID = requestHelper.getTraceID(err);
      requestHelper.loggingHelper(err, 'cannot get contact details', traceID, res.locals.logger);
      res.render('pages/error', { status: '- Cannot get contact details.' });
    });
}

function getChangeContactDetails(req, res) {
  const { type } = req.params;
  const addOrChange = isAddOrChange(req.session.awardDetails.contactDetail, type);
  const keyDetails = keyDetailsHelper.formatter(req.session.awardDetails);
  const viewPath = contactDetailsView(type);
  res.render(viewPath, {
    type,
    addOrChange,
    keyDetails,
    secondaryNavigationList,
  });
}

function postChangeContactDetailsErrorHandler(error, req, res, type, addOrChange, keyDetails) {
  const traceID = requestHelper.getTraceID(error);
  requestHelper.loggingHelper(error, contactDetailsUpdateUri, traceID, res.locals.logger);
  const viewPath = contactDetailsView(type);
  res.render(viewPath, {
    type,
    addOrChange,
    keyDetails,
    secondaryNavigationList,
    details: req.body,
    globalError: globalErrorMessage(error),
  });
}

function postChangeContactDetails(req, res) {
  const { type } = req.params;
  const addOrChange = isAddOrChange(req.session.awardDetails.contactDetail, type);
  const errors = formValidator.contactDetails(req.body, type, addOrChange);
  const keyDetails = keyDetailsHelper.formatter(req.session.awardDetails);
  if (Object.keys(errors).length === 0) {
    const contactDetails = contactDetailsObject.formatter(req.body, req.session.awardDetails, type);
    const putContactDetailCall = requestHelper.generatePutCall(res.locals.agentGateway + contactDetailsUpdateUri, contactDetails, 'batch', req.user);
    request(putContactDetailCall).then(() => {
      res.redirect('/changes-and-enquiries/contact');
    }).catch((err) => {
      postChangeContactDetailsErrorHandler(err, req, res, type, addOrChange, keyDetails);
    });
  } else {
    const viewPath = contactDetailsView(type);
    res.render(viewPath, {
      type,
      addOrChange,
      keyDetails,
      secondaryNavigationList,
      details: req.body,
      errors,
    });
  }
}

function getRemoveContactDetails(req, res) {
  const { type } = req.params;
  const keyDetails = keyDetailsHelper.formatter(req.session.awardDetails);
  const viewPath = contactDetailsRemoveView(type);
  res.render(viewPath, {
    type,
    keyDetails,
    secondaryNavigationList,
  });
}

function postRemoveContactDetailsErrorHandler(error, req, res, type, keyDetails) {
  const traceID = requestHelper.getTraceID(error);
  requestHelper.loggingHelper(error, contactDetailsUpdateUri, traceID, res.locals.logger);
  res.render('pages/changes-enquiries/contact/remove', {
    type,
    keyDetails,
    secondaryNavigationList,
    details: req.body,
    globalError: globalErrorMessage(error),
  });
}

function postRemoveContactDetails(req, res) {
  const { type } = req.params;
  const errors = formValidator.removeContact(req.body, type);
  const keyDetails = keyDetailsHelper.formatter(req.session.awardDetails);
  if (Object.keys(errors).length === 0) {
    const input = req.body;
    if (input.removeContact === 'yes' || input.removeContactNumber === 'yes') {
      const contactDetails = removeContactDetailsObject.formatter(req.session.awardDetails, type);
      const putContactDetailCall = requestHelper.generatePutCall(
        res.locals.agentGateway + contactDetailsUpdateUri,
        contactDetails,
        'batch',
        req.user,
      );
      request(putContactDetailCall).then(() => {
        res.redirect('/changes-and-enquiries/contact');
      }).catch((err) => {
        postRemoveContactDetailsErrorHandler(err, req, res, type, keyDetails);
      });
    } else {
      res.redirect(`/changes-and-enquiries/contact/${type}`);
    }
  } else {
    const viewPath = contactDetailsRemoveView(type);
    res.render(viewPath, {
      type,
      keyDetails,
      secondaryNavigationList,
      details: req.body,
      errors,
    });
  }
}

module.exports.getContactDetails = getContactDetails;
module.exports.getChangeContactDetails = getChangeContactDetails;
module.exports.postChangeContactDetails = postChangeContactDetails;
module.exports.getRemoveContactDetails = getRemoveContactDetails;
module.exports.postRemoveContactDetails = postRemoveContactDetails;
