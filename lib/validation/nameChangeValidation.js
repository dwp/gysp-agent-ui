const i18n = require('i18next');

const generalHelper = require('../helpers/general');

module.exports = {
  nameChangeValidation(form) {
    const errors = [];

    if (generalHelper.isThisUndefinedOrEmpty(form.firstName) && generalHelper.isThisUndefinedOrEmpty(form.lastName)) {
      errors.both = {
        text: i18n.t('name-change:fields.both.errors.required'),
      };
    }

    if (!generalHelper.isThisUndefinedOrEmpty(form.firstName)) {
      if (!generalHelper.checkFirstNameCharacters(form.firstName)) {
        errors.firstName = {
          text: i18n.t('name-change:fields.firstName.errors.format'),
        };
      } else if (generalHelper.checkIfGreaterThenSeventy(form.firstName)) {
        errors.firstName = {
          text: i18n.t('name-change:fields.firstName.errors.length'),
        };
      }
    }

    if (!generalHelper.isThisUndefinedOrEmpty(form.lastName)) {
      if (!generalHelper.checkLastNameCharacters(form.lastName)) {
        errors.lastName = {
          text: i18n.t('name-change:fields.lastName.errors.format'),
        };
      } else if (generalHelper.checkIfGreaterThenSeventy(form.lastName)) {
        errors.lastName = {
          text: i18n.t('name-change:fields.lastName.errors.length'),
        };
      }
    }

    return errors;
  },
};
