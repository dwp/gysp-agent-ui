const request = require('request-promise');
const httpStatus = require('http-status-codes');

const requestHelper = require('../../../lib/requestHelper');
const formValidator = require('../../../lib/formValidator');
const encryption = require('../../../lib/encryption');
const claimInErrorObject = require('../../../lib/claimInErrorObject');

const noStatusCodeErrorMessage = 'Error - could not get claim data';
const backendErrorMessage = 'Can\'t connect to backend';

function getClaim(req, res) {
  res.render('pages/robot/claim');
}

function postClaimErrorHandle(err, req, res) {
  const details = {};
  if (err.statusCode) {
    if (err.statusCode === httpStatus.NOT_FOUND) {
      details.result = JSON.stringify({ message: err.response.headers.claimmessage });
      res.render('pages/robot/claim', { details, globalError: err.response.headers.claimmessage });
    } else if (err.statusCode === httpStatus.INTERNAL_SERVER_ERROR) {
      details.result = JSON.stringify({ message: err.response.body.message });
      res.render('pages/robot/claim', { details, globalError: err.response.body.message });
    } else {
      details.result = JSON.stringify({ message: noStatusCodeErrorMessage });
      res.render('pages/robot/claim', { details, globalError: noStatusCodeErrorMessage });
    }
  } else {
    details.result = JSON.stringify({ message: backendErrorMessage });
    res.render('pages/robot/claim', { details, globalError: backendErrorMessage });
  }
}

function postClaim(req, res) {
  const getNextPendingClaim = requestHelper.generateGetCall(`${res.locals.agentGateway}api/claim/nextpendingclaim`, {});
  const errors = formValidator.nextClaimErrorValidation(req.body);
  const details = req.body;
  if (Object.keys(errors).length === 0) {
    const key = encryption.decrypt(req.body.accessKey, res.locals.robotSecret);
    if (key === res.locals.robotKey) {
      request(getNextPendingClaim).then((body) => {
        details.result = JSON.stringify(body);
        res.render('pages/robot/claim', { details });
      }).catch((err) => {
        const traceID = requestHelper.getTraceID(err);
        requestHelper.loggingHelper(err, '/api/claim/nextpendingclaim', traceID, res.locals.logger);
        postClaimErrorHandle(err, req, res);
      });
    } else {
      res.render('pages/robot/claim', { details, errors, globalError: 'Error - Incorrect Access key.' });
    }
  } else {
    res.render('pages/robot/claim', { details, errors, globalError: 'Error - Please correct the issues below.' });
  }
}

function getClaimInError(req, res) {
  res.render('pages/robot/claim-in-error');
}

function postClaimInErrorErrorHandle(err, req, res) {
  const details = req.body;
  if (err.statusCode) {
    if (err.statusCode === httpStatus.NOT_FOUND) {
      res.render('pages/robot/claim-in-error', { details, globalError: 'Error - Claim not found for invite key' });
    } else if (err.statusCode === httpStatus.CONFLICT) {
      res.render('pages/robot/claim-in-error', { details, globalError: 'Error - Current claim status is not in SUBMITTED state' });
    } else {
      res.render('pages/robot/claim-in-error', { details, globalError: 'Error - Could not update claim' });
    }
  } else {
    res.render('pages/robot/claim-in-error', { details, globalError: backendErrorMessage });
  }
}

function postClaimInError(req, res) {
  const errors = formValidator.claimInErrorValidation(req.body);
  if (Object.keys(errors).length === 0) {
    const key = encryption.decrypt(req.body.accessKey, res.locals.robotSecret);
    if (key === res.locals.robotKey) {
      const claimInErrorDetails = claimInErrorObject.formatter(req.body);
      const putClaimInError = requestHelper.generatePutCall(`${res.locals.agentGateway}api/claim/claiminerror`, claimInErrorDetails);
      request(putClaimInError).then(() => {
        res.render('pages/robot/claim-in-error', { globalSuccess: 'Success - Claim in error has been added' });
      }).catch((err) => {
        const traceID = requestHelper.getTraceID(err);
        requestHelper.loggingHelper(err, '/api/claim/claiminerror', traceID, res.locals.logger);
        postClaimInErrorErrorHandle(err, req, res, req.body);
      });
    } else {
      res.render('pages/robot/claim-in-error', { details: req.body, errors, globalError: 'Error - Incorrect Access key.' });
    }
  } else {
    res.render('pages/robot/claim-in-error', { details: req.body, errors, globalError: 'Error - Please correct the issues below.' });
  }
}

module.exports.getClaim = getClaim;
module.exports.postClaim = postClaim;
module.exports.getClaimInError = getClaimInError;
module.exports.postClaimInError = postClaimInError;
