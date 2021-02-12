const i18n = require('i18next');
const validator = require('validator');
const moment = require('moment');

moment().format();

const fieldValidator = require('./customerFieldsValidator');
const claimInformationFieldsValidator = require('./claimInformationFieldsValidator');
const statusValidator = require('./statusValidator');
const generalHelper = require('./helpers/general');

const yearLength = 4;
const maxNumberOfDays = 28;

const validAccountNumberLength = 8;
const validSortCodeLength = 6;
const maxRollLength = 18;

const ninoRegEx = '^(?!BG|GB|NK|KN|TN|NT|ZZ)[A-CEGHJ-PR-TW-Z]{1}[A-CEGHJ-NPR-TW-Z]{1}[0-9]{6}[A-D]{1}$';
const postcodeRegEx = '^(([A-Z][0-9]{1,2})|(([A-Z][A-HJ-Y][0-9]{1,2})|(([A-Z][0-9][A-Z])'
      + '|([A-Z][A-HJ-Y][0-9]?[A-Z]))))( [0-9][A-Z]{2}|[0-9][A-Z]{2})$';

function invalidNino(string) {
  const ninoCheck = new RegExp(ninoRegEx);
  if (ninoCheck.test(string)) {
    return false;
  }
  return true;
}

function isUK(string) {
  if (string === 'UK') {
    return true;
  }
  return false;
}

function isOverseas(string) {
  if (string === 'Overseas') {
    return true;
  }
  return false;
}

function isValidUkPostcode(value) {
  const postcodeCheck = new RegExp(postcodeRegEx, 'i');
  if (postcodeCheck.test(value)) {
    return true;
  }
  return false;
}

module.exports = {
  addressValidation(form) {
    const errors = {};
    if (isUK(form.address)) {
      const subBuildingName = fieldValidator.isValidOptionalAddressLine(form.subBuildingName, 'subBuildingName');
      if (subBuildingName !== undefined) {
        errors.subBuildingName = {
          text: subBuildingName,
        };
      }

      const buildingNameAndNumber = fieldValidator.isValidConditionalAddressLine(
        form.buildingName, form.buildingNumber, 'buildingNameAndNumber',
      );
      const buildingName = fieldValidator.isValidOptionalAddressLine(form.buildingName, 'buildingName');
      const buildingNumber = fieldValidator.isValidOptionalAddressLine(form.buildingNumber, 'buildingNumber');
      if (buildingNameAndNumber !== undefined) {
        errors.buildingNameAndNumber = {
          text: buildingNameAndNumber,
        };
      } else if (buildingName || buildingNumber) {
        if (buildingName !== undefined) {
          errors.buildingName = {
            text: buildingName,
          };
        }
        if (buildingNumber !== undefined) {
          errors.buildingNumber = {
            text: buildingNumber,
          };
        }
      }

      const dependentThoroughfareName = fieldValidator.isValidOptionalAddressLine(
        form.dependentThoroughfareName, 'dependentThoroughfareName',
      );
      if (dependentThoroughfareName !== undefined) {
        errors.dependentThoroughfareName = {
          text: dependentThoroughfareName,
        };
      }

      const thoroughfareName = fieldValidator.isValidAddressLine(form.thoroughfareName, 'thoroughfareName');
      if (thoroughfareName !== undefined) {
        errors.thoroughfareName = {
          text: thoroughfareName,
        };
      }

      const dependentLocality = fieldValidator.isValidOptionalAddressLine(form.dependentLocality, 'dependentLocality');
      if (dependentLocality !== undefined) {
        errors.dependentLocality = {
          text: dependentLocality,
        };
      }

      const postTown = fieldValidator.isValidOptionalAddressLine(form.postTown, 'postTown');
      if (postTown !== undefined) {
        errors.town = {
          text: postTown,
        };
      }

      const postCode = fieldValidator.isValidPostCode(form.postCode, 'postCode');
      if (postCode !== undefined) {
        errors.postCode = {
          text: postCode,
        };
      }
    }

    if (isOverseas(form.address)) {
      const addressLine1 = fieldValidator.isValidAddressLine(form.addressLine1, 'addressLine1');
      if (addressLine1 !== undefined) {
        errors.addressLine1 = {
          text: addressLine1,
        };
      }

      for (let i = 1; i <= 7; i++) {
        const addressLine = fieldValidator.isValidOptionalAddressLine(form[`addressLine${i}`], `addressLine${i}`);
        if (addressLine !== undefined) {
          errors[`addressLine${i}`] = {
            text: addressLine,
          };
        }
      }

      const country = fieldValidator.isValidAddressLine(form.country, 'country');
      if (country !== undefined) {
        errors.country = {
          text: country,
        };
      }
    }

    if (Object.keys(errors).length === 0) {
      return undefined;
    }
    return errors;
  },
  customerDetails(form, titles) {
    const errors = [];

    const title = fieldValidator.isValidTitle(form.title, titles);
    if (title !== undefined) {
      errors.title = {
        text: title,
      };
    }

    const firstName = fieldValidator.isValidFirstName(form.firstName);
    if (firstName !== undefined) {
      errors.firstName = {
        text: firstName,
      };
    }

    const surname = fieldValidator.isValidSurname(form.surname);
    if (surname !== undefined) {
      errors.surname = {
        text: surname,
      };
    }

    if (form.nino === '') {
      errors.nino = {
        text: i18n.t('add:errors.nino.required'),
      };
    } else if (invalidNino(form.nino)) {
      errors.nino = {
        text: i18n.t('add:errors.nino.format'),
      };
    }

    const addressErrors = this.addressValidation(form);

    if (addressErrors !== undefined) {
      Object.assign(errors, addressErrors);
    }

    if (form.dobDay === '' || form.dobMonth === '' || form.dobYear === '') {
      errors.dob = {
        text: i18n.t('add:errors.dob.required'),
      };
      if (form.dobDay === '') {
        errors.dobDay = true;
      }

      if (form.dobMonth === '') {
        errors.dobMonth = true;
      }

      if (form.dobYear === '') {
        errors.dobYear = true;
      }
    } else if (generalHelper.isDateValid(form.dobDay, form.dobMonth, form.dobYear) && form.dobYear.toString().length === yearLength) {
      const dobGenderError = fieldValidator.isValidDateWithGender(form.dobDay, form.dobMonth, form.dobYear, form.gender);
      if (dobGenderError) {
        errors.statePensionDate = {
          text: i18n.t('add:errors.state_pension_date.date'),
        };
      }
    } else {
      errors.dob = {
        text: i18n.t('add:errors.dob.format'),
      };
      if (!generalHelper.isDateDayValid(form.dobDay, form.dobMonth, form.dobYear)) {
        errors.dobDay = true;
      }
      if (!generalHelper.isDateMonthValid(form.dobMonth)) {
        errors.dobMonth = true;
      }

      if (!generalHelper.isDateYearValid(form.dobYear)) {
        errors.dobYear = true;
      }
    }

    const dobVerificationError = fieldValidator.isValidDOBVerificationStatus(form.dobV);
    if (dobVerificationError !== undefined) {
      errors.dobV = {
        text: dobVerificationError,
      };
    }

    const gender = fieldValidator.isValidGender(form.gender);
    if (gender !== undefined) {
      errors.gender = {
        text: gender,
      };
    }

    return errors;
  },
  nextClaimErrorValidation(form) {
    const errors = [];

    if (form.accessKey === '') {
      errors.accessKey = {
        text: i18n.t('robot:errors.access_key.required'),
      };
    }

    return errors;
  },
  claimInErrorValidation(form) {
    const errors = [];

    if (form.accessKey === '') {
      errors.accessKey = {
        text: i18n.t('robot:errors.access_key.required'),
      };
    }

    if (form.inviteKey === '') {
      errors.inviteKey = {
        text: i18n.t('robot:errors.invite_key.required'),
      };
    }

    if (form.message === '') {
      errors.message = {
        text: i18n.t('robot:errors.message.required'),
      };
    }

    return errors;
  },
  claimInformationValidation(form) {
    const errors = [];
    if (generalHelper.isThisUndefinedOrEmpty(form.toDateDay) || generalHelper.isThisUndefinedOrEmpty(form.toDateMonth) || generalHelper.isThisUndefinedOrEmpty(form.toDateYear)) {
      errors.toDate = {
        text: i18n.t('claim-information:errors.toDate.required'),
      };
      if (generalHelper.isThisUndefinedOrEmpty(form.toDateDay)) {
        errors.toDateDay = true;
      }

      if (generalHelper.isThisUndefinedOrEmpty(form.toDateMonth)) {
        errors.toDateMonth = true;
      }

      if (generalHelper.isThisUndefinedOrEmpty(form.toDateYear)) {
        errors.toDateYear = true;
      }
    } else {
      if (!generalHelper.isDateDayValid(form.toDateDay, form.toDateMonth, form.toDateYear)) {
        errors.toDateDay = true;
      }
      if (!generalHelper.isDateMonthValid(form.toDateMonth)) {
        errors.toDateMonth = true;
      }

      if (!generalHelper.isDateYearValid(form.toDateYear)) {
        errors.toDateYear = true;
      }

      if (errors.toDateDay || errors.toDateMonth || errors.toDateYear) {
        errors.toDate = {
          text: i18n.t('claim-information:errors.toDate.format'),
        };
      }
    }

    if (generalHelper.isThisUndefinedOrEmpty(form.fromDateDay)
      || generalHelper.isThisUndefinedOrEmpty(form.fromDateMonth)
      || generalHelper.isThisUndefinedOrEmpty(form.fromDateYear)) {
      errors.fromDate = {
        text: i18n.t('claim-information:errors.fromDate.required'),
      };
      if (generalHelper.isThisUndefinedOrEmpty(form.fromDateDay)) {
        errors.fromDateDay = true;
      }

      if (generalHelper.isThisUndefinedOrEmpty(form.fromDateMonth)) {
        errors.fromDateMonth = true;
      }

      if (generalHelper.isThisUndefinedOrEmpty(form.fromDateYear)) {
        errors.fromDateYear = true;
      }
    } else {
      if (!generalHelper.isDateDayValid(form.fromDateDay, form.fromDateMonth, form.fromDateYear)) {
        errors.fromDateDay = true;
      }
      if (!generalHelper.isDateMonthValid(form.fromDateMonth)) {
        errors.fromDateMonth = true;
      }

      if (!generalHelper.isDateYearValid(form.fromDateYear)) {
        errors.fromDateYear = true;
      }
      if (errors.fromDateDay || errors.fromDateMonth || errors.fromDateYear) {
        errors.fromDate = {
          text: i18n.t('claim-information:errors.fromDate.format'),
        };
      }
    }
    let fromDate;
    let toDate;
    if (errors.fromDate === undefined || errors.toDate === undefined) {
      const possibleFormats = ['YYYY-MM-DD'];
      fromDate = `${String(form.fromDateYear)}-${String(form.fromDateMonth)}-${String(form.fromDateDay)}`;
      toDate = `${String(form.toDateYear)}-${String(form.toDateMonth)}-${String(form.toDateDay)}`;
      fromDate = moment(fromDate, possibleFormats);
      toDate = moment(toDate, possibleFormats);

      if (fromDate.isAfter(toDate)) {
        errors.fromDate = {
          text: i18n.t('claim-information:errors.fromDate.after'),
        };
        errors.toDate = {
          text: i18n.t('claim-information:errors.toDate.before'),
        };
      }
    }

    const type = claimInformationFieldsValidator.isValidClaimType(form.type);
    if (type !== undefined) {
      errors.type = {
        text: type,
      };
    }

    if (fromDate !== undefined && toDate !== undefined) {
      const claimOrCitizenType = claimInformationFieldsValidator.isValidClaimOrCitizenType(form.type);
      const numberOfDays = toDate.diff(fromDate, 'days') + 1;
      if (claimOrCitizenType === true && numberOfDays > maxNumberOfDays) {
        errors.maximumPeriod = i18n.t('claim-information:errors.toDate.maximumPeriod');
      }
    }

    return errors;
  },
  ninoDetails(form) {
    const errors = [];
    if (form.nino === undefined || form.nino === '') {
      errors.nino = {
        text: i18n.t('find-someone:errors.nino.required'),
      };
    } else if (invalidNino(form.nino)) {
      errors.nino = {
        text: i18n.t('find-someone:errors.nino.format'),
      };
    }

    return errors;
  },
  contactDetails(form, type, addOrChange) {
    const telephone = new RegExp('^(?:home|mobile|work)$');
    const email = new RegExp('^(?:email)$');
    const errors = [];

    if (telephone.test(type)) {
      const phoneError = this.validateTelephoneNumber(type, form[`${type}PhoneNumber`], addOrChange);
      if (phoneError) {
        errors[`${type}PhoneNumber`] = {
          text: phoneError,
        };
      }
    }

    if (email.test(type)) {
      let value = form[type];
      if (value !== '' && value !== undefined) {
        value = value.trim();
      }
      const emailError = this.validateEmail(type, value, addOrChange);
      if (emailError) {
        errors[type] = {
          text: emailError,
        };
      }
    }

    return errors;
  },
  validateTelephoneNumber(type, value, addOrChange) {
    if (value === '' || value === undefined) {
      return i18n.t(`contact-details:fields.${type}_phone_number.${addOrChange}.errors.required`);
    }
    if (generalHelper.checkIfValidTelephoneNumberWithSpaces(value)) {
      return i18n.t(`contact-details:fields.${type}_phone_number.${addOrChange}.errors.format`);
    }
    if (generalHelper.checkIfGreaterThenSeventy(value)) {
      return i18n.t(`contact-details:fields.${type}_phone_number.${addOrChange}.errors.length`);
    }
    return undefined;
  },
  validateEmail(type, value, addOrChange) {
    if (value === '' || value === undefined) {
      return i18n.t(`contact-details:fields.${type}.${addOrChange}.errors.required`);
    }
    if (!validator.isEmail(value)) {
      return i18n.t(`contact-details:fields.${type}.${addOrChange}.errors.format`);
    }
    if (generalHelper.checkIfGreaterThenOneHundred(value)) {
      return i18n.t(`contact-details:fields.${type}.${addOrChange}.errors.length`);
    }
    return false;
  },
  removeContact(form, type) {
    const telephone = new RegExp('^(?:home|mobile|work)$');
    const email = new RegExp('^(?:email)$');

    const errors = [];
    if (telephone.test(type)) {
      if (!generalHelper.checkIfYesOrNo(form.removeContactNumber)) {
        errors.removeContactNumber = {
          text: i18n.t('remove-contact-details:fields.removeContactNumber.errors.required', { TYPE: type }),
        };
      }
    }
    if (email.test(type)) {
      if (!generalHelper.checkIfYesOrNo(form.removeContact)) {
        errors.removeContact = {
          text: i18n.t('remove-contact-details:fields.removeEmail.errors.required'),
        };
      }
    }
    return errors;
  },
  addressPostcodeDetails(form) {
    const errors = [];
    if (form.postcode === '' || form.postcode === undefined) {
      errors.postcode = {
        text: i18n.t('address:fields.postcode.errors.required'),
      };
    } else if (!isValidUkPostcode(form.postcode)) {
      errors.postcode = {
        text: i18n.t('address:fields.postcode.errors.format'),
      };
    }

    return errors;
  },
  addressDetails(form) {
    const errors = [];
    if (form.address === '' || form.address === undefined) {
      errors.address = {
        text: i18n.t('address:fields.address.errors.required'),
      };
    }
    return errors;
  },
  bankBuildingAccountDetails(form) {
    const errors = [];

    if (form.accountName === '' || form.accountName === undefined) {
      errors.accountName = {
        text: i18n.t('account:fields.accountName.errors.required'),
      };
    } else if (!generalHelper.checkSurnameCharactersAndAmpersand(form.accountName)) {
      errors.accountName = {
        text: i18n.t('account:fields.accountName.errors.format'),
      };
    } else if (generalHelper.checkIfGreaterThenSeventy(form.accountName)) {
      errors.accountName = {
        text: i18n.t('account:fields.accountName.errors.length'),
      };
    }

    if (form.accountNumber === '' || form.accountNumber === undefined) {
      errors.accountNumber = {
        text: i18n.t('account:fields.accountNumber.errors.required'),
      };
    } else if (!validator.isNumeric(form.accountNumber)) {
      errors.accountNumber = {
        text: i18n.t('account:fields.accountNumber.errors.format'),
      };
    } else if (form.accountNumber.length !== validAccountNumberLength) {
      errors.accountNumber = {
        text: i18n.t('account:fields.accountNumber.errors.length'),
      };
    }
    const sortCode = generalHelper.removeSpacesAndHyphens(form.sortCode);
    if (form.sortCode === '' || form.sortCode === undefined) {
      errors.sortCode = {
        text: i18n.t('account:fields.sortCode.errors.required'),
      };
    } else if (!validator.isNumeric(sortCode)) {
      errors.sortCode = {
        text: i18n.t('account:fields.sortCode.errors.format'),
      };
    } else if (sortCode.length !== validSortCodeLength) {
      errors.sortCode = {
        text: i18n.t('account:fields.sortCode.errors.length'),
      };
    }

    if (form.referenceNumber !== '' && form.referenceNumber !== undefined) {
      if (!generalHelper.checkIfValidRollNumber(form.referenceNumber)) {
        errors.referenceNumber = {
          text: i18n.t('account:fields.referenceNumber.errors.format'),
        };
      } else if (form.referenceNumber.length > maxRollLength) {
        errors.referenceNumber = {
          text: i18n.t('account:fields.referenceNumber.errors.length'),
        };
      }
    }
    return errors;
  },
  paymentFrequency(form) {
    const errors = [];
    if (form.frequency === '' || form.frequency === undefined || !generalHelper.checkIfValidPaymentFrequency(form.frequency)) {
      errors.frequency = {
        text: i18n.t('payment-frequency:fields.frequency.errors.required'),
      };
    }

    return errors;
  },
  dateOfDeathValidation(form) {
    const errors = [];

    if (generalHelper.isThisUndefinedOrEmpty(form.dateDay) && generalHelper.isThisUndefinedOrEmpty(form.dateMonth) && generalHelper.isThisUndefinedOrEmpty(form.dateYear)) {
      errors.date = {
        text: i18n.t('date-of-death:fields.date.errors.required'),
      };
      errors.dateDay = true;
      errors.dateMonth = true;
      errors.dateYear = true;
    } else if (generalHelper.isThisUndefinedOrEmpty(form.dateDay) || generalHelper.isThisUndefinedOrEmpty(form.dateMonth) || generalHelper.isThisUndefinedOrEmpty(form.dateYear)) {
      errors.date = {
        text: i18n.t('date-of-death:fields.date.errors.incomplete'),
      };
      if (generalHelper.isThisUndefinedOrEmpty(form.dateDay)) {
        errors.dateDay = true;
      }

      if (generalHelper.isThisUndefinedOrEmpty(form.dateMonth)) {
        errors.dateMonth = true;
      }

      if (generalHelper.isThisUndefinedOrEmpty(form.dateYear)) {
        errors.dateYear = true;
      }
    } else if (!generalHelper.isDateValid(form.dateDay, form.dateMonth, form.dateYear)) {
      if (!generalHelper.isDateDayValid(form.dateDay, form.dateMonth, form.dateYear)) {
        errors.dateDay = true;
      }
      if (!generalHelper.isDateMonthValid(form.dateMonth)) {
        errors.dateMonth = true;
      }

      if (!generalHelper.isDateYearValid(form.dateYear)) {
        errors.dateYear = true;
      }

      if (errors.dateDay || errors.dateMonth || errors.dateYear) {
        errors.date = {
          text: i18n.t('date-of-death:fields.date.errors.format'),
        };
      }
    } else if (generalHelper.isDateAfterToday(form.dateDay, form.dateMonth, form.dateYear)) {
      errors.date = {
        text: i18n.t('date-of-death:fields.date.errors.future'),
      };
    }

    if (!statusValidator.validStatus(form.verification)) {
      errors.verification = {
        text: i18n.t('date-of-death:fields.verification.errors.required'),
      };
    }

    return errors;
  },
  dateOfDeathVerify(form) {
    const errors = [];

    if (!generalHelper.checkIfYesOrNo(form.verify)) {
      errors.verify = {
        text: i18n.t('verify-date-of-death:fields.verify.errors.required'),
      };
    }

    return errors;
  },
  dateOfDeathVerifiedValidation(form) {
    const errors = [];

    if (generalHelper.isThisUndefinedOrEmpty(form.dateDay) && generalHelper.isThisUndefinedOrEmpty(form.dateMonth) && generalHelper.isThisUndefinedOrEmpty(form.dateYear)) {
      errors.date = {
        text: i18n.t('verified-date-of-death:fields.date.errors.required'),
      };
      errors.dateDay = true;
      errors.dateMonth = true;
      errors.dateYear = true;
    } else if (generalHelper.isThisUndefinedOrEmpty(form.dateDay) || generalHelper.isThisUndefinedOrEmpty(form.dateMonth) || generalHelper.isThisUndefinedOrEmpty(form.dateYear)) {
      errors.date = {
        text: i18n.t('verified-date-of-death:fields.date.errors.incomplete'),
      };
      if (generalHelper.isThisUndefinedOrEmpty(form.dateDay)) {
        errors.dateDay = true;
      }

      if (generalHelper.isThisUndefinedOrEmpty(form.dateMonth)) {
        errors.dateMonth = true;
      }

      if (generalHelper.isThisUndefinedOrEmpty(form.dateYear)) {
        errors.dateYear = true;
      }
    } else if (!generalHelper.isDateValid(form.dateDay, form.dateMonth, form.dateYear)) {
      if (!generalHelper.isDateDayValid(form.dateDay, form.dateMonth, form.dateYear)) {
        errors.dateDay = true;
      }
      if (!generalHelper.isDateMonthValid(form.dateMonth)) {
        errors.dateMonth = true;
      }

      if (!generalHelper.isDateYearValid(form.dateYear)) {
        errors.dateYear = true;
      }

      if (errors.dateDay || errors.dateMonth || errors.dateYear) {
        errors.date = {
          text: i18n.t('verified-date-of-death:fields.date.errors.format'),
        };
      }
    } else if (generalHelper.isDateAfterToday(form.dateDay, form.dateMonth, form.dateYear)) {
      errors.date = {
        text: i18n.t('verified-date-of-death:fields.date.errors.future'),
      };
    }

    return errors;
  },
  updatePaymentStatus(form, detail) {
    const errors = [];
    if (generalHelper.isThisUndefinedOrEmpty(form.statusUpdate)) {
      if (!generalHelper.checkIfYesOrNo(form.statusUpdate)) {
        errors.statusUpdate = {
          text: i18n.t(`payment-status:fields.${detail.changeType}.errors.required`),
        };
      }
    }
    return errors;
  },
  deathDapNameValidation(form) {
    const errors = [];
    if (generalHelper.isThisUndefinedOrEmpty(form.name)) {
      errors.name = {
        text: i18n.t('death-dap:fields.name.errors.required'),
      };
    } else if (!generalHelper.checkNameCharacters(form.name)) {
      errors.name = {
        text: i18n.t('death-dap:fields.name.errors.invalid'),
      };
    } else if (generalHelper.checkIfGreaterThenOneHundredAndForty(form.name)) {
      errors.name = {
        text: i18n.t('death-dap:fields.name.errors.length'),
      };
    }
    return errors;
  },
  deathDapPhoneNumberValidation(form) {
    const errors = [];
    if (generalHelper.isThisUndefinedOrEmpty(form.phoneNumber)) {
      errors.phoneNumber = {
        text: i18n.t('death-dap:fields.phone-number.errors.required'),
      };
    } else if (generalHelper.checkIfValidTelephoneNumberWithSpaces(form.phoneNumber)) {
      errors.phoneNumber = {
        text: i18n.t('death-dap:fields.phone-number.errors.invalid'),
      };
    } else if (generalHelper.checkIfGreaterThenSeventy(form.phoneNumber)) {
      errors.phoneNumber = {
        text: i18n.t('death-dap:fields.phone-number.errors.length'),
      };
    }

    return errors;
  },
  reviewAwardEntitlementDateValidation(spDate, form) {
    const errors = [];

    if (generalHelper.isThisUndefinedOrEmpty(form.dateDay) && generalHelper.isThisUndefinedOrEmpty(form.dateMonth) && generalHelper.isThisUndefinedOrEmpty(form.dateYear)) {
      errors.date = {
        text: i18n.t('review-award-date:fields.date.errors.required'),
      };
      errors.dateDay = true;
      errors.dateMonth = true;
      errors.dateYear = true;
    } else if (generalHelper.isThisUndefinedOrEmpty(form.dateDay) || generalHelper.isThisUndefinedOrEmpty(form.dateMonth) || generalHelper.isThisUndefinedOrEmpty(form.dateYear)) {
      errors.date = {
        text: i18n.t('review-award-date:fields.date.errors.incomplete'),
      };
      if (generalHelper.isThisUndefinedOrEmpty(form.dateDay)) {
        errors.dateDay = true;
      }

      if (generalHelper.isThisUndefinedOrEmpty(form.dateMonth)) {
        errors.dateMonth = true;
      }

      if (generalHelper.isThisUndefinedOrEmpty(form.dateYear)) {
        errors.dateYear = true;
      }
    } else if (!generalHelper.isDateValid(form.dateDay, form.dateMonth, form.dateYear)) {
      if (!generalHelper.isDateDayValid(form.dateDay, form.dateMonth, form.dateYear)) {
        errors.dateDay = true;
      }
      if (!generalHelper.isDateMonthValid(form.dateMonth)) {
        errors.dateMonth = true;
      }

      if (!generalHelper.isDateYearValid(form.dateYear)) {
        errors.dateYear = true;
      }

      if (errors.dateDay || errors.dateMonth || errors.dateYear) {
        errors.date = {
          text: i18n.t('review-award-date:fields.date.errors.format'),
        };
      }
    } else if (generalHelper.isDateBeforeDate(spDate, form.dateDay, form.dateMonth, form.dateYear)) {
      errors.date = {
        text: i18n.t('review-award-date:fields.date.errors.before'),
      };
    } else if (generalHelper.isDateAfterToday(form.dateDay, form.dateMonth, form.dateYear)) {
      errors.date = {
        text: i18n.t('review-award-date:fields.date.errors.after'),
      };
    }
    return errors;
  },
  payeeAccountDetails(form) {
    const errors = [];

    if (form.accountName === '' || form.accountName === undefined) {
      errors.accountName = {
        text: i18n.t('payee-account:fields.accountName.errors.required'),
      };
    } else if (!generalHelper.checkSurnameCharactersAndAmpersand(form.accountName)) {
      errors.accountName = {
        text: i18n.t('payee-account:fields.accountName.errors.format'),
      };
    } else if (generalHelper.checkIfGreaterThenSeventy(form.accountName)) {
      errors.accountName = {
        text: i18n.t('payee-account:fields.accountName.errors.length'),
      };
    }

    if (form.accountNumber === '' || form.accountNumber === undefined) {
      errors.accountNumber = {
        text: i18n.t('payee-account:fields.accountNumber.errors.required'),
      };
    } else if (!validator.isNumeric(form.accountNumber)) {
      errors.accountNumber = {
        text: i18n.t('payee-account:fields.accountNumber.errors.format'),
      };
    } else if (form.accountNumber.length !== validAccountNumberLength) {
      errors.accountNumber = {
        text: i18n.t('payee-account:fields.accountNumber.errors.length'),
      };
    }
    const sortCode = generalHelper.removeSpacesAndHyphens(form.sortCode);
    if (form.sortCode === '' || form.sortCode === undefined) {
      errors.sortCode = {
        text: i18n.t('payee-account:fields.sortCode.errors.required'),
      };
    } else if (!validator.isNumeric(sortCode)) {
      errors.sortCode = {
        text: i18n.t('payee-account:fields.sortCode.errors.format'),
      };
    } else if (sortCode.length !== validSortCodeLength) {
      errors.sortCode = {
        text: i18n.t('payee-account:fields.sortCode.errors.length'),
      };
    }

    if (form.referenceNumber !== '' && form.referenceNumber !== undefined) {
      if (!generalHelper.checkIfValidRollNumber(form.referenceNumber)) {
        errors.referenceNumber = {
          text: i18n.t('payee-account:fields.referenceNumber.errors.format'),
        };
      } else if (form.referenceNumber.length > maxRollLength) {
        errors.referenceNumber = {
          text: i18n.t('payee-account:fields.referenceNumber.errors.length'),
        };
      }
    }
    return errors;
  },
  maritalStatus(form, currentMaritalStatus) {
    const errors = [];
    if (form === undefined || form.maritalStatus === '' || form.maritalStatus === undefined || !generalHelper.checkIfValidMaritalStatusByStatus(form.maritalStatus, currentMaritalStatus)) {
      errors.maritalStatus = {
        text: i18n.t('marital-status:fields.status.errors.required'),
      };
    }
    return errors;
  },
  maritalDate(form, maritalStatus) {
    const errors = [];

    if (generalHelper.isThisUndefinedOrEmpty(form.dateDay) && generalHelper.isThisUndefinedOrEmpty(form.dateMonth) && generalHelper.isThisUndefinedOrEmpty(form.dateYear)) {
      errors.date = {
        text: i18n.t(`marital-date:fields.date.errors.${maritalStatus}.required`),
      };
      errors.dateDay = true;
      errors.dateMonth = true;
      errors.dateYear = true;
    } else if (generalHelper.isThisUndefinedOrEmpty(form.dateDay) || generalHelper.isThisUndefinedOrEmpty(form.dateMonth) || generalHelper.isThisUndefinedOrEmpty(form.dateYear)) {
      errors.date = {
        text: i18n.t(`marital-date:fields.date.errors.${maritalStatus}.format`),
      };
      if (generalHelper.isThisUndefinedOrEmpty(form.dateDay)) {
        errors.dateDay = true;
      }

      if (generalHelper.isThisUndefinedOrEmpty(form.dateMonth)) {
        errors.dateMonth = true;
      }

      if (generalHelper.isThisUndefinedOrEmpty(form.dateYear)) {
        errors.dateYear = true;
      }
    } else if (!generalHelper.isDateValid(form.dateDay, form.dateMonth, form.dateYear)) {
      if (!generalHelper.isDateDayValid(form.dateDay, form.dateMonth, form.dateYear)) {
        errors.dateDay = true;
      }
      if (!generalHelper.isDateMonthValid(form.dateMonth)) {
        errors.dateMonth = true;
      }

      if (!generalHelper.isDateYearValid(form.dateYear)) {
        errors.dateYear = true;
      }

      if (errors.dateDay || errors.dateMonth || errors.dateYear) {
        errors.date = {
          text: i18n.t(`marital-date:fields.date.errors.${maritalStatus}.format`),
        };
      }
    } else if (generalHelper.isDateAfterToday(form.dateDay, form.dateMonth, form.dateYear)) {
      errors.date = {
        text: i18n.t(`marital-date:fields.date.errors.${maritalStatus}.future`),
      };
    }

    if (!statusValidator.validStatus(form.verification)) {
      errors.verification = {
        text: i18n.t(`marital-date:fields.verification.errors.${maritalStatus}.required`),
      };
    }

    return errors;
  },
};
