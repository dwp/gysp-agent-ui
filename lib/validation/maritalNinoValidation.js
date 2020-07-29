const i18n = require('i18next');
const { isThisUndefinedOrEmpty } = require('../helpers/general');

const ninoRegEx = '^(?!BG|GB|NK|KN|TN|NT|ZZ)[A-CEGHJ-PR-TW-Z]{1}[A-CEGHJ-NPR-TW-Z]{1}[0-9]{6}[A-D]{1}$';
const ninoLengthMin = 8;
const ninoLengthMax = 9;

function invalidNino(string) {
  const ninoCheck = new RegExp(ninoRegEx);
  return !ninoCheck.test(string);
}

module.exports = (postRequest, maritalStatus) => {
  const errors = [];
  if (isThisUndefinedOrEmpty(postRequest.partnerNino)) {
    errors.partnerNino = {
      text: i18n.t(`entitlement-partner-nino:fields.${maritalStatus}.partnerNino.errors.required`),
    };
  } else if (postRequest.partnerNino.toString().length < ninoLengthMin || postRequest.partnerNino.toString().length > ninoLengthMax) {
    errors.partnerNino = {
      text: i18n.t(`entitlement-partner-nino:fields.${maritalStatus}.partnerNino.errors.length`),
    };
  } else if (invalidNino(postRequest.partnerNino)) {
    errors.partnerNino = {
      text: i18n.t(`entitlement-partner-nino:fields.${maritalStatus}.partnerNino.errors.format`),
    };
  }

  return errors;
};
