const request = require('request-promise');
const httpStatus = require('http-status-codes');

const requestHelper = require('../../../lib/requestHelper');
const nextClaimObject = require('../../../lib/nextClaimObject');

const noStatusCodeErrorMessage = 'Error - could not get claim data';
const backendErrorMessage = 'Can\'t connect to backend';

const goodHTTPstatus = 200;

function postClaimErrorHandle(err, req, res) {
  if (err.statusCode) {
    if (err.statusCode === httpStatus.NOT_FOUND) {
      res.render('pages/next-claim/claim', { globalError: err.response.headers.claimmessage });
    } else if (err.statusCode === httpStatus.INTERNAL_SERVER_ERROR) {
      res.render('pages/next-claim/claim', { globalError: err.response.body.message });
    } else {
      res.render('pages/next-claim/claim', { globalError: noStatusCodeErrorMessage });
    }
  } else {
    res.render('pages/next-claim/claim', { globalError: backendErrorMessage });
  }
}

function convertResponseToPdf(res, body, filename) {
  res.type('application/pdf');
  res.writeHead(goodHTTPstatus, {
    'Content-Disposition': `attachment;filename=${filename}`,
    'Content-Length': body.length,
  });
  res.end(body);
}

function getClaim(req, res) {
  res.render('pages/next-claim/claim');
}

function postClaim(req, res) {
  const getNextPendingClaim = requestHelper.generateGetCall(`${res.locals.agentGateway}api/claim/nextpendingclaim`, {});
  request(getNextPendingClaim).then((body) => {
    const details = nextClaimObject.formatter(body.claimDetail);
    res.render('pages/next-claim/claim', { details, encodedPdf: body.encodedPdf });
  }).catch((err) => {
    const traceID = requestHelper.getTraceID(err);
    requestHelper.loggingHelper(err, '/api/claim/nextpendingclaim', traceID, res.locals.logger);
    postClaimErrorHandle(err, req, res);
  });
}

function getDownloadPdf(req, res) {
  const { encodedPdf, filename } = req.body;
  const body = Buffer.from(encodedPdf, 'base64');
  convertResponseToPdf(res, body, filename);
}

module.exports.getClaim = getClaim;
module.exports.postClaim = postClaim;
module.exports.getDownloadPdf = getDownloadPdf;
