const validator = require('validator');
const moment = require('moment');
const httpStatus = require('http-status-codes');
const i18n = require('i18next');

const alphaChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const punctuation = '. \'-';

const characterFilterRegEx = `^[${alphaChars}][${alphaChars}. '-]+$`;
const characterFilterRegExAndAmpersand = `^[${alphaChars}][&${alphaChars}. '-]+$`;
const characterFilterRegExMinOne = `^([${alphaChars}]|[${alphaChars}]((?!([${punctuation}]){2})[${alphaChars}${punctuation}]){0,140}[${alphaChars}])$`;
const characterFilterRegExMinTwo = `^[${alphaChars}]((?!([${punctuation}]){2})[${alphaChars}${punctuation}]){0,140}[${alphaChars}]$`;

const validInviteKeyCharacters = '^[a-zA-Z0-9 ]+$';

const telephoneNumberRegEx = '^[0-9 ]+$';
const rollRegEx = '^[abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0-9 /\'*&().,-]+$';
const currencyRegEx = '^[0-9]+\\.[0-9]{2}$';
const yesNoReg = '^(?:yes|no)$';
const validMaritalStatusReg = '^(?:single|married|civil|widowed|divorced|dissolved)$';
const validEaseOfUseReg = '^(?:veryEasy|easy|difficult|veryDifficult)$';
const validHelperReg = '^(?:yourself|someoneElse|onBehalf)$';
const serviceReceivedReg = '^(?:verySatisfied|satisfied|neither|dissatisfied|veryDissatisfied)$';
const validAuthTypeReg = '^(?:invite|verify)$';
const validPaymentFrequencyRegEx = '^(?:1W|2W|4W|13W)$';
const validSingleRegEx = '^(?:married|civil)$';
const validMaritalMarriedRegEx = '^(?:divorced|widowed)$';
const validMaritalCivilRegEx = '^(?:dissolved|widowed)$';

const asciiCode32to127 = '^[abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0-9 \\\\[\\]`!^_"#$%&\'()&+,-./:;<>=?@{|}~*]+$';
const characterLength5 = 5;
const characterLength24 = 24;
const characterLength35 = 35;
const characterLength70 = 70;
const characterLength100 = 100;
const characterLength140 = 140;
const characterLength1200 = 1200;
const yearLength = 4;

function formatDate(datePart) {
  if (datePart !== undefined && datePart.toString().length === 1) {
    return `0${datePart}`;
  }
  return datePart;
}

module.exports = {
  easeOfUseValidator(string) {
    if (string === undefined) {
      return false;
    }
    const validEaseOfUse = new RegExp(validEaseOfUseReg);
    if (validEaseOfUse.test(string)) {
      return true;
    }
    return false;
  },
  helperInfoValidator(string) {
    if (string === undefined) {
      return false;
    }
    const validHelper = new RegExp(validHelperReg);
    if (validHelper.test(string)) {
      return true;
    }
    return false;
  },
  serviceReceivedValidator(string) {
    if (string === undefined) {
      return false;
    }
    const serviceReceived = new RegExp(serviceReceivedReg);
    if (serviceReceived.test(string)) {
      return true;
    }
    return false;
  },
  checkIfYesOrNo(string) {
    const yesNoCheck = new RegExp(yesNoReg);
    if (yesNoCheck.test(string)) {
      return true;
    }
    return false;
  },
  checkIfGreaterThenTwentyFour(string) {
    if (string.length > characterLength24) {
      return true;
    }
    return false;
  },
  checkIfGreaterThenThirtyFive(string) {
    if (string.length > characterLength35) {
      return true;
    }
    return false;
  },
  checkIfGreaterThenSeventy(string) {
    if (string.length > characterLength70) {
      return true;
    }
    return false;
  },
  checkIfGreaterThenOneHundred(string) {
    if (string.length > characterLength100) {
      return true;
    }
    return false;
  },
  checkIfGreaterThenOneHundredAndForty(string) {
    if (string.length > characterLength140) {
      return true;
    }
    return false;
  },
  checkIfGreaterThenOneThousandTwoHundred(string) {
    if (string.length > characterLength1200) {
      return true;
    }
    return false;
  },
  checkIfValidMaritalStatus(string) {
    const validMaritalStatus = new RegExp(validMaritalStatusReg);
    if (validMaritalStatus.test(string)) {
      return true;
    }
    return false;
  },
  checkIfValidRollNumber(string) {
    const rollCheck = new RegExp(rollRegEx);
    if (rollCheck.test(string)) {
      return true;
    }
    return false;
  },
  checkIfValidAsciiCode32to127(string) {
    const asciiCheck = new RegExp(asciiCode32to127);
    if (asciiCheck.test(string)) {
      return true;
    }
    return false;
  },
  checkNameCharacters(string) {
    const characterCheck = new RegExp(characterFilterRegEx);
    return characterCheck.test(string);
  },
  checkFirstNameCharacters(string) {
    const characterCheck = new RegExp(characterFilterRegExMinOne);
    return characterCheck.test(string);
  },
  checkLastNameCharacters(string) {
    const characterCheck = new RegExp(characterFilterRegExMinTwo);
    return characterCheck.test(string);
  },
  checkSurnameCharactersAndAmpersand(string) {
    const characterCheck = new RegExp(characterFilterRegExAndAmpersand);
    if (characterCheck.test(string)) {
      return true;
    }
    return false;
  },
  checkIfValidTelephoneNumberWithSpaces(string) {
    const telephoneCheck = new RegExp(telephoneNumberRegEx);
    if (telephoneCheck.test(string)) {
      return false;
    }
    return true;
  },
  checkIfValidPaymentFrequency(string) {
    const frequencyCheck = new RegExp(validPaymentFrequencyRegEx);
    if (frequencyCheck.test(string)) {
      return true;
    }
    return false;
  },
  daysInMonth(month, year) {
    switch (parseInt(month, 10)) {
    case 2:
      return !(year % 4) && (!(year % 400) || !!(year % 100)) ? 29 : 28;
    case 4: case 6: case 9: case 11:
      return 30;
    default:
      return 31;
    }
  },
  formatDate,
  isDateValid(day, month, year) {
    if ((!validator.isNumeric(`${day}`) || !validator.isNumeric(`${month}`) || !validator.isNumeric(`${year}`))) {
      return false;
    }
    if (year.toString().length !== yearLength) {
      return false;
    }
    if (!validator.isISO8601(`${year}-${formatDate(month)}-${formatDate(day)}`, { strict: true })) {
      return false;
    }
    return true;
  },
  isDateDayValid(day, month, year) {
    if (month === undefined || year === undefined) {
      return false;
    }
    if (day !== undefined && (day < 1 || day > this.daysInMonth(month, year) || !validator.isNumeric(`${day}`))) {
      return false;
    }
    return true;
  },
  isDateMonthValid(month) {
    if (month !== undefined && (month < 1 || month > 12 || !validator.isNumeric(`${month}`))) {
      return false;
    }
    return true;
  },
  isDateYearValid(year) {
    if (year !== undefined && (year.toString().length !== yearLength || !validator.isNumeric(`${year}`))) {
      return false;
    }
    return true;
  },
  isValidMonthYear(month, year) {
    if (!validator.isNumeric(month) || !validator.isNumeric(year)) {
      return false;
    } if (year.toString().length !== yearLength) {
      return false;
    } if (Number(month) < 1 || Number(month) > 12) {
      return false;
    }
    return true;
  },
  isFutureMonthYear(month, year) {
    const currentMonth = moment().format('M');
    const currentYear = moment().format('gggg');
    if (year > currentYear) {
      return false;
    } if (currentYear === year && Number(month) > currentMonth) {
      return false;
    }
    return true;
  },
  isDateBeforeToday(day, month, year) {
    let formatMonth = month;
    if (month !== undefined) {
      if (month.length === 1) {
        formatMonth = `0${month}`;
      }
    }
    const dateToday = new Date();
    if (validator.isBefore(`${year}-${formatMonth}-${day}`, dateToday)) {
      return true;
    }
    return false;
  },
  isDateAfterToday(day, month, year) {
    let formatMonth = month;
    if (month !== undefined) {
      if (month.length === 1) {
        formatMonth = `0${month}`;
      }
    }
    const dateToday = moment();
    if (validator.isAfter(`${year}-${formatMonth}-${day}`, dateToday.toISOString())) {
      return true;
    }
    return false;
  },
  isDateBeforeDate(date, day, month, year) {
    let formatMonth = month;
    let formatDay = day;
    if (month !== undefined) {
      if (month.length === 1) {
        formatMonth = `0${month}`;
      }
    }
    if (day !== undefined) {
      if (day.length === 1) {
        formatDay = `0${day}`;
      }
    }
    const parsedDate = moment(date, 'x').startOf('day');
    if (validator.isBefore(`${year}-${formatMonth}-${formatDay}`, parsedDate.utc().toISOString())) {
      return true;
    }
    return false;
  },
  isThisUndefinedOrEmpty(input) {
    if (input === undefined) {
      return true;
    }
    if (input === '') {
      return true;
    }
    return false;
  },
  isThisDefined(input) {
    if (input === undefined) {
      return false;
    }
    return true;
  },
  isBankOrBuilding(input) {
    if (input === 'bank' || input === 'building') {
      return true;
    }
    return false;
  },
  checkIfStartsWithSpace(text) {
    if (text[0] === ' ') {
      return true;
    }
    return false;
  },
  isValidAuthType(string) {
    const characterCheck = new RegExp(validAuthTypeReg);
    if (characterCheck.test(string)) {
      return true;
    }
    return false;
  },
  checkInviteKeyCharacters(string) {
    const characterCheck = new RegExp(validInviteKeyCharacters);
    if (characterCheck.test(string)) {
      return true;
    }
    return false;
  },
  removeSpacesAndHyphens(string) {
    if (string !== '' && string !== undefined) {
      return string.replace(/-|\s/g, '');
    }
    return string;
  },
  returnNullIfUndefinedOrEmpty(string) {
    if (this.isThisUndefinedOrEmpty(string)) {
      return null;
    }
    return string;
  },
  capitaliseFirstLetter(string) {
    if (string !== '' && string !== undefined) {
      return string.toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
    }
    return string;
  },
  formatPaymentStatus(status) {
    return this.capitaliseFirstLetter(status);
  },
  formatPaymentStatusToChangeType(status) {
    if (status === 'PAID') {
      return 'returned';
    }
    if (status === 'SENT') {
      return 'recall';
    }
    if (status === 'RECALLING') {
      return 'recalling';
    }
    return false;
  },
  formatSortCode(sortCode) {
    return sortCode.replace(/[\s-]+/g, '').replace(/(.{2})/g, '$1 ').trim();
  },
  floatDecimal(float) {
    return float.toFixed(2);
  },
  formatCurrency(number) {
    const numberFormat = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });
    if (number !== undefined && number !== null) {
      return numberFormat.format(number);
    }
    return numberFormat.format(0);
  },
  globalErrorMessage(error, service) {
    if (error.statusCode === httpStatus.BAD_REQUEST) {
      return i18n.t('app:errors.api.bad-request');
    }
    if (error.statusCode === httpStatus.INTERNAL_SERVER_ERROR) {
      return i18n.t('app:errors.api.internal-server-error');
    }
    if (error.statusCode === httpStatus.NOT_FOUND) {
      return i18n.t('app:errors.api.not-found', { SERVICE: service });
    }
    return i18n.t('app:errors.api.no-status');
  },
  isNotUndefinedEmptyOrNull(...inputs) {
    let result = true;
    inputs.forEach((input) => {
      if (input === undefined) {
        result = false;
      } else if (input === '') {
        result = false;
      } else if (input === null) {
        result = false;
      }
    });
    return result;
  },
  removeNullFromArray(array) {
    return array.filter((element) => element !== null);
  },
  formatNinoWithSpaces(string) {
    return string.replace(/(.{2})/g, '$1 ').trim();
  },
  checkIfValidMaritalStatusByStatus(string, currentMaritalStatus) {
    const singleCheck = new RegExp(validSingleRegEx);
    const maritalCheck = new RegExp(validMaritalMarriedRegEx);
    const civilCheck = new RegExp(validMaritalCivilRegEx);
    if ((currentMaritalStatus === 'Single' || currentMaritalStatus === 'Divorced' || currentMaritalStatus === 'Dissolved' || currentMaritalStatus === 'Widowed') && singleCheck.test(string)) {
      return true;
    }
    if (currentMaritalStatus === 'Married' && maritalCheck.test(string)) {
      return true;
    }
    if (currentMaritalStatus === 'Civil Partnership' && civilCheck.test(string)) {
      return true;
    }
    return false;
  },
  lowerCaseOrNull(string) {
    if (string) {
      return string.toLowerCase();
    }
    return null;
  },
  isValidCurrency(string) {
    const currencyCheck = new RegExp(currencyRegEx);
    return currencyCheck.test(string);
  },
  isGreaterThenFiveCharacterExcludingPoint(string) {
    const newString = string.replace(/\./g, '');
    if (newString.length > characterLength5) {
      return true;
    }
    return false;
  },
  formatPaymentFrequency(string) {
    return `${string.replace(/\D/g, '')} weekly`;
  },
};
