const request = require('request-promise');
const i18n = require('i18next');
const requestHelper = require('../../../../lib/requestHelper');
const dataStore = require('../../../../lib/dataStore');
const generalHelper = require('../../../../lib/helpers/general');
const dateHelper = require('../../../../lib/dateHelper');
const maritalStatusHelper = require('../../../../lib/helpers/maritalStatusHelper');
const requestFilterHelper = require('../../../../lib/helpers/requestFilterHelper');
const errorHelper = require('../../../../lib/helpers/errorHelper');
const redirectHelper = require('../../../../lib/helpers/redirectHelper');
const formValidator = require('../../../../lib/formValidator');
const maritalValidation = require('../../../../lib/validation/maritalValidation');

// View objects
const maritalDetailsObject = require('../../../../lib/objects/view/maritalDetailsObject');
const maritalStatePensionEntitlementObject = require('../../../../lib/objects/view/maritalStatePensionEntitlementObject');

// API objects
const maritalDetailsApiObject = require('../../../../lib/objects/api/maritalDetailsObject');
const maritalWidowDetailsApiObject = require('../../../../lib/objects/api/maritalWidowDetailsObject');

// Api endpoints
const putMaritalDetailsApiUri = 'api/award/update-marital-details';
const putMaritalWidowDetailsApiUri = 'api/award/update-widow-details';

// Common
const entitledToInheritedStatePension = require('../../../common/marital/entitledToInheritedStatePension');
const relevantInheritedAmounts = require('../../../common/marital/relevantInheritedAmounts');
const updateStatePensionAward = require('../../../common/marital/updateStatePensionAward');

const template = 'pages/changes-enquiries/layout.html';

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
    redirectHelper.clearSessionKeyAndRedirect(req, res, 'marital', '/changes-and-enquiries/personal');
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
  redirectHelper.clearSessionKeyAndRedirect(req, res, 'marital', '/changes-and-enquiries/personal');
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

function getChangeName(name) {
  return function handler(req, res) {
    const award = dataStore.get(req, 'awardDetails');
    const maritalStatus = maritalStatusHelper.transformToShortStatus(award.maritalStatus);
    res.render('pages/changes-enquiries/marital/name', {
      backHref: '/marital-details',
      maritalStatus,
      name,
    });
  };
}

async function changeMaritalDetails(award, field, filteredRequest, maritalStatus, redirect, req, res) {
  const maritalDetails = maritalDetailsApiObject.partnerDetailByItemFormatter(filteredRequest, maritalStatus, award);
  const putMaritalDetailsCall = requestHelper.generatePutCall(res.locals.agentGateway + putMaritalDetailsApiUri, maritalDetails, 'award', req.user);
  try {
    await request(putMaritalDetailsCall);
    req.flash('success', i18n.t(`marital-detail:${maritalStatus}.fields.${field}.success-message`));
    res.redirect('/changes-and-enquiries/personal');
  } catch (err) {
    errorHelper.flashErrorAndRedirect(req, res, err, 'award', `/changes-and-enquiries/marital-details/${redirect}`);
  }
}

function postChangeName(name) {
  return async function handler(req, res) {
    const details = req.body;
    const award = dataStore.get(req, 'awardDetails');
    const maritalStatus = maritalStatusHelper.transformToShortStatus(award.maritalStatus);
    const errors = maritalValidation.nameValidator(details[name], maritalStatus, name);
    if (Object.keys(errors).length === 0) {
      const filteredRequest = requestFilterHelper.name(details[name], name);
      await changeMaritalDetails(award, name, filteredRequest, maritalStatus, name, req, res);
    } else {
      res.render('pages/changes-enquiries/marital/name', {
        backHref: '/marital-details',
        details,
        errors,
        maritalStatus,
        name,
      });
    }
  };
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
    await changeMaritalDetails(award, 'dob', filteredRequest, maritalStatus, 'date-of-birth', req, res);
  } else {
    res.render('pages/changes-enquiries/marital/dob', {
      maritalStatus,
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
  const errors = maritalValidation.maritalPartnerNino(details, maritalStatus);
  if (Object.keys(errors).length === 0) {
    const filteredRequest = requestFilterHelper.requestFilter(requestFilterHelper.partnerNino(), details);
    await changeMaritalDetails(award, 'nino', filteredRequest, maritalStatus, 'nino', req, res);
  } else {
    res.render('pages/changes-enquiries/marital/nino', {
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
      redirectHelper.clearSessionKeyAndRedirect(req, res, 'marital', '/changes-and-enquiries/personal');
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
  entitledToInheritedStatePension.getEntitledToInheritedStatePension(req, res, {
    template,
    backHref: '/marital-details/consider-state-pension-entitlement',
  });
}

function postEntitledToInheritedStatePension(req, res) {
  entitledToInheritedStatePension.postEntitledToInheritedStatePension(req, res, {
    template,
    backHref: '/marital-details/consider-state-pension-entitlement',
    nextRouteYes: '/changes-and-enquiries/marital-details/relevant-inherited-amounts',
    nextRouteNo: '/changes-and-enquiries/marital-details/send-letter',
  });
}

function getRelevantInheritedAmounts(req, res) {
  relevantInheritedAmounts.getRelevantInheritedAmounts(req, res, {
    template,
    backHref: '/marital-details/entitled-to-any-inherited-state-pension',
  });
}

function postRelevantInheritedAmounts(req, res) {
  relevantInheritedAmounts.postRelevantInheritedAmounts(req, res, {
    template,
    backHref: '/marital-details/entitled-to-any-inherited-state-pension',
    nextRoute: '/changes-and-enquiries/marital-details/update-state-pension-award',
  });
}

async function getUpdateStatePensionAward(req, res) {
  await updateStatePensionAward.getUpdateStatePensionAward(req, res, {
    template,
    backHref: '/marital-details/relevant-inherited-amounts',
    errorRedirect: '/changes-and-enquiries/marital-details/relevant-inherited-amounts',
  });
}

async function postUpdateStatePensionAward(req, res) {
  await updateStatePensionAward.postUpdateStatePensionAward(req, res, {
    template,
    backHref: '/marital-details/relevant-inherited-amounts',
    nextRoute: '/changes-and-enquiries/marital-details/update-and-send-letter',
    errorRedirect: '/changes-and-enquiries/marital-details/relevant-inherited-amounts',
  });
}

function getUpdateStatePensionAwardAmount(req, res) {
  updateStatePensionAward.getUpdateStatePensionAwardAmount(req, res, {
    template,
    backHref: '/marital-details/update-state-pension-award',
  });
}

async function postUpdateStatePensionAwardAmount(req, res) {
  await updateStatePensionAward.postUpdateStatePensionAwardAmount(req, res, {
    template,
    backHref: '/marital-details/update-state-pension-award',
    nextRoute: '/changes-and-enquiries/marital-details/update-state-pension-award',
  });
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
  redirectHelper.clearSessionKeyAndRedirect(req, res, 'marital', '/changes-and-enquiries/personal');
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

module.exports = {
  getMaritalDetails,
  getChangeMaritalStatus,
  postChangeMaritalStatus,
  getChangeMaritalDate,
  postChangeMaritalDate,
  getChangeName,
  postChangeName,
  getPartnerDateOfBirth,
  postPartnerDateOfBirth,
  getChangePartnerNino,
  postChangePartnerNino,
  getPartnerDetails,
  postPartnerDetails,
  getCheckForInheritableStatePension,
  postCheckForInheritableStatePension,
  getSaveMaritalDetails,
  postSaveMaritalDetails,
  getConsiderStatePensionEntitlement,
  getEntitledToInheritedStatePension,
  postEntitledToInheritedStatePension,
  getSendLetter,
  postSendLetter,
  getRelevantInheritedAmounts,
  postRelevantInheritedAmounts,
  getUpdateStatePensionAward,
  postUpdateStatePensionAward,
  getUpdateStatePensionAwardAmount,
  postUpdateStatePensionAwardAmount,
  getUpdateAndSendLetter,
  postUpdateAndSendLetter,
};
