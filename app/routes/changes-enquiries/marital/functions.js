const request = require('request-promise');
const i18n = require('i18next');
const requestHelper = require('../../../../lib/requestHelper');
const dataStore = require('../../../../lib/dataStore');
const generalHelper = require('../../../../lib/helpers/general');
const maritalStatusHelper = require('../../../../lib/helpers/maritalStatusHelper');
const requestFilterHelper = require('../../../../lib/helpers/requestFilterHelper');
const errorHelper = require('../../../../lib/helpers/errorHelper');
const redirectHelper = require('../../../../lib/helpers/redirectHelper');
const formValidator = require('../../../../lib/formValidator');
const maritalValidation = require('../../../../lib/validation/maritalValidation');

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
    const maritalDetails = maritalDetailsObject.formatter(award);
    res.render('pages/changes-enquiries/marital/index', {
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
  const statusDetails = dataStore.get(req, 'maritalStatus', 'marital');
  const newStatusOptions = maritalStatusHelper.newStatusOptions(award.maritalStatus, statusDetails);
  const backHref = maritalStatusHelper.maritalStatusBackHref(award.maritalStatus);
  res.render('pages/changes-enquiries/marital/status', {
    newStatusOptions,
    backHref,
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
    const newStatusOptions = maritalStatusHelper.newStatusOptions(award.maritalStatus, details.maritalStatus);
    res.render('pages/changes-enquiries/marital/status', {
      newStatusOptions,
      errors,
    });
  }
}

function getChangeMaritalDate(req, res) {
  const award = dataStore.get(req, 'awardDetails');
  const newMaritalStatus = dataStore.get(req, 'maritalStatus', 'marital');
  const maritalStatus = maritalStatusHelper.currentOrNewShortStatus(award.maritalStatus, newMaritalStatus);
  const details = dataStore.get(req, 'date', 'marital');
  const backHref = maritalStatusHelper.maritalDateBackHref(newMaritalStatus);
  const button = maritalStatusHelper.maritalDateButton(newMaritalStatus);
  res.render('pages/changes-enquiries/marital/date', {
    maritalStatus,
    details,
    backHref,
    button,
  });
}

function saveSessionAndRedirectToPartnerDetails(req, res, filteredRequest, maritalShortStatus) {
  const redirectUrl = maritalStatusHelper.redirectUrlBasedOnStatusPartner(maritalShortStatus);
  dataStore.save(req, 'date', filteredRequest, 'marital');
  res.redirect(`/changes-and-enquiries/marital-details/${redirectUrl}`);
}

async function saveDateAndRedirect(req, res, award, filteredRequest, maritalShortStatus) {
  const maritalDetails = maritalDetailsApiObject.formatter(filteredRequest, maritalShortStatus, award);
  const putMaritalDetailsCall = requestHelper.generatePutCall(res.locals.agentGateway + putMaritalDetailsApiUri, maritalDetails, 'award', req.user);
  const currentMaritalStatus = award.maritalStatus;
  const { verification } = filteredRequest;
  try {
    await request(putMaritalDetailsCall);
    req.flash('success', maritalStatusHelper.maritalDateSuccessAlert(currentMaritalStatus, maritalShortStatus, verification));
    redirectHelper.redirectAndClearSessionKey(req, res, 'marital', '/changes-and-enquiries/personal');
  } catch (err) {
    errorHelper.flashErrorAndRedirect(req, res, err, 'award', '/changes-and-enquiries/marital-details/date');
  }
}

async function postChangeMaritalDate(req, res) {
  const details = req.body;
  const award = dataStore.get(req, 'awardDetails');
  const newMaritalShortStatus = dataStore.get(req, 'maritalStatus', 'marital');
  const maritalShortStatus = maritalStatusHelper.currentOrNewShortStatus(award.maritalStatus, newMaritalShortStatus);
  const errors = formValidator.maritalDate(details, maritalShortStatus);
  if (Object.keys(errors).length === 0) {
    const filteredRequest = requestFilterHelper.requestFilter(requestFilterHelper.maritalDate(), details);
    if (maritalStatusHelper.newMaritalStatusRequiresPartnerDetails(newMaritalShortStatus)) {
      saveSessionAndRedirectToPartnerDetails(req, res, filteredRequest, newMaritalShortStatus);
    } else {
      await saveDateAndRedirect(req, res, award, filteredRequest, maritalShortStatus);
    }
  } else {
    const backHref = maritalStatusHelper.maritalDateBackHref(newMaritalShortStatus);
    const button = maritalStatusHelper.maritalDateButton(newMaritalShortStatus);
    res.render('pages/changes-enquiries/marital/date', {
      maritalStatus: maritalShortStatus,
      backHref,
      button,
      details,
      errors,
    });
  }
}

function getChangePartnerNino(req, res) {
  const award = dataStore.get(req, 'awardDetails');
  const maritalStatus = maritalStatusHelper.transformToShortStatus(award.maritalStatus);
  res.render('pages/changes-enquiries/marital/nino', {
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
    const maritalDetails = maritalDetailsApiObject.partnerDetailByItemFormatter(filteredRequest, maritalStatus, award);
    const putMaritalDetailsCall = requestHelper.generatePutCall(res.locals.agentGateway + putMaritalDetailsApiUri, maritalDetails, 'award', req.user);
    try {
      await request(putMaritalDetailsCall);
      req.flash('success', i18n.t(`marital-detail:${maritalStatus}.fields.nino.success-message`));
      res.redirect('/changes-and-enquiries/personal');
    } catch (err) {
      errorHelper.flashErrorAndRedirect(req, res, err, 'award', '/changes-and-enquiries/marital-details/nino');
    }
  } else {
    res.render('pages/changes-enquiries/marital/nino', {
      maritalStatus,
      details,
      errors,
    });
  }
}

function getPartnerDateOfBirth(req, res) {
  const award = dataStore.get(req, 'awardDetails');
  const maritalStatus = maritalStatusHelper.transformToShortStatus(award.maritalStatus);
  res.render('pages/changes-enquiries/marital/dob', {
    maritalStatus,
  });
}

async function postPartnerDateOfBirth(req, res) {
  const details = req.body;
  const award = dataStore.get(req, 'awardDetails');
  const maritalStatus = maritalStatusHelper.transformToShortStatus(award.maritalStatus);
  const errors = maritalValidation.partnerDobValidator(details, maritalStatus);
  if (Object.keys(errors).length === 0) {
    const filteredRequest = requestFilterHelper.requestFilter(requestFilterHelper.partnerDob(), details);
    const maritalDetails = maritalDetailsApiObject.partnerDetailByItemFormatter(filteredRequest, maritalStatus, award);
    const putMaritalDetailsCall = requestHelper.generatePutCall(res.locals.agentGateway + putMaritalDetailsApiUri, maritalDetails, 'award', req.user);
    try {
      await request(putMaritalDetailsCall);
      req.flash('success', i18n.t(`marital-detail:${maritalStatus}.fields.dob.success-message`));
      res.redirect('/changes-and-enquiries/personal');
    } catch (err) {
      errorHelper.flashErrorAndRedirect(req, res, err, 'award', '/changes-and-enquiries/marital-details/date-of-birth');
    }
  } else {
    res.render('pages/changes-enquiries/marital/dob', {
      maritalStatus,
      details,
      errors,
    });
  }
}

function getPartnerDetails(req, res) {
  const newMaritalShortStatus = dataStore.get(req, 'maritalStatus', 'marital');
  const maritalStatus = maritalStatusHelper.transformToShortStatus(newMaritalShortStatus);
  res.render('pages/changes-enquiries/marital/partner', {
    formUrl: req.originalUrl,
    maritalStatus,
  });
}

async function postPartnerDetails(req, res) {
  const details = req.body;
  const award = dataStore.get(req, 'awardDetails');
  const maritalData = dataStore.get(req, 'marital');
  const errors = maritalValidation.partnerValidator(details, maritalData.maritalStatus);
  if (Object.keys(errors).length === 0) {
    const filteredRequest = requestFilterHelper.requestFilter(requestFilterHelper.maritalPartner(), details);
    const maritalDetails = maritalDetailsApiObject.partnerDetailFormatter(filteredRequest, maritalData, award);
    const putMaritalDetailsCall = requestHelper.generatePutCall(res.locals.agentGateway + putMaritalDetailsApiUri, maritalDetails, 'award', req.user);
    try {
      await request(putMaritalDetailsCall);
      req.flash('success', i18n.t('marital-status:success-message'));
      redirectHelper.redirectAndClearSessionKey(req, res, 'marital', '/changes-and-enquiries/personal');
    } catch (err) {
      errorHelper.flashErrorAndRedirect(req, res, err, 'award', req.originalUrl);
    }
  } else {
    res.render('pages/changes-enquiries/marital/partner', {
      formUrl: req.originalUrl,
      maritalStatus: maritalData.maritalStatus,
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
module.exports.getPartnerDateOfBirth = getPartnerDateOfBirth;
module.exports.postPartnerDateOfBirth = postPartnerDateOfBirth;
module.exports.getPartnerDetails = getPartnerDetails;
module.exports.postPartnerDetails = postPartnerDetails;
