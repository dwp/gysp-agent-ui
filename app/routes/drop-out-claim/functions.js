const request = require('request-promise');

const requestHelper = require('../../../lib/requestHelper');
const dropOutClaimObject = require('../../../lib/dropOutClaimDetailsObject');

const goodHTTPstatus = 200;

function convertResponseToPdf(res, body) {
  res.type('application/pdf');
  res.writeHead(goodHTTPstatus, {
    'Content-Disposition': body.headers['content-disposition'].replace('inline;filename', 'attachment;filename'),
    'Content-Length': body.body.length,
  });

  res.end(body.body);
}

function getDropOut(req, res) {
  const claim = requestHelper.generateGetCall(`${res.locals.agentGateway}api/claim/dropout/count`, {});
  request(claim)
    .then((body) => {
      const total = body;
      res.render('pages/claims/drop-out/index', { total });
    }).catch((err) => {
      const traceID = requestHelper.getTraceID(err);
      requestHelper.loggingHelper(err, 'cannot get drop out total', traceID, res.locals.logger);
      res.render('pages/error', { status: '- Issue getting drop out total.' });
    });
}

function getDropOutDetails(req, res) {
  const claim = requestHelper.generateGetCall(`${res.locals.agentGateway}api/claim/dropout/nextclaim`, {});
  request(claim)
    .then((body) => {
      const details = dropOutClaimObject.formatter(body);
      res.render('pages/claims/drop-out/details', { details, returnedStatus: req.returnedStatus });
    }).catch((err) => {
      const traceID = requestHelper.getTraceID(err);
      requestHelper.loggingHelper(err, 'cannot get drop out', traceID, res.locals.logger);
      res.render('pages/error', { status: '- Cannot get drop out.' });
    });
}

function postDropOutClaimDownloadPdf(req, res) {
  const claim = requestHelper.requestClaimPDF(req.body.inviteKey, res.locals.agentGateway, req.user);
  request(claim).then((body) => {
    convertResponseToPdf(res, body);
  }).catch((err) => {
    const traceID = requestHelper.getTraceID(err);
    requestHelper.loggingHelper(err, 'cannot get pdf', traceID, res.locals.logger);
    res.render('pages/error', { status: '- Issue downloading pdf.' });
  });
}

function postDropOutClaimUpdateStatus(req, res) {
  const claim = requestHelper.generateStatusUpdate(req.body.inviteKey, res.locals.agentGateway, req.user, req.body.status);
  request(claim).then(() => {
    res.redirect('/claims/drop-out');
  }).catch((err) => {
    const traceID = requestHelper.getTraceID(err);
    requestHelper.loggingHelper(err, 'cannot update status for', traceID, res.locals.logger);
    req.returnedStatus = { status: 'failed', inviteKey: req.body.inviteKey };
    getDropOutDetails(req, res);
  });
}

module.exports.getDropOut = getDropOut;
module.exports.getDropOutDetails = getDropOutDetails;
module.exports.postDropOutClaimDownloadPdf = postDropOutClaimDownloadPdf;
module.exports.postDropOutClaimUpdateStatus = postDropOutClaimUpdateStatus;
