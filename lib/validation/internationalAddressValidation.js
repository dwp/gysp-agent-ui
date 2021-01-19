const i18n = require('i18next');

const generalHelper = require('../helpers/general');

module.exports = {
  internationalAddressValidation(form) {
    const errors = [];

    for (let i = 1; i < 6; i++) {
      if ((i === 1 || i === 2) && generalHelper.isThisUndefinedOrEmpty(form[`address-line-${i}`])) {
        errors[`address-line-${i}`] = {
          text: i18n.t(`international:fields.addressLine.errors.required-${i}`),
        };
      } else if (form[`address-line-${i}`] && generalHelper.checkIfGreaterThenThirtyFive(form[`address-line-${i}`])) {
        errors[`address-line-${i}`] = {
          text: i18n.t('international:fields.addressLine.errors.length', { number: i }),
        };
      }
    }

    if (generalHelper.isThisUndefinedOrEmpty(form.country)) {
      errors.country = {
        text: i18n.t('international:fields.country.errors.required'),
      };
    }

    return errors;
  },
};
