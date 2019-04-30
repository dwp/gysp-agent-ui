const i18n = require('i18next');

i18n.init({
  sendMissingTo: 'fallback',
});

const validClaimTypes = '^(?:claims|letters|claiminformation|citizeninformation|hmrcfeed|filterreason)$';
const validClaimOrCitizenTypes = '^(?:claiminformation|citizeninformation|filterreason)$';

function validClaimType(string) {
  const claimType = new RegExp(validClaimTypes);
  if (claimType.test(string)) {
    return false;
  }
  return true;
}

function validClaimOrCitizenType(string) {
  const claimType = new RegExp(validClaimOrCitizenTypes);
  if (claimType.test(string)) {
    return true;
  }
  return false;
}

module.exports = {
  isValidClaimType(claimType) {
    let error;
    if (validClaimType(claimType)) {
      error = i18n.t('claim-information:errors.generic.required');
    }
    return error;
  },
  isValidClaimOrCitizenType(claimType) {
    if (validClaimOrCitizenType(claimType)) {
      return true;
    }
    return false;
  },
};
