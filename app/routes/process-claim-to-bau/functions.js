const request = require('request-promise');
const httpStatus = require('http-status-codes');

const requestHelper = require('../../../lib/requestHelper');
const bauObject = require('../../../lib/objects/bauObject');

function getAllClaimsToBau(req, res) {
  const claim = requestHelper.generatePutCall(`${res.locals.agentGateway}api/award/sendallbacktorobot`, {}, 'award');
  request(claim)
    .then(() => {
      res.redirect('/process-claim');
    }).catch((err) => {
      if (err.statusCode === httpStatus.NOT_FOUND) {
        req.flash('error', 'There are no claims to send to BAU');
        res.redirect('/process-claim');
      } else {
        const traceID = requestHelper.getTraceID(err);
        requestHelper.loggingHelper(err, 'cannot send all available claims to BAU', traceID, res.locals.logger);
        res.render('pages/error', { status: '- Issue sending all available claims to BAU.' });
      }
    });
}

function getClaimToBau(req, res) {
  if (req.session.processClaim && req.session.processClaim.claimDetail && req.session.processClaim.claimDetail.inviteKey) {
    const bauDetails = bauObject.formatter(req.session.processClaim.claimDetail);
    const claim = requestHelper.generatePutCall(`${res.locals.agentGateway}api/award/sendbacktorobot`, bauDetails, 'award');
    request(claim)
      .then(() => {
        res.redirect('/process-claim');
      }).catch((err) => {
        if (err.statusCode === httpStatus.NOT_FOUND) {
          req.flash('error', 'There is no claim to send to BAU');
          res.redirect('/process-claim');
        } else {
          const traceID = requestHelper.getTraceID(err);
          requestHelper.loggingHelper(err, 'cannot send claim to BAU', traceID, res.locals.logger);
          res.render('pages/error', { status: '- Issue sending claim to BAU.' });
        }
      });
  } else {
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    res.render('pages/error', { status: '- Issue sending claim to BAU.' });
  }
}

module.exports.getAllClaimsToBau = getAllClaimsToBau;
module.exports.getClaimToBau = getClaimToBau;
