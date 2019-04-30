const request = require('request-promise');
const requestHelper = require('../../../lib/requestHelper');
const deleteSession = require('../../../lib/deleteSession');

function getProcessClaim(req, res) {
  deleteSession.deleteProcessClaim(req);
  const claim = requestHelper.generateGetCall(`${res.locals.agentGateway}api/award/count/daily-awards`, {}, 'award');
  request(claim)
    .then((body) => {
      const total = body;
      res.render('pages/process-claim/index', { total });
    }).catch((err) => {
      const traceID = requestHelper.getTraceID(err);
      requestHelper.loggingHelper(err, 'cannot get process claim total', traceID, res.locals.logger);
      res.render('pages/error', { status: '- Issue getting claim total.' });
    });
}

module.exports.getProcessClaim = getProcessClaim;
