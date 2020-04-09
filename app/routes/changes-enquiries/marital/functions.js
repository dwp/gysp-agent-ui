const request = require('request-promise');
const i18n = require('i18next');
const requestHelper = require('../../../../lib/requestHelper');
const dataStore = require('../../../../lib/dataStore');
const keyDetailsHelper = require('../../../../lib/keyDetailsHelper');
const generalHelper = require('../../../../lib/helpers/general');
const maritalStatusHelper = require('../../../../lib/helpers/maritalStatusHelper');
const requestFilterHelper = require('../../../../lib/helpers/requestFilterHelper');
const errorHelper = require('../../../../lib/helpers/errorHelper');
const redirectHelper = require('../../../../lib/helpers/redirectHelper');
const formValidator = require('../../../../lib/formValidator');

const maritalDetailsObject = require('../../../../lib/objects/view/maritalDetailsObject');
const maritalDetailsApiObject = require('../../../../lib/objects/api/maritalDetailsObject');

const putMaritalDetailsApiUri = 'api/award/update-marital-details';

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

function getChangeMaritalStatus(req, res) {
  const award = dataStore.get(req, 'awardDetails');
  const keyDetails = keyDetailsHelper.formatter(award);
  const statusDetails = dataStore.get(req, 'maritalStatus', 'marital');
  const newStatusOptions = maritalStatusHelper.newStatusOptions(award.maritalStatus, statusDetails);
  res.render('pages/changes-enquiries/marital/status', {
    keyDetails,
    newStatusOptions,
  });
}

function postChangeMaritalStatus(req, res) {
  const details = req.body;
  const award = dataStore.get(req, 'awardDetails');
  const errors = formValidator.maritalStatus(details, award.maritalStatus);
  if (Object.keys(errors).length === 0) {
    const filteredRequest = requestFilterHelper.requestFilter(requestFilterHelper.maritalStatus(), details);
    dataStore.save(req, 'marital', filteredRequest);
    res.redirect('/changes-and-enquiries/marital-details/date');
  } else {
    const keyDetails = keyDetailsHelper.formatter(award);
    const newStatusOptions = maritalStatusHelper.newStatusOptions(award.maritalStatus, details.maritalStatus);
    res.render('pages/changes-enquiries/marital/status', {
      keyDetails,
      newStatusOptions,
      errors,
    });
  }
}

function getChangeMaritalDate(req, res) {
  const award = dataStore.get(req, 'awardDetails');
  const keyDetails = keyDetailsHelper.formatter(award);
  const maritalStatus = dataStore.get(req, 'maritalStatus', 'marital');
  res.render('pages/changes-enquiries/marital/date', {
    keyDetails,
    maritalStatus,
  });
}

async function postChangeMaritalDate(req, res) {
  const details = req.body;
  const award = dataStore.get(req, 'awardDetails');
  const maritalStatus = dataStore.get(req, 'maritalStatus', 'marital');
  const errors = formValidator.maritalDate(details, maritalStatus);
  if (Object.keys(errors).length === 0) {
    const filteredRequest = requestFilterHelper.requestFilter(requestFilterHelper.maritalDate(), details);
    const maritalDetails = maritalDetailsApiObject.formatter(filteredRequest, maritalStatus, award);
    const putMaritalDetailsCall = requestHelper.generatePutCall(res.locals.agentGateway + putMaritalDetailsApiUri, maritalDetails, 'award', req.user);
    try {
      await request(putMaritalDetailsCall);
      req.flash('success', i18n.t('marital-status:success-message'));
      redirectHelper.redirectAndClearSessionKey(req, res, 'marital', '/changes-and-enquiries/personal');
    } catch (err) {
      errorHelper.flashErrorAndRedirect(req, res, err, 'award', '/changes-and-enquiries/marital-details/date');
    }
  } else {
    const keyDetails = keyDetailsHelper.formatter(award);
    res.render('pages/changes-enquiries/marital/date', {
      keyDetails,
      maritalStatus,
      details,
      errors,
    });
  }
}

function getChangePartnerNino(req, res) {
  const award = dataStore.get(req, 'awardDetails');
  const keyDetails = keyDetailsHelper.formatter(award);
  const maritalStatus = maritalStatusHelper.transformToShortStatus(award.maritalStatus);
  res.render('pages/changes-enquiries/marital/nino', {
    keyDetails,
    maritalStatus,
  });
}

async function postChangePartnerNino(req, res) {
  const details = req.body;
  const award = dataStore.get(req, 'awardDetails');
  const maritalStatus = maritalStatusHelper.transformToShortStatus(award.maritalStatus);
  const errors = formValidator.maritalPartnerNino(details, maritalStatus);
  if (Object.keys(errors).length === 0) {
    const filteredRequest = requestFilterHelper.requestFilter(requestFilterHelper.partnerNino(), details);
    const maritalDetails = maritalDetailsApiObject.partnerDetailFormatter(filteredRequest, maritalStatus, award);
    const putMaritalDetailsCall = requestHelper.generatePutCall(res.locals.agentGateway + putMaritalDetailsApiUri, maritalDetails, 'award', req.user);
    try {
      await request(putMaritalDetailsCall);
      req.flash('success', i18n.t(`marital-detail:${maritalStatus}.fields.nino.success-message`));
      res.redirect('/changes-and-enquiries/personal');
    } catch (err) {
      errorHelper.flashErrorAndRedirect(req, res, err, 'award', '/changes-and-enquiries/marital-details/nino');
    }
  } else {
    const keyDetails = keyDetailsHelper.formatter(award);
    res.render('pages/changes-enquiries/marital/nino', {
      keyDetails,
      maritalStatus,
      details,
      errors,
    });
  }
}

module.exports.getMaritalDetails = getMaritalDetails;
module.exports.getChangeMaritalStatus = getChangeMaritalStatus;
module.exports.postChangeMaritalStatus = postChangeMaritalStatus;
module.exports.getChangeMaritalDate = getChangeMaritalDate;
module.exports.postChangeMaritalDate = postChangeMaritalDate;
module.exports.getChangePartnerNino = getChangePartnerNino;
module.exports.postChangePartnerNino = postChangePartnerNino;
