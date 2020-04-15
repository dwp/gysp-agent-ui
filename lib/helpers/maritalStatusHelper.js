const i18n = require('i18next');

const generalHelper = require('../helpers/general');

const marriedNewStatus = ['divorced', 'widowed'];
const civilNewStatus = ['dissolved', 'widowed'];

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
};
