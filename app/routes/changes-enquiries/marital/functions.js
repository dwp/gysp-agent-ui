const request = require('request-promise');
const i18n = require('i18next');
const requestHelper = require('../../../../lib/requestHelper');
const dataStore = require('../../../../lib/dataStore');
const generalHelper = require('../../../../lib/helpers/general');
const dateHelper = require('../../../../lib/dateHelper');
const stringHelper = require('../../../../lib/stringHelper');
const maritalStatusHelper = require('../../../../lib/helpers/maritalStatusHelper');
const requestFilterHelper = require('../../../../lib/helpers/requestFilterHelper');
const errorHelper = require('../../../../lib/helpers/errorHelper');
const redirectHelper = require('../../../../lib/helpers/redirectHelper');
const formValidator = require('../../../../lib/formValidator');
const maritalValidation = require('../../../../lib/validation/maritalValidation');

// View objects
const maritalDetailsObject = require('../../../../lib/objects/view/maritalDetailsObject');
const maritalStatePensionEntitlementObject = require('../../../../lib/objects/view/maritalStatePensionEntitlementObject');
const maritalUpdateStatePensionAwardObject = require('../../../../lib/objects/view/maritalUpdateStatePensionAwardObject');

// API objects
const maritalDetailsApiObject = require('../../../../lib/objects/api/maritalDetailsObject');
const maritalWidowDetailsApiObject = require('../../../../lib/objects/api/maritalWidowDetailsObject');

// Api endpoints
const putMaritalDetailsApiUri = 'api/award/update-marital-details';
const putMaritalWidowDetailsApiUri = 'api/award/update-widow-details';
const getEntitlementDateApiUri = (entitleDate, claimFromDate, ninoDigits) => `api/award/entitlement-date?entitlementDate=${entitleDate}&claimFromDate=${claimFromDate}&ninoDigits=${ninoDigits}`;
const getValidateNspApiUri = (entitleDate, amount) => `api/paymentcalc/validatensp?entitlement-date=${entitleDate}&amount=${amount}`;

async function awardDetails(req, res) {
  const detail = await dataStore.cacheRetrieveAndStore(req, undefined, 'awardDetails', () => {
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
  const button = maritalStatusHelper.maritalDateButton(newMaritalStatus, res.locals.widowInheritanceFeature);
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

function saveSessionAndRedirectInheritableStatePension(req, res, filteredRequest) {
  dataStore.save(req, 'date', filteredRequest, 'marital');
  res.redirect('/changes-and-enquiries/marital-details/check-for-inheritable-state-pension');
}

function saveCheckInheritableStatePensionAndRedirect(req, res, filteredRequest) {
  dataStore.checkSessionAndSave(req, 'marital', 'check-for-inheritable-state-pension', filteredRequest);
  if (filteredRequest.checkInheritableStatePension === 'yes') {
    res.redirect('/changes-and-enquiries/marital-details/consider-state-pension-entitlement');
  } else {
    res.redirect('/changes-and-enquiries/marital-details/save-and-create-task');
  }
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

function saveWidowDetails(req, res, award, maritalFormDetails) {
  const maritalDetails = maritalWidowDetailsApiObject.formatter(maritalFormDetails, award);
  const putMaritalDetailsCall = requestHelper.generatePutCall(res.locals.agentGateway + putMaritalWidowDetailsApiUri, maritalDetails, 'award', req.user);
  return request(putMaritalDetailsCall);
}

async function saveDateWithInheritableCheckAndRedirect(req, res, award, maritalShortStatus) {
  const maritalFormDetails = dataStore.get(req, 'marital');
  const { maritalStatus: currentMaritalStatus } = award;
  const { date: { verification } } = maritalFormDetails;
  await saveWidowDetails(req, res, award, maritalFormDetails);
  req.flash('success', maritalStatusHelper.maritalDateSuccessAlert(currentMaritalStatus, maritalShortStatus, verification));
  redirectHelper.redirectAndClearSessionKey(req, res, 'marital', '/changes-and-enquiries/personal');
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
    } else if (res.locals.widowInheritanceFeature && maritalStatusHelper.isWidowed(newMaritalShortStatus)) {
      saveSessionAndRedirectInheritableStatePension(req, res, filteredRequest);
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
  const dob = award.partnerDetail.dob ? dateHelper.epochDateToComponents(award.partnerDetail.dob) : { day: '', month: '', year: '' };
  const maritalStatus = maritalStatusHelper.transformToShortStatus(award.maritalStatus);
  res.render('pages/changes-enquiries/marital/dob', {
    details: {
      dobDay: dob.day,
      dobMonth: dob.month,
      dobYear: dob.year,
    },
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
    formUrl: req.fullUrl,
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
      errorHelper.flashErrorAndRedirect(req, res, err, 'award', req.fullUrl);
    }
  } else {
    res.render('pages/changes-enquiries/marital/partner', {
      formUrl: res.fullUrl,
      maritalStatus: maritalData.maritalStatus,
      details,
      errors,
    });
  }
}

function getCheckForInheritableStatePension(req, res) {
  const details = dataStore.get(req, 'check-for-inheritable-state-pension', 'marital');
  res.render('pages/changes-enquiries/marital/check-for-inheritable-state-pension', {
    formUrl: req.fullUrl,
    backHref: '/marital-details/date',
    details,
  });
}

async function postCheckForInheritableStatePension(req, res) {
  const details = req.body;
  const errors = maritalValidation.checkForInheritableStatePensionValidator(details);
  if (Object.keys(errors).length === 0) {
    const filteredRequest = requestFilterHelper.requestFilter(requestFilterHelper.maritalCheckInheritableStatePension(), details);
    saveCheckInheritableStatePensionAndRedirect(req, res, filteredRequest);
  } else {
    res.render('pages/changes-enquiries/marital/check-for-inheritable-state-pension', {
      formUrl: req.fullUrl,
      backHref: '/marital-details/date',
      details,
      errors,
    });
  }
}

function getConsiderStatePensionEntitlement(req, res) {
  const award = dataStore.get(req, 'awardDetails');
  const details = maritalStatePensionEntitlementObject.formatter(award);
  res.render('pages/changes-enquiries/marital/state-pension-entitlement', {
    nextPageHref: '/marital-details/entitled-to-any-inherited-state-pension',
    backHref: '/marital-details/check-for-inheritable-state-pension',
    details,
  });
}

function getEntitledToInheritedStatePension(req, res) {
  const details = dataStore.get(req, 'entitled-to-inherited-state-pension', 'marital');
  res.render('pages/changes-enquiries/marital/entitled-to-inherited-state-pension', {
    formUrl: req.fullUrl,
    backHref: '/marital-details/consider-state-pension-entitlement',
    details,
  });
}

async function postEntitledToInheritedStatePension(req, res) {
  const details = req.body;
  const errors = maritalValidation.entitledToInheritedStatePensionValidator(details);
  if (Object.keys(errors).length === 0) {
    const filteredRequest = requestFilterHelper.requestFilter(requestFilterHelper.maritalEntitledToInheritedStatePension(), details);
    dataStore.checkSessionAndSave(req, 'marital', 'entitled-to-inherited-state-pension', filteredRequest);
    if (filteredRequest.entitledInheritableStatePension === 'yes') {
      res.redirect('/changes-and-enquiries/marital-details/relevant-inherited-amounts');
    } else {
      res.redirect('/changes-and-enquiries/marital-details/send-letter');
    }
  } else {
    res.render('pages/changes-enquiries/marital/entitled-to-inherited-state-pension', {
      formUrl: req.fullUrl,
      backHref: '/marital-details/consider-state-pension-entitlement',
      details,
      errors,
    });
  }
}

function getRelevantInheritedAmounts(req, res) {
  const details = dataStore.get(req, 'relevant-inherited-amounts', 'marital');
  res.render('pages/changes-enquiries/marital/relevant-inherited-amounts', {
    formUrl: req.fullUrl,
    backHref: '/marital-details/entitled-to-any-inherited-state-pension',
    details,
  });
}

async function postRelevantInheritedAmounts(req, res) {
  const details = req.body;
  const errors = maritalValidation.relevantInheritedAmountsValidator(details);
  if (Object.keys(errors).length === 0) {
    const filteredRequest = requestFilterHelper.requestFilter(requestFilterHelper.maritalRelevantInheritedAmounts(), details);
    dataStore.save(req, 'relevant-inherited-amounts', filteredRequest, 'marital');
    res.redirect('/changes-and-enquiries/marital-details/update-state-pension-award');
  } else {
    res.render('pages/changes-enquiries/marital/relevant-inherited-amounts', {
      formUrl: req.fullUrl,
      backHref: '/marital-details/entitled-to-any-inherited-state-pension',
      details,
      errors,
    });
  }
}

function buildEntitlementDateApiUri(req) {
  const { claimFromDate: cfd, statePensionDate: spd, nino } = dataStore.get(req, 'awardDetails') || Object.create(null);
  const { dateYear, dateMonth, dateDay } = dataStore.get(req, 'date', 'marital') || Object.create(null);
  const claimFromDate = dateHelper.timestampToDateDash(cfd || spd);
  const entitlementDate = dateHelper.dateDash(`${dateYear}-${dateMonth}-${dateDay}`);
  const lastTwoNinoDigits = stringHelper.extractNumbers(nino).slice(-2);
  return {
    url: getEntitlementDateApiUri(entitlementDate, claimFromDate, lastTwoNinoDigits),
    cacheKey: `${entitlementDate}:${claimFromDate}:${lastTwoNinoDigits}`,
  };
}

function getEntitlementDate(req, res) {
  const { url, cacheKey } = buildEntitlementDateApiUri(req);
  return dataStore.cacheRetrieveAndStore(req, 'marital', cacheKey, () => {
    const awardCall = requestHelper.generateGetCall(res.locals.agentGateway + url, {}, 'award');
    return request(awardCall) || Object.create(null);
  });
}

async function getUpdateStatePensionAward(req, res) {
  try {
    const { entitlementDate } = await getEntitlementDate(req, res);
    const { awardAmounts } = dataStore.get(req, 'awardDetails') || Object.create(null);
    const maritalSession = dataStore.get(req, 'marital');
    const details = maritalUpdateStatePensionAwardObject.formatter(awardAmounts, entitlementDate, maritalSession);
    res.render('pages/changes-enquiries/marital/update-state-pension-award', {
      formUrl: req.fullUrl,
      backHref: '/marital-details/relevant-inherited-amounts',
      details,
    });
  } catch (err) {
    errorHelper.flashErrorAndRedirect(req, res, err, 'award', '/changes-and-enquiries/marital-details/relevant-inherited-amounts');
  }
}

async function postUpdateStatePensionAward(req, res) {
  try {
    const maritalSession = dataStore.get(req, 'marital');
    const errors = maritalValidation.updateStatePensionAwardValidator(maritalSession);
    if (Object.keys(errors).length === 0) {
      res.redirect('/changes-and-enquiries/marital-details/update-and-send-letter');
    } else {
      const { entitlementDate } = await getEntitlementDate(req, res);
      const { awardAmounts } = dataStore.get(req, 'awardDetails') || Object.create(null);
      const details = maritalUpdateStatePensionAwardObject.formatter(awardAmounts, entitlementDate, maritalSession);
      res.render('pages/changes-enquiries/marital/update-state-pension-award', {
        formUrl: req.fullUrl,
        backHref: '/marital-details/relevant-inherited-amounts',
        details,
        errors,
      });
    }
  } catch (err) {
    errorHelper.flashErrorAndRedirect(req, res, err, 'award', '/changes-and-enquiries/marital-details/relevant-inherited-amounts');
  }
}

function getSaveMaritalDetails(req, res) {
  res.render('pages/changes-enquiries/marital/save-and-create-task', {
    formUrl: req.fullUrl,
    backHref: '/marital-details/check-for-inheritable-state-pension',
  });
}

async function postSaveMaritalDetails(req, res) {
  const award = dataStore.get(req, 'awardDetails');
  const newMaritalShortStatus = dataStore.get(req, 'maritalStatus', 'marital');
  try {
    const maritalShortStatus = maritalStatusHelper.currentOrNewShortStatus(award.maritalStatus, newMaritalShortStatus);
    await saveDateWithInheritableCheckAndRedirect(req, res, award, maritalShortStatus);
  } catch (err) {
    errorHelper.flashErrorAndRedirect(req, res, err, 'award', req.fullUrl);
  }
}

function getUpdateStatePensionAwardAmount(req, res) {
  const { type } = req.params;
  const details = dataStore.get(req, `update-state-pension-award-${type}`, 'marital');
  res.render('pages/changes-enquiries/marital/update-award-amount', {
    formUrl: req.fullUrl,
    backHref: '/marital-details/update-state-pension-award',
    type,
    details,
  });
}

async function postUpdateStatePensionAwardAmount(req, res) {
  try {
    const { type } = req.params;
    const details = req.body;
    const errors = await maritalValidation.updateStatePensionAwardAmountValidator(details, type, (amount) => {
      const { cacheKey } = buildEntitlementDateApiUri(req);
      const { entitlementDate: epoch } = dataStore.get(req, cacheKey, 'marital');
      const entitlementDate = dateHelper.timestampToDateDash(epoch);
      const getValidate = requestHelper.generateGetCall(res.locals.agentGateway + getValidateNspApiUri(entitlementDate, amount), {}, 'payment');
      return request(getValidate);
    });
    if (Object.keys(errors).length === 0) {
      const filteredRequest = requestFilterHelper.requestFilter(requestFilterHelper.maritalUpdateStatePensionAwardAmount(), details);
      dataStore.save(req, `update-state-pension-award-${type}`, filteredRequest, 'marital');
      res.redirect('/changes-and-enquiries/marital-details/update-state-pension-award');
    } else {
      res.render('pages/changes-enquiries/marital/update-award-amount', {
        formUrl: req.fullUrl,
        backHref: '/marital-details/update-state-pension-award',
        type,
        details,
        errors,
      });
    }
  } catch (err) {
    errorHelper.flashErrorAndRedirect(req, res, err, 'award', req.fullUrl);
  }
}

function getUpdateAndSendLetter(req, res) {
  res.render('pages/changes-enquiries/marital/update-and-send-letter', {
    formUrl: req.fullUrl,
    backHref: '/marital-details/update-state-pension-award',
  });
}

async function saveUpdateAwardAndRedirect(req, res, award, suffix) {
  const maritalFormDetails = dataStore.get(req, 'marital');
  const { maritalStatus: currentMaritalStatus } = award;
  const { date: { verification }, maritalStatus: newMaritalStatus } = maritalFormDetails;
  await saveWidowDetails(req, res, award, maritalFormDetails);
  const maritalShortStatus = maritalStatusHelper.currentOrNewShortStatus(currentMaritalStatus, newMaritalStatus);
  req.flash('success', maritalStatusHelper.maritalDateSuccessAlert(currentMaritalStatus, maritalShortStatus, verification, suffix));
  redirectHelper.redirectAndClearSessionKey(req, res, 'marital', '/changes-and-enquiries/personal');
}

async function postUpdateAndSendLetter(req, res) {
  const award = dataStore.get(req, 'awardDetails');
  try {
    await saveUpdateAwardAndRedirect(req, res, award, '-award-updated');
  } catch (err) {
    errorHelper.flashErrorAndRedirect(req, res, err, 'award', req.fullUrl);
  }
}

function getSendLetter(req, res) {
  res.render('pages/changes-enquiries/marital/send-letter', {
    formUrl: req.fullUrl,
    backHref: '/marital-details/entitled-to-any-inherited-state-pension',
  });
}

async function postSendLetter(req, res) {
  const award = dataStore.get(req, 'awardDetails');
  try {
    await saveUpdateAwardAndRedirect(req, res, award, '-no-change-to-award');
  } catch (err) {
    errorHelper.flashErrorAndRedirect(req, res, err, 'award', req.fullUrl);
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
module.exports.getCheckForInheritableStatePension = getCheckForInheritableStatePension;
module.exports.postCheckForInheritableStatePension = postCheckForInheritableStatePension;
module.exports.getSaveMaritalDetails = getSaveMaritalDetails;
module.exports.postSaveMaritalDetails = postSaveMaritalDetails;
module.exports.getConsiderStatePensionEntitlement = getConsiderStatePensionEntitlement;
module.exports.getEntitledToInheritedStatePension = getEntitledToInheritedStatePension;
module.exports.postEntitledToInheritedStatePension = postEntitledToInheritedStatePension;
module.exports.getSendLetter = getSendLetter;
module.exports.postSendLetter = postSendLetter;
module.exports.getRelevantInheritedAmounts = getRelevantInheritedAmounts;
module.exports.postRelevantInheritedAmounts = postRelevantInheritedAmounts;
module.exports.getUpdateStatePensionAward = getUpdateStatePensionAward;
module.exports.postUpdateStatePensionAward = postUpdateStatePensionAward;
module.exports.getUpdateStatePensionAwardAmount = getUpdateStatePensionAwardAmount;
module.exports.postUpdateStatePensionAwardAmount = postUpdateStatePensionAwardAmount;
module.exports.getUpdateAndSendLetter = getUpdateAndSendLetter;
module.exports.postUpdateAndSendLetter = postUpdateAndSendLetter;
