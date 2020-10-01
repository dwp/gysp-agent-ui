const i18n = require('i18next');
const generalHelper = require('../helpers/general');

const yearLength = 4;

function daysInMonth(month, year) {
  switch (parseInt(month, 10)) {
  case 2:
    return (!year % 4 && year % 100) || !year % 400 ? 29 : 28;
  case 4: case 6: case 9: case 11:
    return 30;
  default:
    return 31;
  }
}

module.exports = {
  dateRequestReceived(form) {
    const errors = {};

    const requiredError = () => {
      errors.date = {
        text: i18n.t('deferral-date-request-received:fields.date.errors.required'),
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
          text: i18n.t('deferral-date-request-received:fields.date.errors.invalid'),
        };

        if (day < 1 || (day > daysInMonth(month, year))) {
          errors.day = true;
        }
        if (month < 1 || month > 12) {
          errors.month = true;
        }
        if (year.toString().length !== yearLength) {
          errors.year = true;
        }
      } else if (generalHelper.isDateAfterToday(day, month, year)) {
        errors.date = {
          text: i18n.t('deferral-date-request-received:fields.date.errors.future'),
        };
      }
    }
    return errors;
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
};