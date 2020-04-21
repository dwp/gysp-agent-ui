const i18n = require('i18next');

const generalHelper = require('../helpers/general');

const singleNewStatus = ['civil', 'married'];
const marriedNewStatus = ['divorced', 'widowed'];
const civilNewStatus = ['dissolved', 'widowed'];

const statusRequirePartnerDetailsRegEx = '^(?:married|civil)$';

const validPartnerUrls = {
  married: 'spouse-details',
  civilPartnership: 'partner-details',
  none: 'date',
};

module.exports = {
  transformToShortStatus(status) {
    const statusLower = generalHelper.lowerCaseOrNull(status);
    if (statusLower === 'civil partnership') {
      return 'civil';
    }
    return statusLower;
  },
  transformToOriginalStatus(status) {
    if (status === 'civil') {
      return 'Civil Partnership';
    }
    return generalHelper.capitaliseFirstLetter(status);
  },
  newStatusOptions(status, selected) {
    const statusLower = this.transformToShortStatus(status);
    if (statusLower === 'single' || statusLower === 'dissolved' || statusLower === 'divorced' || statusLower === 'widowed') {
      return singleNewStatus.map((newStatus) => ({
        value: newStatus,
        text: i18n.t(`marital-status:fields.status.options.${newStatus}`),
        id: `maritalStatus-${newStatus}`,
        checked: selected === newStatus || false,
      }));
    }
    if (statusLower === 'married') {
      return marriedNewStatus.map((newStatus) => ({
        value: newStatus,
        text: i18n.t(`marital-status:fields.status.options.${newStatus}`),
        id: `maritalStatus-${newStatus}`,
        checked: selected === newStatus || false,
      }));
    }
    if (statusLower === 'civil') {
      return civilNewStatus.map((newStatus) => ({
        value: newStatus,
        text: i18n.t(`marital-status:fields.status.options.${newStatus}`),
        id: `maritalStatus-${newStatus}`,
        checked: selected === newStatus || false,
      }));
    }

    return null;
  },
  currentOrNewShortStatus(currentStatus, newStatus) {
    if (generalHelper.isNotUndefinedEmptyOrNull(newStatus)) {
      return this.transformToShortStatus(newStatus);
    }
    return this.transformToShortStatus(currentStatus);
  },
  maritalStatusBackHref(maritalStatus) {
    const statusLower = this.transformToShortStatus(maritalStatus);
    if (statusLower === 'single') {
      return '/personal';
    }
    return '/marital-details';
  },
  maritalDateBackHref(newMaritalStatus) {
    if (generalHelper.isNotUndefinedEmptyOrNull(newMaritalStatus)) {
      return '/marital-details/status';
    }
    return '/marital-details';
  },
  hasMaritalStatusChanged(currentStatus, newStatus) {
    if (!generalHelper.isNotUndefinedEmptyOrNull(newStatus)) {
      return false;
    }
    return currentStatus !== newStatus;
  },
  maritalDateSuccessAlert(currentStatus, newShortStatus, verification) {
    const currentShortStatus = this.transformToShortStatus(currentStatus);
    const verificationStatus = this.verificationStatusTransformer(verification);
    if (this.hasMaritalStatusChanged(currentShortStatus, newShortStatus)) {
      return i18n.t('marital-status:success-message');
    }
    return i18n.t(`marital-date:success-message.${currentShortStatus}.${verificationStatus}`);
  },
  verificationStatusTransformer(verification) {
    return verification === 'V' ? 'verified' : 'not-verified';
  },
  maritalDateButton(newMaritalStatus) {
    const continueStatusButtonCheck = new RegExp(statusRequirePartnerDetailsRegEx);
    if (continueStatusButtonCheck.test(newMaritalStatus)) {
      return i18n.t('app:button.continue');
    }
    return i18n.t('app:button.save');
  },
  newMaritalStatusRequiresPartnerDetails(newMaritalStatus) {
    const requirePartenrDetailsCheck = new RegExp(statusRequirePartnerDetailsRegEx);
    return requirePartenrDetailsCheck.test(newMaritalStatus);
  },
  redirectUrlBasedOnStatusPartner(newMaritalStatus) {
    if (newMaritalStatus === 'married') {
      return validPartnerUrls.married;
    }
    if (newMaritalStatus === 'civil') {
      return validPartnerUrls.civilPartnership;
    }
    return validPartnerUrls.none;
  },
};
