const request = require('request-promise');
const httpStatus = require('http-status-codes');

const formValidator = require('../../../../lib/formValidator');
const requestHelper = require('../../../../lib/requestHelper');
const redirectHelper = require('../../../../lib/helpers/redirectHelper');
const secondaryNavigationHelper = require('../../../../lib/helpers/secondaryNavigationHelper');
const timelineHelper = require('../../../../lib/helpers/timelineHelper');
const contactDetailsObject = require('../../../../lib/contactDetailsObject');
const removeContactDetailsObject = require('../../../../lib/removeContactDetailsObject');
const contactDetailsOverview = require('../../../../lib/objects/view/contactDetailsOverview');

const contactDetailsUpdateUri = 'api/award/updatecontactdetails';

const activeSecondaryNavigationSection = 'contact';

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
    .then(async (body) => {
      req.session.awardDetails = body;
      const details = contactDetailsOverview.formatter(body);
      const timelineDetails = await timelineHelper.getTimeline(req, res, 'CONTACT');
      const secondaryNavigationList = secondaryNavigationHelper.navigationItems(activeSecondaryNavigationSection);
      res.render('pages/changes-enquiries/contact/overview', {
        details, secondaryNavigationList, timelineDetails,
      });
    }).catch((err) => {
      const traceID = requestHelper.getTraceID(err);
      requestHelper.loggingHelper(err, 'cannot get contact details', traceID, res.locals.logger);
      res.render('pages/error', { status: '- Cannot get contact details.' });
    });
}

function getChangeContactDetails(req, res) {
  const { type } = req.params;
  const addOrChange = isAddOrChange(req.session.awardDetails.contactDetail, type);
  const viewPath = contactDetailsView(type);
  res.render(viewPath, {
    type,
    addOrChange,
  });
}

function postChangeContactDetailsErrorHandler(error, req, res, type, addOrChange) {
  const traceID = requestHelper.getTraceID(error);
  requestHelper.loggingHelper(error, contactDetailsUpdateUri, traceID, res.locals.logger);
  const viewPath = contactDetailsView(type);
  res.render(viewPath, {
    type,
    addOrChange,
    details: req.body,
    globalError: globalErrorMessage(error),
  });
}

function postChangeContactDetails(req, res) {
  const { type } = req.params;
  const addOrChange = isAddOrChange(req.session.awardDetails.contactDetail, type);
  const errors = formValidator.contactDetails(req.body, type, addOrChange);
  if (Object.keys(errors).length === 0) {
    const contactDetails = contactDetailsObject.formatter(req.body, req.session.awardDetails, type);
    const putContactDetailCall = requestHelper.generatePutCall(res.locals.agentGateway + contactDetailsUpdateUri, contactDetails, 'batch', req.user);
    request(putContactDetailCall).then(() => {
      redirectHelper.successAlertAndRedirect(req, res, `contact-details:success-message.${type}.${addOrChange}`, '/changes-and-enquiries/contact');
    }).catch((err) => {
      postChangeContactDetailsErrorHandler(err, req, res, type, addOrChange);
    });
  } else {
    const viewPath = contactDetailsView(type);
    res.render(viewPath, {
      type,
      addOrChange,
      details: req.body,
      errors,
    });
  }
}

function getRemoveContactDetails(req, res) {
  const { type } = req.params;
  const viewPath = contactDetailsRemoveView(type);
  res.render(viewPath, {
    type,
  });
}

function postRemoveContactDetailsErrorHandler(error, req, res, type) {
  const traceID = requestHelper.getTraceID(error);
  requestHelper.loggingHelper(error, contactDetailsUpdateUri, traceID, res.locals.logger);
  const viewPath = contactDetailsRemoveView(type);
  res.render(viewPath, {
    type,
    details: req.body,
    globalError: globalErrorMessage(error),
  });
}

function postRemoveContactDetails(req, res) {
  const { type } = req.params;
  const errors = formValidator.removeContact(req.body, type);
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
        redirectHelper.successAlertAndRedirect(req, res, `contact-details:success-message.${type}.remove`, '/changes-and-enquiries/contact');
      }).catch((err) => {
        postRemoveContactDetailsErrorHandler(err, req, res, type);
      });
    } else {
      res.redirect(`/changes-and-enquiries/contact/${type}`);
    }
  } else {
    const viewPath = contactDetailsRemoveView(type);
    res.render(viewPath, {
      type,
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
