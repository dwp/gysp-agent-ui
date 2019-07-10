const request = require('request-promise');
const httpStatus = require('http-status-codes');

const formValidator = require('../../../../lib/formValidator');
const requestHelper = require('../../../../lib/requestHelper');
const keyDetailsHelper = require('../../../../lib/keyDetailsHelper');
const secondaryNavigationHelper = require('../../../../lib/helpers/secondaryNavigationHelper');
const deathObject = require('../../../../lib/objects/deathObject');
const deathVerifyObject = require('../../../../lib/objects/deathVerifyObject');
const deathVerifiedObject = require('../../../../lib/objects/deathVerifiedObject');
const dateHelper = require('../../../../lib/dateHelper');

const activeSecondaryNavigationSection = 'personal';
const secondaryNavigationList = secondaryNavigationHelper.navigationItems(activeSecondaryNavigationSection);

const deathDetailsUpdateApiUri = 'api/award/record-death';

function getAddDateDeath(req, res) {
  const keyDetails = keyDetailsHelper.formatter(req.session.awardDetails);
  const { awardDetails } = req.session;

  res.render('pages/changes-enquiries/death/enter-date', {
    keyDetails,
    awardDetails,
    secondaryNavigationList,
  });
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

function postAddDateDeathErrorHandler(error, req, res, keyDetails) {
  const traceID = requestHelper.getTraceID(error);
  requestHelper.loggingHelper(error, deathDetailsUpdateApiUri, traceID, res.locals.logger);
  res.render('pages/changes-enquiries/death/enter-date', {
    keyDetails,
    secondaryNavigationList,
    details: req.body,
    globalError: globalErrorMessage(error),
  });
}

function postAddDateDeath(req, res) {
  const details = req.body;
  const { awardDetails } = req.session;
  const errors = formValidator.dateOfDeathValidation(details);
  const keyDetails = keyDetailsHelper.formatter(awardDetails);
  if (Object.keys(errors).length === 0) {
    const deathDetails = deathObject.formatter(details, awardDetails);
    const putDeathDetailsCall = requestHelper.generatePutCall(res.locals.agentGateway + deathDetailsUpdateApiUri, deathDetails, 'award', req.user);
    request(putDeathDetailsCall).then(() => {
      res.redirect('/changes-and-enquiries/personal');
    }).catch((err) => {
      postAddDateDeathErrorHandler(err, req, res, keyDetails);
    });
  } else {
    res.render('pages/changes-enquiries/death/enter-date', {
      keyDetails,
      secondaryNavigationList,
      details,
      errors,
    });
  }
}

function getVerifyDeath(req, res) {
  const keyDetails = keyDetailsHelper.formatter(req.session.awardDetails);
  const { awardDetails } = req.session;
  res.render('pages/changes-enquiries/death/verify-date', {
    keyDetails,
    awardDetails,
    secondaryNavigationList,
    dateOfDeath: dateHelper.longDate(awardDetails.dateOfDeath),
  });
}

function postVerifyDeathErrorHandler(error, req, res, keyDetails) {
  const traceID = requestHelper.getTraceID(error);
  requestHelper.loggingHelper(error, deathDetailsUpdateApiUri, traceID, res.locals.logger);
  res.render('pages/changes-enquiries/death/verify-date', {
    keyDetails,
    secondaryNavigationList,
    dateOfDeath: dateHelper.longDate(req.session.awardDetails.dateOfDeath),
    details: req.body,
    globalError: globalErrorMessage(error),
  });
}

function postVerifyDeath(req, res) {
  const details = req.body;
  const { awardDetails } = req.session;
  const errors = formValidator.dateOfDeathVerify(details);
  const keyDetails = keyDetailsHelper.formatter(awardDetails);
  if (Object.keys(errors).length === 0) {
    if (details.verify === 'yes') {
      const deathDetails = deathVerifyObject.formatter(awardDetails);
      const putDeathDetailsCall = requestHelper.generatePutCall(res.locals.agentGateway + deathDetailsUpdateApiUri, deathDetails, 'award', req.user);
      request(putDeathDetailsCall).then(() => {
        res.redirect('/changes-and-enquiries/personal');
      }).catch((err) => {
        postVerifyDeathErrorHandler(err, req, res, keyDetails);
      });
    } else {
      res.redirect('/changes-and-enquiries/personal/death/verified-date');
    }
  } else {
    res.render('pages/changes-enquiries/death/verify-date', {
      keyDetails,
      secondaryNavigationList,
      dateOfDeath: dateHelper.longDate(awardDetails.dateOfDeath),
      details,
      errors,
    });
  }
}

function getAddVerifedDeath(req, res) {
  const keyDetails = keyDetailsHelper.formatter(req.session.awardDetails);
  const { awardDetails } = req.session;

  res.render('pages/changes-enquiries/death/enter-date-verified', {
    keyDetails,
    awardDetails,
    secondaryNavigationList,
    longDate: dateHelper.longDate,
  });
}

function postAddVerifedDeathErrorHandler(error, req, res, keyDetails) {
  const traceID = requestHelper.getTraceID(error);
  requestHelper.loggingHelper(error, deathDetailsUpdateApiUri, traceID, res.locals.logger);
  res.render('pages/changes-enquiries/death/enter-date-verified', {
    keyDetails,
    secondaryNavigationList,
    details: req.body,
    globalError: globalErrorMessage(error),
  });
}

function postAddVerifedDeath(req, res) {
  const details = req.body;
  const { awardDetails } = req.session;
  const errors = formValidator.dateOfDeathVerifedValidation(details);
  const keyDetails = keyDetailsHelper.formatter(awardDetails);
  if (Object.keys(errors).length === 0) {
    const deathDetails = deathVerifiedObject.formatter(details, awardDetails);
    const putDeathDetailsCall = requestHelper.generatePutCall(res.locals.agentGateway + deathDetailsUpdateApiUri, deathDetails, 'award', req.user);
    request(putDeathDetailsCall).then(() => {
      res.redirect('/changes-and-enquiries/personal');
    }).catch((err) => {
      postAddVerifedDeathErrorHandler(err, req, res, keyDetails);
    });
  } else {
    res.render('pages/changes-enquiries/death/enter-date-verified', {
      keyDetails,
      secondaryNavigationList,
      details,
      errors,
    });
  }
}


module.exports.getAddDateDeath = getAddDateDeath;
module.exports.postAddDateDeath = postAddDateDeath;
module.exports.getVerifyDeath = getVerifyDeath;
module.exports.postVerifyDeath = postVerifyDeath;
module.exports.getAddVerifedDeath = getAddVerifedDeath;
module.exports.postAddVerifedDeath = postAddVerifedDeath;
