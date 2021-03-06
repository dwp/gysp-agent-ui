const moment = require('moment');
const request = require('request-promise');
const dataStore = require('../../../lib/dataStore');
const errorHelper = require('../../../lib/helpers/errorHelper');
const requestHelper = require('../../../lib/requestHelper');
const requestFilterHelper = require('../../../lib/helpers/requestFilterHelper');
const dateHelper = require('../../../lib/dateHelper');
const stringHelper = require('../../../lib/stringHelper');
const maritalStatusHelper = require('../../../lib/helpers/maritalStatusHelper');
const maritalValidation = require('../../../lib/validation/maritalValidation');
const maritalUpdateStatePensionAwardObject = require('../../../lib/objects/view/maritalUpdateStatePensionAwardObject');

const getEntitlementDateApiUri = (entitleDate, claimFromDate, ninoDigits) => `api/award/entitlement-date?entitlementDate=${entitleDate}&claimFromDate=${claimFromDate}&ninoDigits=${ninoDigits}`;
const getValidateNspApiUri = (entitleDate, amount) => `api/paymentcalc/validatensp?entitlement-date=${entitleDate}&amount=${amount}`;

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

function buildEventEntitlementDateApiUri(eventDate, claimFromDate, nino) {
  const eventDateString = eventDate.format('YYYY-MM-DD');
  const claimFromDateString = claimFromDate.format('YYYY-MM-DD');
  const lastTwoNinoDigits = stringHelper.extractNumbers(nino).slice(-2);
  return {
    url: getEntitlementDateApiUri(eventDateString, claimFromDateString, stringHelper.extractNumbers(nino).slice(-2)),
    cacheKey: `${eventDateString}:${claimFromDateString}:${lastTwoNinoDigits}`,
  };
}

function getEntitlementDate(req, res) {
  const { url, cacheKey } = buildEntitlementDateApiUri(req);
  return dataStore.cacheRetrieveAndStore(req, 'marital', cacheKey, () => {
    const awardCall = requestHelper.generateGetCall(res.locals.agentGateway + url, {}, 'award');
    return request(awardCall) || Object.create(null);
  });
}

function getEventEntitlementDate(eventDate, claimDate, nino, cacheSection, req, res) {
  const { url, cacheKey } = buildEventEntitlementDateApiUri(eventDate, claimDate, nino);
  return dataStore.cacheRetrieveAndStore(req, cacheSection, cacheKey, () => {
    const awardCall = requestHelper.generateGetCall(res.locals.agentGateway + url, {}, 'award');
    return request(awardCall) || Object.create(null);
  });
}

function getWidowedEntitlementDate(maritalSession, req, res) {
  const dte = moment(`${maritalSession.date.dateYear}-${maritalSession.date.dateMonth}-${maritalSession.date.dateDay}`);
  const { claimFromDate: cfd, statePensionDate: spd, nino } = dataStore.get(req, 'awardDetails') || Object.create(null);
  const claimFromDate = moment(dateHelper.timestampToDateDash(cfd || spd));
  return getEventEntitlementDate(dte, claimFromDate, nino, 'marital', req, res);
}

async function getUpdateStatePensionAward(req, res, data) {
  const {
    template, backHref, errorRedirect, errors,
  } = data;
  try {
    const { entitlementDate } = await getEntitlementDate(req, res);
    const { awardAmounts } = dataStore.get(req, 'awardDetails') || Object.create(null);
    const maritalSession = dataStore.get(req, 'marital');
    if (maritalStatusHelper.isWidowed(maritalSession.maritalStatus)) {
      const response = await getWidowedEntitlementDate(maritalSession, req, res);
      maritalSession.widowedEntitlementDate = response.entitlementDate;
      dataStore.save(req, 'marital', maritalSession);
    }
    const details = maritalUpdateStatePensionAwardObject.formatter(awardAmounts, entitlementDate, maritalSession);
    res.render('common/marital/update-state-pension-award', {
      template,
      formUrl: req.fullUrl,
      backHref,
      details,
      errors,
    });
  } catch (err) {
    errorHelper.flashErrorAndRedirect(req, res, err, 'award', errorRedirect);
  }
}

async function postUpdateStatePensionAward(req, res, data) {
  const {
    template, backHref, nextRoute, errorRedirect,
  } = data;
  try {
    const maritalSession = dataStore.get(req, 'marital');
    const errors = maritalValidation.updateStatePensionAwardValidator(maritalSession);
    if (Object.keys(errors).length === 0) {
      res.redirect(nextRoute);
    } else {
      await getUpdateStatePensionAward(req, res, {
        template,
        backHref,
        errorRedirect,
        errors,
      });
    }
  } catch (err) {
    errorHelper.flashErrorAndRedirect(req, res, err, 'award', errorRedirect);
  }
}

function getUpdateStatePensionAwardAmount(req, res, data) {
  const { type } = req.params;
  const {
    template, backHref, details, errors,
  } = data;
  const sessionDetails = dataStore.get(req, `update-state-pension-award-${type}`, 'marital');
  const formDetails = sessionDetails || details;
  res.render('common/marital/update-award-amount', {
    template,
    formUrl: req.fullUrl,
    backHref,
    type,
    details: formDetails,
    errors,
  });
}

async function postUpdateStatePensionAwardAmount(req, res, data) {
  const { template, backHref, nextRoute } = data;
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
      res.redirect(nextRoute);
    } else {
      getUpdateStatePensionAwardAmount(req, res, {
        template,
        backHref,
        details,
        errors,
      });
    }
  } catch (err) {
    errorHelper.flashErrorAndRedirect(req, res, err, 'award', req.fullUrl);
  }
}

module.exports = {
  getUpdateStatePensionAward,
  postUpdateStatePensionAward,
  getUpdateStatePensionAwardAmount,
  postUpdateStatePensionAwardAmount,
};
