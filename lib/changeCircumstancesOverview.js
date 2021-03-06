const i18n = require('i18next');
const dateHelper = require('./dateHelper');
const deathHelper = require('./helpers/deathHelper');
const generalHelper = require('./helpers/general');
const maritalStatusHelper = require('./helpers/maritalStatusHelper');

function maritalStatusTransformer(martialStatus) {
  const statusLower = maritalStatusHelper.transformToShortStatus(martialStatus);
  return i18n.t(`marital-details:details.summary.values.status.${statusLower}`);
}

function showMaritalStatusDetails(martialStatus) {
  return martialStatus !== 'Single';
}

function enableStopStatePension(status) {
  return !new RegExp('^(?:DEAD|DEADNOTVERIFIED|DEFERRED)$').test(status);
}

function arrearsPaymentDue(details) {
  return details.deathAllActionsPerformed === false
    && details.deathCalculationPerformed === true
    && details.deathDetail
    && details.deathDetail.amountDetails
    && deathHelper.deathPaymentStatus(details.deathDetail.amountDetails.amount) === 'ARREARS'
    && details.deathDetail.payeeDetails;
}

function dateOfDeathIsNotVerified(details) {
  return details.deathDetail && details.deathDetail.payeeDetails && details.deathDetail.dateOfDeathVerification === 'NV';
}

function awaitingDapDetails(details) {
  return details.awardStatus === 'DEAD'
    && details.deathAllActionsPerformed === false
    && details.deathDetail
    && details.deathDetail.dateOfDeathVerification === 'V'
    && !details.deathDetail.payeeDetails;
}

function awaitingVerificationAndDapDetails(details) {
  return details.awardStatus === 'DEADNOTVERIFIED'
    && details.deathAllActionsPerformed === false
    && details.deathDetail
    && !details.deathDetail.payeeDetails
    && details.deathDetail.dateOfDeathVerification === 'NV';
}

function warningText(details) {
  const deathBaseUrl = '/changes-and-enquiries/personal/death';
  const deathBaseLocale = 'personal:warning-text.death';

  if (arrearsPaymentDue(details)) {
    const deathArrearsAmount = generalHelper.formatCurrency(Math.abs(details.deathDetail.amountDetails.amount));
    const html = i18n.t(`${deathBaseLocale}.arrears-payment-due`, { AMOUNT: deathArrearsAmount, URL: `${deathBaseUrl}/payee-details` });
    return { html };
  }

  if (dateOfDeathIsNotVerified(details)) {
    const html = i18n.t(`${deathBaseLocale}.awaiting-verification`, { URL: `${deathBaseUrl}/verify` });
    return { html };
  }

  if (awaitingDapDetails(details)) {
    const html = i18n.t(`${deathBaseLocale}.awaiting-dap-details`, { URL: `${deathBaseUrl}/enter-person-dealing-with-the-estate-details` });
    return { html };
  }

  if (awaitingVerificationAndDapDetails(details)) {
    const html = i18n.t(`${deathBaseLocale}.awaiting-verification-and-dap-details`, { URL: `${deathBaseUrl}/are-you-able-to-verify-the-date-of-death` });
    return { html };
  }

  return null;
}

module.exports = {
  formatter(details) {
    const json = {
      fullName: `${details.firstName} ${details.surname}`,
      nino: this.nino(details.nino),
      dob: dateHelper.longDate(details.dob),
      statePensionDate: dateHelper.longDate(details.statePensionDate),
      maritalStatus: maritalStatusTransformer(details.maritalStatus),
      showMaritalStatusDetails: showMaritalStatusDetails(details.maritalStatus),
      enableStopStatePension: enableStopStatePension(details.awardStatus),
      warning: warningText(details),
    };

    if (generalHelper.isNotUndefinedEmptyOrNull(details.deathDetail)) {
      const { deathDetail } = details;
      if (generalHelper.isNotUndefinedEmptyOrNull(deathDetail.dateOfDeath)) {
        json.dateOfDeath = dateHelper.longDate(deathDetail.dateOfDeath);
      }
      if (generalHelper.isNotUndefinedEmptyOrNull(deathDetail.dateOfDeathVerification)) {
        json.dateOfDeathVerification = this.verification(deathDetail.dateOfDeathVerification);
      }
      if (generalHelper.isNotUndefinedEmptyOrNull(deathDetail.amountDetails)
        && generalHelper.isNotUndefinedEmptyOrNull(deathDetail.amountDetails.amount)
        && Math.sign(deathDetail.amountDetails.amount) > 0) {
        json.deathArrearsAmount = generalHelper.formatCurrency(Math.abs(deathDetail.amountDetails.amount));
      }
    }

    return json;
  },
  nino(string) {
    return string.replace(/(.{2})/g, '$1 ');
  },
  verification(status) {
    if (status === 'V') {
      return 'Verified';
    }
    return 'Not verified';
  },
};
