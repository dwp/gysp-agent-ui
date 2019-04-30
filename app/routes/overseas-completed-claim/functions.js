const request = require('request-promise');

const requestHelper = require('../../../lib/requestHelper');
const overseasCompletedClaimObject = require('../../../lib/overseasClaimDetailsObject');

const goodHTTPstatus = 200;

function convertResponseToPdf(res, body) {
  res.type('application/pdf');
  res.writeHead(goodHTTPstatus, {
    'Content-Disposition': body.headers['content-disposition'].replace('inline;filename', 'attachment;filename'),
    'Content-Length': body.body.length,
  });

  res.end(body.body);
}

function getOverseasCompletedClaim(req, res) {
  const claim = requestHelper.generateGetCall(`${res.locals.agentGateway}api/claim/overseas/count`, {});
  request(claim)
    .then((body) => {
      const total = body;
      res.render('pages/claims/overseas/index', { total });
    }).catch((err) => {
      const traceID = requestHelper.getTraceID(err);
      requestHelper.loggingHelper(err, '- Cannot get overseas completed claim total', traceID, res.locals.logger);
      res.render('pages/error', { status: '- Issue getting overseas completed claim total.' });
    });
}

function getOverseasCompletedClaimDetails(req, res) {
  const claim = requestHelper.generateGetCall(`${res.locals.agentGateway}api/claim/nextoverseasclaim`, {});
  request(claim)
    .then((body) => {
      const details = overseasCompletedClaimObject.formatter(body);
      res.render('pages/claims/overseas/completed-claim-details', { details, returnedStatus: req.returnedStatus });
    }).catch((err) => {
      const traceID = requestHelper.getTraceID(err);
      requestHelper.loggingHelper(err, '- Cannot get overseas completed claim', traceID, res.locals.logger);
      res.render('pages/error', { status: '- Cannot get overseas completed claim.' });
    });
}

function postOverseasCompletedClaimDownloadPdf(req, res) {
  const claim = requestHelper.requestClaimPDF(req.body.inviteKey, res.locals.agentGateway, req.user);
  request(claim).then((body) => {
    convertResponseToPdf(res, body);
  }).catch((err) => {
    const traceID = requestHelper.getTraceID(err);
    requestHelper.loggingHelper(err, 'cannot get pdf', traceID, res.locals.logger);
    res.render('pages/error', { status: '- Issue downloading pdf.' });
  });
}

function postOverseasCompletedClaimUpdateStatus(req, res) {
  const claim = requestHelper.generateStatusUpdate(req.body.inviteKey, res.locals.agentGateway, req.user, req.body.status);
  request(claim).then(() => {
    res.redirect('/claims/overseas/completed-claim');
  }).catch((err) => {
    const traceID = requestHelper.getTraceID(err);
    requestHelper.loggingHelper(err, 'cannot update status for', traceID, res.locals.logger);
    req.returnedStatus = { status: 'failed', inviteKey: req.body.inviteKey };
    getOverseasCompletedClaimDetails(req, res);
  });
}

module.exports.getOverseasCompletedClaim = getOverseasCompletedClaim;
module.exports.getOverseasCompletedClaimDetails = getOverseasCompletedClaimDetails;
module.exports.postOverseasCompletedClaimDownloadPdf = postOverseasCompletedClaimDownloadPdf;
module.exports.postOverseasCompletedClaimUpdateStatus = postOverseasCompletedClaimUpdateStatus;
