const request = require('request-promise');
const httpStatus = require('http-status-codes');

const requestHelper = require('../../../lib/requestHelper');
const processClaimObject = require('../../../lib/objects/processClaimDetailsObject');

function getProcessClaimDetail(req, res) {
  const claim = requestHelper.generateGetCall(`${res.locals.agentGateway}api/award/nextaward`, {}, 'award');
  if (req.session.enteramounts !== undefined) {
    delete req.session.enteramounts;
  }

  request(claim)
    .then((claimDetail) => {
      req.session.processClaim = { claimDetail };
      const details = processClaimObject.formatter(claimDetail);
      res.render('pages/process-claim-detail/index', { details });
    }).catch((err) => {
      const traceID = requestHelper.getTraceID(err);
      if (err.statusCode === httpStatus.NOT_FOUND) {
        res.render('pages/process-claim-detail/index');
      } else {
        requestHelper.loggingHelper(err, 'cannot get claim detail', traceID, res.locals.logger);
        res.render('pages/error', { status: '- Issue getting claim detail.' });
      }
    });
}

function getProcessClaimDetailCache(req, res) {
  if (req.session.processClaim && req.session.processClaim.claimDetail) {
    const details = processClaimObject.formatter(req.session.processClaim.claimDetail);
    res.render('pages/process-claim-detail/index', { details });
  } else {
    getProcessClaimDetail(req, res);
  }
}

module.exports.getProcessClaimDetailCache = getProcessClaimDetailCache;
