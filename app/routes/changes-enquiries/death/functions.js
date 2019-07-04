const request = require('request-promise');
const httpStatus = require('http-status-codes');

const formValidator = require('../../../../lib/formValidator');
const requestHelper = require('../../../../lib/requestHelper');
const keyDetailsHelper = require('../../../../lib/keyDetailsHelper');
const secondaryNavigationHelper = require('../../../../lib/helpers/secondaryNavigationHelper');
const deathObject = require('../../../../lib/objects/deathObject');

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

module.exports.getAddDateDeath = getAddDateDeath;
module.exports.postAddDateDeath = postAddDateDeath;
