const i18n = require('i18next');
const generalHelper = require('../helpers/general');

const ninoRegEx = '^(?!BG|GB|NK|KN|TN|NT|ZZ)[A-CEGHJ-PR-TW-Z]{1}[A-CEGHJ-NPR-TW-Z]{1}[0-9]{6}[A-D]{1}$';
const ninoLengthMin = 8;
const ninoLengthMax = 9;

function invalidNino(string) {
  const ninoCheck = new RegExp(ninoRegEx);
  return !ninoCheck.test(string);
}

module.exports = {
  partnerValidator(postRequest, maritalStatus) {
    const errors = [];

    if (!generalHelper.isThisUndefinedOrEmpty(postRequest.partnerNino)) {
      if (postRequest.partnerNino.toString().length < ninoLengthMin || postRequest.partnerNino.toString().length > ninoLengthMax) {
        errors.partnerNino = {
          text: i18n.t('marital-partner:fields.nino.errors.length'),
        };
      } else if (invalidNino(postRequest.partnerNino)) {
        errors.partnerNino = {
          text: i18n.t('marital-partner:fields.nino.errors.invalid'),
        };
      }
    }

    if (generalHelper.isThisUndefinedOrEmpty(postRequest.firstName)) {
      errors.firstName = {
        text: i18n.t(`marital-partner:fields.first-name.errors.required.${maritalStatus}`),
      };
    } else if (!generalHelper.checkSurnameCharacters(postRequest.firstName)) {
      errors.firstName = {
        text: i18n.t('marital-partner:fields.first-name.errors.invalid'),
      };
    } else if (generalHelper.checkIfGreaterThenThirtyFive(postRequest.firstName)) {
      errors.firstName = {
        text: i18n.t('marital-partner:fields.first-name.errors.length'),
      };
    }

    if (generalHelper.isThisUndefinedOrEmpty(postRequest.lastName)) {
      errors.lastName = {
        text: i18n.t(`marital-partner:fields.last-name.errors.required.${maritalStatus}`),
      };
    } else if (!generalHelper.checkSurnameCharacters(postRequest.lastName)) {
      errors.lastName = {
        text: i18n.t('marital-partner:fields.last-name.errors.invalid'),
      };
    } else if (generalHelper.checkIfGreaterThenThirtyFive(postRequest.lastName)) {
      errors.lastName = {
        text: i18n.t('marital-partner:fields.last-name.errors.length'),
      };
    }

    if (!generalHelper.isThisUndefinedOrEmpty(postRequest.otherName)) {
      if (!generalHelper.checkSurnameCharacters(postRequest.otherName)) {
        errors.otherName = {
          text: i18n.t('marital-partner:fields.other-name.errors.invalid'),
        };
      } else if (generalHelper.checkIfGreaterThenThirtyFive(postRequest.otherName)) {
        errors.otherName = {
          text: i18n.t('marital-partner:fields.other-name.errors.length'),
        };
      }
    }

    if (!generalHelper.isThisUndefinedOrEmpty(postRequest.dobDay) || !generalHelper.isThisUndefinedOrEmpty(postRequest.dobMonth) || !generalHelper.isThisUndefinedOrEmpty(postRequest.dobYear)) {
      if (!generalHelper.isDateValid(postRequest.dobDay, postRequest.dobMonth, postRequest.dobYear)) {
        if (!generalHelper.isDateDayValid(postRequest.dobDay)) {
          errors.dobDay = true;
        }
        if (!generalHelper.isDateMonthValid(postRequest.dobMonth)) {
          errors.dobMonth = true;
        }
        if (!generalHelper.isDateYearValid(postRequest.dobYear)) {
          errors.dobYear = true;
        }
        errors.dob = {
          text: i18n.t('marital-partner:fields.dob.errors.invalid'),
        };
      } else if (generalHelper.isDateAfterToday(postRequest.dobDay, postRequest.dobMonth, postRequest.dobYear)) {
        errors.dob = {
          text: i18n.t('marital-partner:fields.dob.errors.future'),
        };
      }
    }

    return errors;
  },
};
