const request = require('request-promise');
const httpStatus = require('http-status-codes');

const requestHelper = require('../../../lib/requestHelper');
const formValidator = require('../../../lib/formValidator');

const errorMessage500 = 'Error - could not get claim data';
const errorMessage404 = 'Error - could not get claim data';
const errorMessage400 = 'Error - could not get claim data';
const noStausCodeErrorMessage = 'Error - could not get claim data';
const backendErrorMessage = 'Can\'t connect to backend';

function convertDates(req) {
  return {
    fromDate: `${req.body.fromDateYear}-${req.body.fromDateMonth}-${req.body.fromDateDay}`,
    toDate: `${req.body.toDateYear}-${req.body.toDateMonth}-${req.body.toDateDay}`,
  };
}

function buildGetUri(req) {
  const date = convertDates(req);
  const { type } = req.body;
  return `api/mi/${type}/report?fromDate=${date.fromDate}&toDate=${date.toDate}`;
}

function convertResponseToCSV(req, res, body) {
  const date = convertDates(req);
  const filename = `${req.body.type}-${date.fromDate}-${date.toDate}.csv`;
  res.type('text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  res.setHeader('Content-Length', body.length);
  res.end(body);
}

function getClaimInformation(req, res) {
  res.render('pages/claim-information/claim');
}

function postClaimErrorHandle(err, req, res) {
  if (err.statusCode) {
    if (err.statusCode === httpStatus.NOT_FOUND) {
      res.render('pages/claim-information/claim', { details: req.body, globalError: errorMessage404 });
    } else if (err.statusCode === httpStatus.INTERNAL_SERVER_ERROR) {
      res.render('pages/claim-information/claim', { details: req.body, globalError: errorMessage500 });
    } else if (err.statusCode === httpStatus.BAD_REQUEST) {
      res.render('pages/claim-information/claim', { details: req.body, globalError: errorMessage400 });
    } else {
      res.render('pages/claim-information/claim', { details: req.body, globalError: noStausCodeErrorMessage });
    }
  } else {
    res.render('pages/claim-information/claim', { details: req.body, globalError: backendErrorMessage });
  }
}

function postClaimInformation(req, res) {
  const errors = formValidator.claimInformationValidation(req.body);
  const details = req.body;
  if (Object.keys(errors).length === 0) {
    const uri = buildGetUri(req);
    const claimInformation = requestHelper.requestCSV(res.locals.agentGateway + uri, {});
    request(claimInformation).then((body) => {
      convertResponseToCSV(req, res, body);
    }).catch((err) => {
      const traceID = requestHelper.getTraceID(err);
      requestHelper.loggingHelper(err, uri, traceID, res.locals.logger);
      postClaimErrorHandle(err, req, res);
    });
  } else {
    res.render('pages/claim-information/claim', { details, errors, globalError: 'Error - Please correct the issues below.' });
  }
}

module.exports.getClaimInformation = getClaimInformation;
module.exports.postClaimInformation = postClaimInformation;
