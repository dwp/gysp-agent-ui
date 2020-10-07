const i18n = require('i18next');
const generalHelper = require('../../helpers/general');

module.exports = (form) => {
  const errors = {};
  if (form === undefined || generalHelper.isThisUndefinedOrEmpty(form.canVerify) || !generalHelper.checkIfYesOrNo(form.canVerify)) {
    errors.canVerify = {
      text: i18n.t('death-can-verify-date:fields.can-verify.errors.required'),
    };
  }
  return errors;
};
