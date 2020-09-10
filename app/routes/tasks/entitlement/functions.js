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

async function awardDetails(req, res) {
  const { inviteKey } = dataStore.get(req, 'work-item', 'tasks');
  const detail = await dataStore.cacheRetrieveAndStore(req, 'tasks', 'awardDetails', () => {
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

async function postPartnerNino(req, res) {
  const details = req.body;
  const { maritalStatus: status } = dataStore.get(req, 'awardDetails', 'tasks');
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

async function postDateOfBirth(req, res) {
  const details = req.body;
  const { maritalStatus: status } = dataStore.get(req, 'awardDetails', 'tasks');
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

async function postMaritalDate(req, res) {
  const details = req.body;
  const { maritalStatus: status } = dataStore.get(req, 'awardDetails', 'tasks');
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

module.exports = {
  getPartnerNino,
  postPartnerNino,
  getDateOfBirth,
  postDateOfBirth,
  getMaritalDate,
  postMaritalDate,
};
