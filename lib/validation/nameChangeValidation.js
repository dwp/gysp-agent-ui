const i18n = require('i18next');

const generalHelper = require('../helpers/general');

module.exports = {
  nameChangeValidation(form) {
    const errors = [];

    if (generalHelper.isThisUndefinedOrEmpty(form.firstName)) {
      errors.firstName = {
        text: i18n.t('name-change:fields.firstName.errors.required'),
      };
    } else if (!generalHelper.checkNameCharacters(form.firstName)) {
      errors.firstName = {
        text: i18n.t('name-change:fields.firstName.errors.format'),
      };
    } else if (generalHelper.checkIfGreaterThenThirtyFive(form.firstName)) {
      errors.firstName = {
        text: i18n.t('name-change:fields.firstName.errors.length'),
      };
    }

    if (generalHelper.isThisUndefinedOrEmpty(form.lastName)) {
      errors.lastName = {
        text: i18n.t('name-change:fields.lastName.errors.required'),
      };
    } else if (!generalHelper.checkNameCharacters(form.lastName)) {
      errors.lastName = {
        text: i18n.t('name-change:fields.lastName.errors.format'),
      };
    } else if (generalHelper.checkIfGreaterThenThirtyFive(form.lastName)) {
      errors.lastName = {
        text: i18n.t('name-change:fields.lastName.errors.length'),
      };
    }

    return errors;
  },
};
