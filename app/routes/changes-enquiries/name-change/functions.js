const request = require('request-promise');
const httpStatus = require('http-status-codes');

const dataStore = require('../../../../lib/dataStore');
const nameChangeObject = require('../../../../lib/objects/api/nameChangeObject');
const redirectHelper = require('../../../../lib/helpers/redirectHelper');
const requestHelper = require('../../../../lib/requestHelper');
const validator = require('../../../../lib/validation/nameChangeValidation');

const nameChangeApiUri = 'api/award/update-name-details';

function getNameChange(req, res) {
  res.render('pages/changes-enquiries/personal/name-change', {
    backHref: '/personal',
  });
}

function nameChangeGlobalErrorMessage(err) {
  if (err.statusCode === httpStatus.BAD_REQUEST) {
    return 'Error - connection refused.';
  }
  if (err.statusCode === httpStatus.NOT_FOUND) {
    return 'Error - award not found.';
  }
  return 'Error - could not save data.';
}

function nameChangeErrorHandler(err, req, res) {
  const traceID = requestHelper.getTraceID(err);
  requestHelper.loggingHelper(err, nameChangeApiUri, traceID, res.locals.logger);
  res.render('pages/changes-enquiries/personal/name-change', {
    backHref: '/personal',
    details: req.body,
    globalError: nameChangeGlobalErrorMessage(err),
  });
}

async function postNameChange(req, res) {
  const { nino } = dataStore.get(req, 'awardDetails');
  const details = req.body;
  const errors = validator.nameChangeValidation(details);
  if (Object.keys(errors).length === 0) {
    const nameChange = nameChangeObject.formatter(nino, details);
    const putCall = requestHelper.generatePutCall(res.locals.agentGateway + nameChangeApiUri, nameChange, 'award', req.user);
    try {
      await request(putCall);
      redirectHelper.clearSessionKeySuccessAlertAndRedirect(
        req,
        res,
        'awardDetails',
        'name-change:success-message.name.change',
        '/changes-and-enquiries/personal',
      );
    } catch (err) {
      nameChangeErrorHandler(err, req, res);
    }
  } else {
    res.render('pages/changes-enquiries/personal/name-change', {
      backHref: '/personal',
      details,
      errors,
    });
  }
}

module.exports.getNameChange = getNameChange;
module.exports.postNameChange = postNameChange;
