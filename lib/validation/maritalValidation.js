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
  nameValidator(formField, maritalStatus, name) {
    const errors = [];

    if (!generalHelper.isNotUndefinedEmptyOrNull(formField)) {
      errors[name] = {
        text: i18n.t(`marital-detail:${maritalStatus}.fields.${name}.errors.required`),
      };
    } else if ((name === 'first-name' && !generalHelper.checkFirstNameCharacters(formField))
    || (name === 'last-name' && !generalHelper.checkLastNameCharacters(formField))) {
      errors[name] = {
        text: i18n.t(`marital-detail:${maritalStatus}.fields.${name}.errors.format`),
      };
    } else if (generalHelper.checkIfGreaterThenThirtyFive(formField)) {
      errors[name] = {
        text: i18n.t(`marital-detail:${maritalStatus}.fields.${name}.errors.length`),
      };
    }

    return errors;
  },
  partnerDobValidator(postRequest, maritalStatus) {
    const errors = [];

    if (generalHelper.isThisUndefinedOrEmpty(postRequest.dobDay) || generalHelper.isThisUndefinedOrEmpty(postRequest.dobMonth) || generalHelper.isThisUndefinedOrEmpty(postRequest.dobYear)) {
      if (generalHelper.isThisUndefinedOrEmpty(postRequest.dobDay)) {
        errors.dobDay = true;
      }
      if (generalHelper.isThisUndefinedOrEmpty(postRequest.dobMonth)) {
        errors.dobMonth = true;
      }
      if (generalHelper.isThisUndefinedOrEmpty(postRequest.dobYear)) {
        errors.dobYear = true;
      }
      errors.dob = {
        text: i18n.t(`marital-detail:${maritalStatus}.fields.dob.errors.required`),
      };
    } else if (!generalHelper.isDateValid(postRequest.dobDay, postRequest.dobMonth, postRequest.dobYear)) {
      if (!generalHelper.isDateDayValid(postRequest.dobDay, postRequest.dobMonth, postRequest.dobYear)) {
        errors.dobDay = true;
      }
      if (!generalHelper.isDateMonthValid(postRequest.dobMonth)) {
        errors.dobMonth = true;
      }
      if (!generalHelper.isDateYearValid(postRequest.dobYear)) {
        errors.dobYear = true;
      }
      errors.dob = {
        text: i18n.t(`marital-detail:${maritalStatus}.fields.dob.errors.format`),
      };
    } else if (generalHelper.isDateAfterToday(postRequest.dobDay, postRequest.dobMonth, postRequest.dobYear)) {
      errors.dob = {
        text: i18n.t(`marital-detail:${maritalStatus}.fields.dob.errors.future`),
      };
    }

    if (generalHelper.isThisUndefinedOrEmpty(postRequest.dobVerified) || (postRequest.dobVerified !== 'V' && postRequest.dobVerified !== 'NV')) {
      errors.dobVerified = true;
      errors.dobVerified = {
        text: i18n.t(`marital-detail:${maritalStatus}.fields.dobVerified.errors.required`),
      };
    }

    return errors;
  },
  maritalPartnerNino(postRequest, maritalStatus) {
    const errors = [];
    if (postRequest.partnerNino !== undefined && postRequest.partnerNino !== '') {
      if (postRequest.partnerNino.toString().length < ninoLengthMin || postRequest.partnerNino.toString().length > ninoLengthMax) {
        errors.partnerNino = {
          text: i18n.t(`marital-detail:${maritalStatus}.fields.nino.errors.length`),
        };
      } else if (invalidNino(postRequest.partnerNino)) {
        errors.partnerNino = {
          text: i18n.t(`marital-detail:${maritalStatus}.fields.nino.errors.invalid`),
        };
      }
    } else {
      errors.partnerNino = {
        text: i18n.t(`marital-detail:${maritalStatus}.fields.nino.errors.invalid`),
      };
    }
    return errors;
  },
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
    } else if (!generalHelper.checkNameCharacters(postRequest.firstName)) {
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
    } else if (!generalHelper.checkNameCharacters(postRequest.lastName)) {
      errors.lastName = {
        text: i18n.t('marital-partner:fields.last-name.errors.invalid'),
      };
    } else if (generalHelper.checkIfGreaterThenThirtyFive(postRequest.lastName)) {
      errors.lastName = {
        text: i18n.t('marital-partner:fields.last-name.errors.length'),
      };
    }

    if (!generalHelper.isThisUndefinedOrEmpty(postRequest.otherName)) {
      if (!generalHelper.checkNameCharacters(postRequest.otherName)) {
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
        if (!generalHelper.isDateDayValid(postRequest.dobDay, postRequest.dobMonth, postRequest.dobYear)) {
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
  checkForInheritableStatePensionValidator(postRequest) {
    const errors = [];
    if (generalHelper.isThisUndefinedOrEmpty(postRequest.checkInheritableStatePension) || !generalHelper.checkIfYesOrNo(postRequest.checkInheritableStatePension)) {
      errors.checkInheritableStatePension = {
        text: i18n.t('marital-check-for-inheritable-state-pension:fields.checkInheritableStatePension.errors.required'),
      };
    }
    return errors;
  },
  entitledToInheritedStatePensionValidator(postRequest) {
    const errors = [];
    if (generalHelper.isThisUndefinedOrEmpty(postRequest.entitledInheritableStatePension) || !generalHelper.checkIfYesOrNo(postRequest.entitledInheritableStatePension)) {
      errors.entitledInheritableStatePension = {
        text: i18n.t('marital-entitled-to-inherited-state-pension:fields.entitledInheritableStatePension.errors.required'),
      };
    }
    return errors;
  },
  relevantInheritedAmountsValidator(postRequest) {
    const errors = [];
    const inputs = Object.keys(postRequest).filter((key) => !generalHelper.isThisUndefinedOrEmpty(postRequest[key])).length > 0 || false;
    if (!inputs) {
      errors.inputs = {
        text: i18n.t('marital-relevant-inherited-amounts:fields.inputs.errors.required'),
      };
    }
    if (!generalHelper.isThisUndefinedOrEmpty(postRequest.additionalPension)) {
      if (!generalHelper.isValidCurrency(postRequest.additionalPension)) {
        errors.additionalPension = {
          text: i18n.t('marital-relevant-inherited-amounts:fields.additionalPension.errors.format'),
        };
      } else if (generalHelper.isGreaterThenFiveCharacterExcludingPoint(postRequest.additionalPension)) {
        errors.additionalPension = {
          text: i18n.t('marital-relevant-inherited-amounts:fields.additionalPension.errors.length'),
        };
      }
    }
    if (!generalHelper.isThisUndefinedOrEmpty(postRequest.graduatedBenefit)) {
      if (!generalHelper.isValidCurrency(postRequest.graduatedBenefit)) {
        errors.graduatedBenefit = {
          text: i18n.t('marital-relevant-inherited-amounts:fields.graduatedBenefit.errors.format'),
        };
      } else if (generalHelper.isGreaterThenFiveCharacterExcludingPoint(postRequest.graduatedBenefit)) {
        errors.graduatedBenefit = {
          text: i18n.t('marital-relevant-inherited-amounts:fields.graduatedBenefit.errors.length'),
        };
      }
    }
    if (!generalHelper.isThisUndefinedOrEmpty(postRequest.basicExtraStatePension)) {
      if (!generalHelper.isValidCurrency(postRequest.basicExtraStatePension)) {
        errors.basicExtraStatePension = {
          text: i18n.t('marital-relevant-inherited-amounts:fields.basicExtraStatePension.errors.format'),
        };
      } else if (generalHelper.isGreaterThenFiveCharacterExcludingPoint(postRequest.basicExtraStatePension)) {
        errors.basicExtraStatePension = {
          text: i18n.t('marital-relevant-inherited-amounts:fields.basicExtraStatePension.errors.length'),
        };
      }
    }
    if (!generalHelper.isThisUndefinedOrEmpty(postRequest.additionalExtraStatePension)) {
      if (!generalHelper.isValidCurrency(postRequest.additionalExtraStatePension)) {
        errors.additionalExtraStatePension = {
          text: i18n.t('marital-relevant-inherited-amounts:fields.additionalExtraStatePension.errors.format'),
        };
      } else if (generalHelper.isGreaterThenFiveCharacterExcludingPoint(postRequest.additionalExtraStatePension)) {
        errors.additionalExtraStatePension = {
          text: i18n.t('marital-relevant-inherited-amounts:fields.additionalExtraStatePension.errors.length'),
        };
      }
    }
    if (!generalHelper.isThisUndefinedOrEmpty(postRequest.graduatedBenefitExtraStatePension)) {
      if (!generalHelper.isValidCurrency(postRequest.graduatedBenefitExtraStatePension)) {
        errors.graduatedBenefitExtraStatePension = {
          text: i18n.t('marital-relevant-inherited-amounts:fields.graduatedBenefitExtraStatePension.errors.format'),
        };
      } else if (generalHelper.isGreaterThenFiveCharacterExcludingPoint(postRequest.graduatedBenefitExtraStatePension)) {
        errors.graduatedBenefitExtraStatePension = {
          text: i18n.t('marital-relevant-inherited-amounts:fields.graduatedBenefitExtraStatePension.errors.length'),
        };
      }
    }
    if (!generalHelper.isThisUndefinedOrEmpty(postRequest.protectedPayment)) {
      if (!generalHelper.isValidCurrency(postRequest.protectedPayment)) {
        errors.protectedPayment = {
          text: i18n.t('marital-relevant-inherited-amounts:fields.protectedPayment.errors.format'),
        };
      } else if (generalHelper.isGreaterThenFiveCharacterExcludingPoint(postRequest.protectedPayment)) {
        errors.protectedPayment = {
          text: i18n.t('marital-relevant-inherited-amounts:fields.protectedPayment.errors.length'),
        };
      }
    }
    return errors;
  },
  async updateStatePensionAwardAmountValidator(postRequest, type, apiValidator) {
    const errors = [];
    if (generalHelper.isThisUndefinedOrEmpty(postRequest.amount)) {
      errors.amount = {
        text: i18n.t(`marital-update-award-amount:fields.amount.${type}.errors.required`),
      };
    } else if (!generalHelper.isValidCurrency(postRequest.amount)) {
      errors.amount = {
        text: i18n.t(`marital-update-award-amount:fields.amount.${type}.errors.invalid`),
      };
    } else if (generalHelper.isGreaterThenFiveCharacterExcludingPoint(postRequest.amount)) {
      errors.amount = {
        text: i18n.t(`marital-update-award-amount:fields.amount.${type}.errors.length`),
      };
    }

    if (type === 'new-state-pension' && Object.keys(errors).length === 0) {
      const { valid, validation: { max } } = await apiValidator(postRequest.amount);

      if (!valid) {
        const formattedMaxAmount = generalHelper.formatCurrency(max);
        errors.amount = {
          text: i18n.t('marital-update-award-amount:fields.amount.new-state-pension.errors.max-amount', { AMOUNT: formattedMaxAmount }),
        };
      }
    }

    return errors;
  },
  updateStatePensionAwardValidator(maritalSession) {
    const updatedSPComponents = [
      'update-state-pension-award-new-state-pension',
      'update-state-pension-award-protected-payment',
      'update-state-pension-award-inherited-extra-state-pension',
    ];

    const sessionCheck = updatedSPComponents.some((el) => Object.keys(maritalSession).includes(el));
    const errors = [];
    if (!sessionCheck) {
      errors.statePensionComponents = {
        text: i18n.t('marital-update-state-pension-award:errors.statePensionComponents'),
      };
    }
    return errors;
  },
};
