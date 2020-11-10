const request = require('request-promise');

const requestHelper = require('../../../../lib/requestHelper');
const errorHelper = require('../../../../lib/helpers/errorHelper');
const requestFilterHelper = require('../../../../lib/helpers/requestFilterHelper');
const { transformToShortStatus, maritalDateToComponents } = require('../../../../lib/helpers/maritalStatusHelper');
const { dateComponents } = require('../../../../lib/dateHelper');

const maritalNinoValidation = require('../../../../lib/validation/maritalNinoValidation');
const dateOfBirthValidation = require('../../../../lib/validation/dateOfBirthValidation');
const maritalDateValidation = require('../../../../lib/validation/maritalDateValidation');

const dataStore = require('../../../../lib/dataStore');

const getAwardByInviteKeyEndPoint = 'api/award/award-by-invite-key';

const entitledToInheritedStatePension = require('../../../common/marital/entitledToInheritedStatePension');
const relevantInheritedAmounts = require('../../../common/marital/relevantInheritedAmounts');
const updateStatePensionAward = require('../../../common/marital/updateStatePensionAward');

const template = 'pages/tasks/layout.html';

async function awardDetails(req, res) {
  const { inviteKey } = dataStore.get(req, 'work-item', 'tasks');
  const detail = await dataStore.cacheRetrieveAndStore(req, null, 'awardDetails', () => {
    const awardCall = requestHelper.generateGetCall(`${res.locals.agentGateway}${getAwardByInviteKeyEndPoint}/${inviteKey}`, {}, 'award');
    return request(awardCall);
  });
  return detail;
}

async function getPartnerNino(req, res) {
  try {
    const { maritalStatus } = await awardDetails(req, res);
    res.render('pages/tasks/entitlement/nino', {
      maritalStatus: transformToShortStatus(maritalStatus),
    });
  } catch (err) {
    errorHelper.flashErrorAndRedirect(req, res, err, 'award', '/tasks/task');
  }
}

function postPartnerNino(req, res) {
  const details = req.body;
  const { maritalStatus: status } = dataStore.get(req, 'awardDetails');
  const maritalStatus = transformToShortStatus(status);
  const errors = maritalNinoValidation(details, maritalStatus);
  if (Object.keys(errors).length === 0) {
    const filteredRequest = requestFilterHelper.requestFilter(requestFilterHelper.partnerNino(), details);
    dataStore.save(req, 'partner-nino', filteredRequest, 'updated-entitlement-details');
    res.redirect('/tasks/task/detail');
  } else {
    res.render('pages/tasks/entitlement/nino', {
      maritalStatus,
      details,
      errors,
    });
  }
}

async function getDateOfBirth(req, res) {
  try {
    const { maritalStatus, partnerDetail: { dob } } = await awardDetails(req, res);
    const dateOfBirth = dataStore.get(req, 'date-of-birth', 'updated-entitlement-details');
    const currentDateOfBirth = dob ? dateComponents(dob, null) : null;
    res.render('pages/tasks/entitlement/date-of-birth', {
      maritalStatus: transformToShortStatus(maritalStatus),
      details: dateOfBirth || currentDateOfBirth,
    });
  } catch (err) {
    errorHelper.flashErrorAndRedirect(req, res, err, 'award', '/tasks/task');
  }
}

function postDateOfBirth(req, res) {
  const details = req.body;
  const { maritalStatus: status } = dataStore.get(req, 'awardDetails');
  const maritalStatus = transformToShortStatus(status);
  const errors = dateOfBirthValidation(details, maritalStatus);
  if (Object.keys(errors).length === 0) {
    const filteredRequest = requestFilterHelper.requestFilter(requestFilterHelper.dateOfBirthVerification(), details);
    dataStore.save(req, 'date-of-birth', filteredRequest, 'updated-entitlement-details');
    res.redirect('/tasks/task/detail');
  } else {
    res.render('pages/tasks/entitlement/date-of-birth', {
      maritalStatus,
      details,
      errors,
    });
  }
}

async function getMaritalDate(req, res) {
  try {
    const { maritalStatus, partnerDetail } = await awardDetails(req, res);
    const maritalDate = dataStore.get(req, 'marital-date', 'updated-entitlement-details');
    res.render('pages/tasks/entitlement/marital-date', {
      maritalStatus: transformToShortStatus(maritalStatus),
      details: maritalDate || maritalDateToComponents(partnerDetail, maritalStatus),
    });
  } catch (err) {
    errorHelper.flashErrorAndRedirect(req, res, err, 'award', '/tasks/task');
  }
}

function postMaritalDate(req, res) {
  const details = req.body;
  const { maritalStatus: status } = dataStore.get(req, 'awardDetails');
  const maritalStatus = transformToShortStatus(status);
  const errors = maritalDateValidation(details, maritalStatus);
  if (Object.keys(errors).length === 0) {
    const filteredRequest = requestFilterHelper.requestFilter(requestFilterHelper.maritalDateVerification(), details);
    dataStore.save(req, 'marital-date', filteredRequest, 'updated-entitlement-details');
    res.redirect('/tasks/task/detail');
  } else {
    res.render('pages/tasks/entitlement/marital-date', {
      maritalStatus,
      details,
      errors,
    });
  }
}

function getEntitledToInheritedStatePension(req, res) {
  entitledToInheritedStatePension.getEntitledToInheritedStatePension(req, res, {
    template,
    backHref: '/task/detail',
  });
}

function postEntitledToInheritedStatePension(req, res) {
  entitledToInheritedStatePension.postEntitledToInheritedStatePension(req, res, {
    template,
    backHref: '/task/detail',
    nextRouteYes: '/tasks/task/consider-entitlement/relevant-inherited-amounts',
    nextRouteNo: '/tasks/task/complete',
  });
}

function getRelevantInheritedAmounts(req, res) {
  relevantInheritedAmounts.getRelevantInheritedAmounts(req, res, {
    template,
    backHref: '/task/consider-entitlement/entitled-to-any-inherited-state-pension',
  });
}

function postRelevantInheritedAmounts(req, res) {
  relevantInheritedAmounts.postRelevantInheritedAmounts(req, res, {
    template,
    backHref: '/task/consider-entitlement/entitled-to-any-inherited-state-pension',
    nextRoute: '/tasks/task/consider-entitlement/update-state-pension-award',
  });
}

async function getUpdateStatePensionAward(req, res) {
  await updateStatePensionAward.getUpdateStatePensionAward(req, res, {
    template,
    backHref: '/task/consider-entitlement/relevant-inherited-amounts',
    errorRedirect: '/tasks/task/consider-entitlement/relevant-inherited-amounts',
  });
}

async function postUpdateStatePensionAward(req, res) {
  await updateStatePensionAward.postUpdateStatePensionAward(req, res, {
    template,
    backHref: '/task/consider-entitlement/relevant-inherited-amounts',
    nextRoute: '/tasks/task/complete',
    errorRedirect: '/tasks/task/consider-entitlement/relevant-inherited-amounts',
  });
}

function getUpdateStatePensionAwardAmount(req, res) {
  updateStatePensionAward.getUpdateStatePensionAwardAmount(req, res, {
    template,
    backHref: '/task/consider-entitlement/update-state-pension-award',
  });
}

async function postUpdateStatePensionAwardAmount(req, res) {
  await updateStatePensionAward.postUpdateStatePensionAwardAmount(req, res, {
    template,
    backHref: '/task/consider-entitlement/update-state-pension-award',
    nextRoute: '/tasks/task/consider-entitlement/update-state-pension-award',
  });
}

module.exports = {
  getPartnerNino,
  postPartnerNino,
  getDateOfBirth,
  postDateOfBirth,
  getMaritalDate,
  postMaritalDate,
  getEntitledToInheritedStatePension,
  postEntitledToInheritedStatePension,
  getRelevantInheritedAmounts,
  postRelevantInheritedAmounts,
  getUpdateStatePensionAward,
  postUpdateStatePensionAward,
  getUpdateStatePensionAwardAmount,
  postUpdateStatePensionAwardAmount,
};
