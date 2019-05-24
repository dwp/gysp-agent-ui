const request = require('request-promise');
const requestHelper = require('../../../../lib/requestHelper');
const keyDetailsHelper = require('../../../../lib/keyDetailsHelper');

const changeCircumstancesOverview = require('../../../../lib/changeCircumstancesOverview');

const activeGlobalNavigationSection = 'personal';

function getPersonalDetails(req, res) {
  const award = requestHelper.generateGetCall(`${res.locals.agentGateway}api/award/${req.session.searchedNino}`, {}, 'batch');
  request(award)
    .then((body) => {
      req.session.awardDetails = body;
      req.session.awardDetails.status = 'RECEIVING STATE PENSION';
      const details = changeCircumstancesOverview.formatter(body);
      const keyDetails = keyDetailsHelper.formatter(req.session.awardDetails);
      res.render('pages/changes-enquiries/personal/index', { details, keyDetails, activeGlobalNavigationSection });
    }).catch((err) => {
      const traceID = requestHelper.getTraceID(err);
      requestHelper.loggingHelper(err, 'api/award/{NINO}', traceID, res.locals.logger);
      res.render('pages/error', { status: '- Cannot get overview.' });
    });
}

module.exports.getPersonalDetails = getPersonalDetails;
