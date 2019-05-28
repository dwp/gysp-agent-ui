const request = require('request-promise');
const requestHelper = require('../../../../lib/requestHelper');
const keyDetailsHelper = require('../../../../lib/keyDetailsHelper');
const secondaryNavigationHelper = require('../../../../lib/helpers/secondaryNavigationHelper');

const changeCircumstancesOverview = require('../../../../lib/changeCircumstancesOverview');

const activeSecondaryNavigationSection = 'personal';
const secondaryNavigationList = secondaryNavigationHelper.navigationItems(activeSecondaryNavigationSection);

function getPersonalDetails(req, res) {
  const award = requestHelper.generateGetCall(`${res.locals.agentGateway}api/award/${req.session.searchedNino}`, {}, 'batch');
  request(award)
    .then((body) => {
      req.session.awardDetails = body;
      req.session.awardDetails.status = 'RECEIVING STATE PENSION';
      const details = changeCircumstancesOverview.formatter(body);
      const keyDetails = keyDetailsHelper.formatter(req.session.awardDetails);
      res.render('pages/changes-enquiries/personal/index', { details, keyDetails, secondaryNavigationList });
    }).catch((err) => {
      const traceID = requestHelper.getTraceID(err);
      requestHelper.loggingHelper(err, 'api/award/{NINO}', traceID, res.locals.logger);
      res.render('pages/error', { status: '- Cannot get personal details.' });
    });
}

module.exports.getPersonalDetails = getPersonalDetails;
