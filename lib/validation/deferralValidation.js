const i18n = require('i18next');
const generalHelper = require('../helpers/general');

const yearLength = 4;

const dateValidation = (prefix, form, future = true) => {
  const errors = {};

  const requiredError = () => {
    errors.date = {
      text: i18n.t(`${prefix}:fields.date.errors.required`),
    };
    errors.day = true;
    errors.month = true;
    errors.year = true;
  };

  if (form === undefined) {
    requiredError();
  } else {
    const { day } = form;
    const { month } = form;
    const { year } = form;

    const dayIsUndefinedOrEmpty = generalHelper.isThisUndefinedOrEmpty(day);
    const monthIsUndefinedOrEmpty = generalHelper.isThisUndefinedOrEmpty(month);
    const yearIsUndefinedOrEmpty = generalHelper.isThisUndefinedOrEmpty(year);


    if (dayIsUndefinedOrEmpty && monthIsUndefinedOrEmpty && yearIsUndefinedOrEmpty) {
      requiredError();
    } else if (!generalHelper.isDateValid(day, month, year)) {
      errors.date = {
        text: i18n.t(`${prefix}:fields.date.errors.invalid`),
      };

      if (day < 1 || (day > generalHelper.daysInMonth(month, year))) {
        errors.day = true;
      }
      if (month < 1 || month > 12) {
        errors.month = true;
      }
      if (year.toString().length !== yearLength) {
        errors.year = true;
      }
    } else if (future && generalHelper.isDateAfterToday(day, month, year)) {
      errors.date = {
        text: i18n.t(`${prefix}:fields.date.errors.future`),
      };
    }
  }
  return errors;
};

module.exports = {
  dateRequestReceived(form) {
    return dateValidation('deferral-date-request-received', form);
  },
  defaultDate(form) {
    const errors = {};
    if (form === undefined || generalHelper.isThisUndefinedOrEmpty(form['default-date']) || !generalHelper.checkIfYesOrNo(form['default-date'])) {
      errors['default-date'] = {
        text: i18n.t('deferral-default-date:fields.defaultDate.errors.required'),
      };
    }
    return errors;
  },
  fromDate(form) {
    return dateValidation('deferral-from-date', form, false);
  },
};
