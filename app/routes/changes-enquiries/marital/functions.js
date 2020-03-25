const request = require('request-promise');
const requestHelper = require('../../../../lib/requestHelper');
const dataStore = require('../../../../lib/dataStore');
const keyDetailsHelper = require('../../../../lib/keyDetailsHelper');
const generalHelper = require('../../../../lib/helpers/general');

const maritalDetailsObject = require('../../../../lib/objects/view/maritalDetailsObject');

async function awardDetails(req, res) {
  const detail = await dataStore.cacheRetriveAndStore(req, undefined, 'awardDetails', () => {
    const awardCall = requestHelper.generateGetCall(`${res.locals.agentGateway}api/award/${req.session.searchedNino}`, {}, 'batch');
    return request(awardCall);
  });
  return detail;
}

async function getMaritalDetails(req, res) {
  try {
    const award = await awardDetails(req, res);
    const keyDetails = keyDetailsHelper.formatter(award);
    const maritalDetails = maritalDetailsObject.formatter(award);
    res.render('pages/changes-enquiries/marital/index', {
      keyDetails,
      maritalDetails,
    });
  } catch (err) {
    const traceID = requestHelper.getTraceID(err);
    requestHelper.loggingHelper(err, 'api/award/{NINO}', traceID, res.locals.logger);
    const message = generalHelper.globalErrorMessage(err, 'award');
    res.render('pages/error', { status: `- ${message}` });
  }
}

module.exports.getMaritalDetails = getMaritalDetails;
