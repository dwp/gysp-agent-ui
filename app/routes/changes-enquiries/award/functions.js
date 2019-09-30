const request = require('request-promise');
const requestHelper = require('../../../../lib/requestHelper');
const keyDetailsHelper = require('../../../../lib/keyDetailsHelper');
const secondaryNavigationHelper = require('../../../../lib/helpers/secondaryNavigationHelper');
const dataStore = require('../../../../lib/dataStore');

const awardAmounts = require('../../../../lib/awardAmounts');

const activeSecondaryNavigationSection = 'award';
const secondaryNavigationList = secondaryNavigationHelper.navigationItems(activeSecondaryNavigationSection);

async function getAwardDetails(req, res) {
  try {
    const award = await dataStore.cacheRetriveAndStore(req, null, 'awardDetails', () => {
      const awardCall = requestHelper.generateGetCall(`${res.locals.agentGateway}api/award/${req.session.searchedNino}`, {}, 'batch');
      return request(awardCall);
    });
    const details = awardAmounts.formatter(award);
    const keyDetails = keyDetailsHelper.formatter(award);
    res.render('pages/changes-enquiries/award/index', {
      details,
      keyDetails,
      secondaryNavigationList,
    });
  } catch (err) {
    const traceID = requestHelper.getTraceID(err);
    requestHelper.loggingHelper(err, 'api/award/{NINO}', traceID, res.locals.logger);
    res.render('pages/error', { status: '- Cannot get award details.' });
  }
}

module.exports.getAwardDetails = getAwardDetails;
