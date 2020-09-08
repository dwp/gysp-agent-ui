const request = require('request-promise');
const moment = require('moment');
const httpStatus = require('http-status-codes');

const requestHelper = require('../../../lib/requestHelper');

const noStatusCodeErrorMessage = 'Error - could not get claim data';
const error500Message = 'Error - There has been an internal sever error, try again';
const backendErrorMessage = 'Can\'t connect to backend';

function bodyOrReturnedStatus(req) {
  if (req.returnedStatus) {
    return req.returnedStatus.search;
  }
  return req.body.search;
}

function claimDetailObject(details) {
  const object = details;
  object.disableRemoveQueueButton = false;
  if (details.claimStatus !== 'CREATED' && details.claimStatus !== 'ERROR') {
    object.disableRemoveQueueButton = true;
  }
  return object;
}

function makeDateReadable(date) {
  return moment(date).format('DD MMM YYYY');
}

function convertResponseToPdf(res, body) {
  res.type('application/pdf');
  res.writeHead(httpStatus.OK, {
    'Content-Disposition': body.headers['content-disposition'].replace('inline;filename', 'attachment;filename'),
    'Content-Length': body.body.length,
  });
  res.end(body.body);
}

function getFindClaim(req, res) {
  res.render('pages/find-claim/search');
}

function postFindClaimErrorHandle(err, req, res) {
  const details = req.body;
  if (err.statusCode) {
    if (err.statusCode === httpStatus.INTERNAL_SERVER_ERROR) {
      res.render('pages/find-claim/search', { details, globalError: error500Message });
    } else {
      res.render('pages/find-claim/search', { details, globalError: noStatusCodeErrorMessage });
    }
  } else {
    res.render('pages/find-claim/search', { details, globalError: backendErrorMessage });
  }
}

function postFindClaim(req, res) {
  const details = req.body;
  const search = bodyOrReturnedStatus(req);
  const getSearch = requestHelper.generateGetCallWithFullResponse(`${res.locals.agentGateway}api/claim/search/${search}`, {});
  request(getSearch).then((claimDetails) => {
    if (claimDetails.statusCode === httpStatus.NOT_FOUND || claimDetails.statusCode === httpStatus.NOT_ACCEPTABLE) {
      details.noResult = true;
      res.render('pages/find-claim/search', { details });
    } else if (claimDetails.statusCode === httpStatus.OK) {
      details.result = claimDetailObject(claimDetails.body);
      res.render('pages/find-claim/search', { details, makeDateReadable, returnedStatus: req.returnedStatus });
    } else {
      throw claimDetails;
    }
  }).catch((err) => {
    const traceID = requestHelper.getTraceID(err);
    requestHelper.loggingHelper(err, `/api/claim/search/${search}`, traceID, res.locals.logger);
    postFindClaimErrorHandle(err, req, res);
  });
}

function updateStatus(req, res) {
  const claim = requestHelper.generatePutCall(`${res.locals.agentGateway}api/claim/completeclaim/`, { inviteKey: req.body.inviteKey });
  request(claim).then(() => {
    req.returnedStatus = { search: req.body.search };
    postFindClaim(req, res);
  }).catch((err) => {
    const traceID = requestHelper.getTraceID(err);
    requestHelper.loggingHelper(err, 'cannot update status for', traceID, res.locals.logger);
    req.returnedStatus = { status: 'failed', search: req.body.search };
    postFindClaim(req, res);
  });
}

function downloadPdf(req, res) {
  const claim = requestHelper.requestClaimPDF(req.body.inviteKey, res.locals.agentGateway, req.user);
  request(claim).then((body) => {
    convertResponseToPdf(res, body);
  }).catch((err) => {
    const traceID = requestHelper.getTraceID(err);
    requestHelper.loggingHelper(err, 'cannot get pdf', traceID, res.locals.logger);
    res.render('pages/error', { status: '- Issue downloading pdf.' });
  });
}

module.exports.getFindClaim = getFindClaim;
module.exports.postFindClaim = postFindClaim;
module.exports.downloadPdf = downloadPdf;
module.exports.updateStatus = updateStatus;
