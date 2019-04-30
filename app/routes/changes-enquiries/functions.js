const request = require('request-promise');
const requestHelper = require('../../../lib/requestHelper');
const keyDetailsHelper = require('../../../lib/keyDetailsHelper');

const changeCircumstancesOverview = require('../../../lib/changeCircumstancesOverview');

const activeGlobalNavigationSection = 'overview';

function getOverview(req, res) {
  if (req.session.searchedNino) {
    const award = requestHelper.generateGetCall(`${res.locals.agentGateway}api/award/${req.session.searchedNino}`, {}, 'batch');
    request(award)
      .then((body) => {
        req.session.awardDetails = body;
        req.session.awardDetails.status = 'RECEIVING STATE PENSION';
        const details = changeCircumstancesOverview.formatter(body);
        const keyDetails = keyDetailsHelper.formatter(req.session.awardDetails);
        res.render('pages/changes-enquiries/overview', { details, keyDetails, activeGlobalNavigationSection });
      }).catch((err) => {
        const traceID = requestHelper.getTraceID(err);
        requestHelper.loggingHelper(err, 'cannot get overview', traceID, res.locals.logger);
        res.render('pages/error', { status: '- Cannot get overview.' });
      });
  } else {
    res.render('pages/error', { status: '- NiNo does not exist in session' });
  }
}

module.exports.getOverview = getOverview;
