const i18n = require('i18next');
const generalHelper = require('../helpers/general');

module.exports = {
  stopStatePension(form) {
    const errors = {};
    if (form === undefined || generalHelper.isThisUndefinedOrEmpty(form.reason) || (form.reason !== 'death' && form.reason !== 'deferral')) {
      errors.reason = {
        text: i18n.t('stop-state-pension:fields.reason.errors.required'),
      };
    }
    return errors;
  },
};
