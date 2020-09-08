const i18n = require('i18next');
const validator = require('validator');

i18n.init({
  sendMissingTo: 'fallback',
});

const characterFilterRegEx = '^[abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ. \'-]+$';
const characterAlphaNumRegEx = '^[abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789]+$';
const characterFilterAZ = '^[ABCDEFGHIJKLMNOPQRSTUVWXYZ]+$';
const validGender = '^(?:Male|Female)$';
const validDOBVerificationStatus = '^(?:V|NV)$';
const lengthMin = 2;
const lengthMax70 = 70;
const lengthMax8 = 8;
const lengthMax35 = 35;
const lengthMax4 = 4;

const validStates = ['ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA'];

const maleLowerPensionAge = '1951-04-06';
const femaleLowerPensionAge = '1953-04-06';
const higherPensionAge = '1960-04-05';

function formatDate(datePart) {
  if (datePart !== undefined && datePart.toString().length === 1) {
    return `0${datePart}`;
  }
  return datePart;
}

function validDOBVerification(string) {
  const dobValidatedStatus = new RegExp(validDOBVerificationStatus);
  if (dobValidatedStatus.test(string)) {
    return false;
  }
  return true;
}

function invalidGender(string) {
  const genderCheck = new RegExp(validGender);
  if (genderCheck.test(string)) {
    return false;
  }
  return true;
}

function invalidAlphaNum(string) {
  const alphaNumCheck = new RegExp(characterAlphaNumRegEx);
  if (alphaNumCheck.test(string)) {
    return false;
  }
  return true;
}

function invalidCharacters(string) {
  const characterCheck = new RegExp(characterFilterRegEx);
  if (characterCheck.test(string)) {
    return false;
  }
  return true;
}

function invalidFirstCharacter(string) {
  const characterCheck = new RegExp(characterFilterAZ);
  if (characterCheck.test(string[0])) {
    return false;
  }
  return true;
}

function isMale(value) {
  if (value === 'Male') {
    return true;
  }
  return false;
}

function isFemale(value) {
  if (value === 'Female') {
    return true;
  }
  return false;
}

function isValidState(value) {
  if (validStates.indexOf(value) !== -1) {
    return true;
  }
  return false;
}

module.exports = {
  isValidDOBVerificationStatus(dobStatus) {
    let error;
    if (validDOBVerification(dobStatus)) {
      error = i18n.t('add:errors.generic.required');
    }
    return error;
  },
  isValidTitle(title, titles) {
    let error;
    if (title === '' || titles.indexOf(title) === -1) {
      error = i18n.t('add:errors.generic.required');
    }
    return error;
  },
  isValidSurname(surname) {
    let error;
    if (surname === '') {
      error = i18n.t('add:errors.surname.required');
    } else if (invalidFirstCharacter(surname)) {
      error = i18n.t('add:errors.surname.invalidStart');
    } else if (invalidCharacters(surname)) {
      error = i18n.t('add:errors.surname.format');
    } else if (surname.length < lengthMin) {
      error = i18n.t('add:errors.surname.toShort');
    } else if (surname.length > lengthMax70) {
      error = i18n.t('add:errors.surname.toLong');
    }
    return error;
  },
  isValidFirstName(firstName) {
    let error;
    if (firstName === '') {
      error = i18n.t('add:errors.firstname.required');
    } else if (invalidFirstCharacter(firstName)) {
      error = i18n.t('add:errors.firstname.invalidStart');
    } else if (invalidCharacters(firstName)) {
      error = i18n.t('add:errors.firstname.format');
    } else if (firstName.length > lengthMax70) {
      error = i18n.t('add:errors.firstname.toLong');
    }
    return error;
  },
  isValidAddressLine(value, name) {
    let error;
    if (value === '') {
      error = i18n.t(`add:errors.${name}.required`);
    } else if (value.length > lengthMax35) {
      error = i18n.t(`add:errors.${name}.toLong`);
    }
    return error;
  },
  isValidAddressLineAndAlpha(value, name) {
    let error = this.isValidAddressLine(value, name);
    if (error === undefined) {
      if (invalidAlphaNum(value)) {
        error = i18n.t(`add:errors.${name}.invalidAlphaNum`);
      }
    }
    return error;
  },
  isValidOptionalAddressLine(value, name) {
    let error;
    if (value.length > lengthMax35) {
      error = i18n.t(`add:errors.${name}.toLong`);
    }
    return error;
  },
  isValidConditionalAddressLine(value, value2, name) {
    let error;
    if (value === '' && value2 === '') {
      error = i18n.t(`add:errors.${name}.required`);
    }
    return error;
  },
  isValidPostCode(value) {
    let error;
    if (value === '') {
      error = i18n.t('add:errors.postcode.required');
    } else if (value.length > lengthMax8) {
      error = i18n.t('add:errors.postcode.toLong');
    }
    return error;
  },
  isValidPostCodeAU(value) {
    let error;
    if (value.length > lengthMax4) {
      error = i18n.t('add:errors.postcodeAU.toLong');
    } else if (value !== '' && !validator.isNumeric(value)) {
      error = i18n.t('add:errors.postcodeAU.number');
    }
    return error;
  },
  isValidState(value) {
    let error;
    if (value !== '' && !isValidState(value)) {
      error = i18n.t('add:errors.state.valid');
    }
    return error;
  },
  isValidGender(value) {
    let error;
    if (invalidGender(value)) {
      error = i18n.t('add:errors.gender.required');
    }
    return error;
  },
  isValidDateWithGender(day, month, year, gender) {
    const dateOfBirth = `${year}-${formatDate(month)}-${formatDate(day)}`;
    let error;
    if (isMale(gender) && validator.isBefore(dateOfBirth, maleLowerPensionAge)) {
      error = 'before';
    } else if (isFemale(gender) && validator.isBefore(dateOfBirth, femaleLowerPensionAge)) {
      error = 'before';
    } else if (validator.isAfter(dateOfBirth, higherPensionAge)) {
      error = 'after';
    }
    return error;
  },
};
