const i18n = require('i18next');
const { isThisUndefinedOrEmpty, isDateValid, isDateAfterToday } = require('../helpers/general');
const { validStatus } = require('../statusValidator');

module.exports = (postRequest, maritalStatus) => {
  const errors = [];

  if (isThisUndefinedOrEmpty(postRequest.dateDay) && isThisUndefinedOrEmpty(postRequest.dateMonth) && isThisUndefinedOrEmpty(postRequest.dateYear)) {
    errors.date = {
      text: i18n.t(`entitlement-marital-date:fields.${maritalStatus}.date.errors.required`),
    };
    errors.dateDay = true;
    errors.dateMonth = true;
    errors.dateYear = true;
  } else if (isThisUndefinedOrEmpty(postRequest.dateDay) || isThisUndefinedOrEmpty(postRequest.dateMonth) || isThisUndefinedOrEmpty(postRequest.dateYear)) {
    errors.date = {
      text: i18n.t(`entitlement-marital-date:fields.${maritalStatus}.date.errors.incomplete`),
    };
    if (isThisUndefinedOrEmpty(postRequest.dateDay)) {
      errors.dateDay = true;
    }

    if (isThisUndefinedOrEmpty(postRequest.dateMonth)) {
      errors.dateMonth = true;
    }

    if (isThisUndefinedOrEmpty(postRequest.dateYear)) {
      errors.dateYear = true;
    }
  } else if (!isDateValid(postRequest.dateDay, postRequest.dateMonth, postRequest.dateYear)) {
    errors.date = {
      text: i18n.t(`entitlement-marital-date:fields.${maritalStatus}.date.errors.format`),
    };
    if (postRequest.dateDay < 1 || postRequest.dateDay > 31) {
      errors.dateDay = true;
    }
    if (postRequest.dateMonth < 1 || postRequest.dateMonth > 12) {
      errors.dateMonth = true;
    }
    if (postRequest.dateYear.toString().length !== 4) {
      errors.dateYear = true;
    }
  } else if (isDateAfterToday(postRequest.dateDay, postRequest.dateMonth, postRequest.dateYear)) {
    errors.date = {
      text: i18n.t(`entitlement-marital-date:fields.${maritalStatus}.date.errors.future`),
    };
  }

  if (!validStatus(postRequest.verification)) {
    errors.verification = {
      text: i18n.t(`entitlement-marital-date:fields.${maritalStatus}.verification.errors.required`),
    };
  }

  return errors;
};
