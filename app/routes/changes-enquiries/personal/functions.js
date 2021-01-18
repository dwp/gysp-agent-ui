const request = require('request-promise');

const changeCircumstancesOverview = require('../../../../lib/changeCircumstancesOverview');
const deleteSession = require('../../../../lib/deleteSession');
const keyDetailsHelper = require('../../../../lib/keyDetailsHelper');
const requestHelper = require('../../../../lib/requestHelper');
const secondaryNavigationHelper = require('../../../../lib/helpers/secondaryNavigationHelper');
const timelineHelper = require('../../../../lib/helpers/timelineHelper');

const activeSecondaryNavigationSection = 'personal';

function getPersonalDetails(req, res) {
  deleteSession.deleteChangesEnquiries(req);
  const award = requestHelper.generateGetCall(`${res.locals.agentGateway}api/award/${req.session.searchedNino}`, {}, 'batch');
  request(award)
    .then(async (body) => {
      req.session.awardDetails = body;
      const details = changeCircumstancesOverview.formatter(body);
      const keyDetails = keyDetailsHelper.formatter(body);
      const secondaryNavigationList = secondaryNavigationHelper.navigationItems(activeSecondaryNavigationSection);
      const timelineDetails = await timelineHelper.getTimeline(req, res, 'PERSONAL');
      res.render('pages/changes-enquiries/personal/index', {
        details,
        keyDetails,
        secondaryNavigationList,
        timelineDetails,
      });
    }).catch((err) => {
      const traceID = requestHelper.getTraceID(err);
      requestHelper.loggingHelper(err, 'api/award/{NINO}', traceID, res.locals.logger);
      res.render('pages/error', { status: '- Cannot get personal details.' });
    });
}

module.exports.getPersonalDetails = getPersonalDetails;
