const request = require('request-promise');
const requestHelper = require('../../../../lib/requestHelper');
const keyDetailsHelper = require('../../../../lib/keyDetailsHelper');
const secondaryNavigationHelper = require('../../../../lib/helpers/secondaryNavigationHelper');
const dataStore = require('../../../../lib/dataStore');

const awardListObject = require('../../../../lib/objects/view/awardListObject');
const awardDetailsObject = require('../../../../lib/objects/view/awardDetailsObject');

const activeSecondaryNavigationSection = 'award';
const secondaryNavigationList = secondaryNavigationHelper.navigationItems(activeSecondaryNavigationSection);

async function getAwardList(req, res) {
  try {
    const award = await dataStore.cacheRetrieveAndStore(req, null, 'awardDetails', () => {
      const awardCall = requestHelper.generateGetCall(`${res.locals.agentGateway}api/award/${req.session.searchedNino}`, {}, 'batch');
      return request(awardCall);
    });
    const details = awardListObject.formatter(award);
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

async function getAwardDetails(req, res) {
  try {
    const award = await dataStore.cacheRetrieveAndStore(req, null, 'awardDetails', () => {
      const awardCall = requestHelper.generateGetCall(`${res.locals.agentGateway}api/award/${req.session.searchedNino}`, {}, 'batch');
      return request(awardCall);
    });
    const { id } = req.params;
    const details = awardDetailsObject.formatter(award, id);
    const keyDetails = keyDetailsHelper.formatter(award);
    res.render('pages/changes-enquiries/award/details', {
      details,
      keyDetails,
    });
  } catch (err) {
    const traceID = requestHelper.getTraceID(err);
    requestHelper.loggingHelper(err, 'api/award/{NINO}', traceID, res.locals.logger);
    res.render('pages/error', { status: '- Cannot get award details.' });
  }
}

module.exports.getAwardList = getAwardList;
module.exports.getAwardDetails = getAwardDetails;
