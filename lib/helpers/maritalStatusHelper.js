const i18n = require('i18next');

const { lowerCaseOrNull, capitaliseFirstLetter, isNotUndefinedEmptyOrNull } = require('../helpers/general');
const { dateComponents } = require('../dateHelper');

const singleNewStatus = ['civil', 'married'];
const marriedNewStatus = ['divorced', 'widowed'];
const civilNewStatus = ['dissolved', 'widowed'];

const statusRequirePartnerDetailsRegEx = '^(?:married|civil)$';
const statusDisplayContinueButtonRegEx = '^(?:married|civil|widowed)$';

const validPartnerUrls = {
  married: 'spouse-details',
  civilPartnership: 'partner-details',
  none: 'date',
};

module.exports = {
  transformToShortStatus(status) {
    const statusLower = lowerCaseOrNull(status);
    if (statusLower === 'civil partnership') {
      return 'civil';
    }
    return statusLower;
  },
  transformToOriginalStatus(status) {
    if (status === 'civil') {
      return 'Civil Partnership';
    }
    return capitaliseFirstLetter(status);
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
    if (isNotUndefinedEmptyOrNull(newStatus)) {
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
    if (isNotUndefinedEmptyOrNull(newMaritalStatus)) {
      return '/marital-details/status';
    }
    return '/marital-details';
  },
  hasMaritalStatusChanged(currentStatus, newStatus) {
    if (!isNotUndefinedEmptyOrNull(newStatus)) {
      return false;
    }
    return currentStatus !== newStatus;
  },
  maritalDateSuccessAlert(currentStatus, newShortStatus, verification, awardUpdated = false) {
    const currentShortStatus = this.transformToShortStatus(currentStatus);
    const verificationStatus = this.verificationStatusTransformer(verification);
    if (this.hasMaritalStatusChanged(currentShortStatus, newShortStatus)) {
      if (awardUpdated) {
        return i18n.t('marital-status:success-message-award');
      }
      return i18n.t('marital-status:success-message');
    }
    return i18n.t(`marital-date:success-message.${currentShortStatus}.${verificationStatus}`);
  },
  verificationStatusTransformer(verification) {
    return verification === 'V' ? 'verified' : 'not-verified';
  },
  maritalDateButton(newMaritalStatus, widowInheritanceFeature) {
    const continueStatusButtonCheck = widowInheritanceFeature ? new RegExp(statusDisplayContinueButtonRegEx) : new RegExp('^(?:married|civil)$');
    if (continueStatusButtonCheck.test(newMaritalStatus)) {
      return i18n.t('app:button.continue');
    }
    return i18n.t('app:button.save');
  },
  newMaritalStatusRequiresPartnerDetails(newMaritalStatus) {
    const requirePartenrDetailsCheck = new RegExp(statusRequirePartnerDetailsRegEx);
    return requirePartenrDetailsCheck.test(newMaritalStatus);
  },
  isWidowed(status) {
    return status === 'widowed';
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
  maritalDateToComponents(partnerDetail, status) {
    const statusLower = lowerCaseOrNull(status);
    if (statusLower === 'married' && isNotUndefinedEmptyOrNull(partnerDetail.marriageDate)) {
      return dateComponents(partnerDetail.marriageDate, null);
    }
    if (statusLower === 'civil partnership' && isNotUndefinedEmptyOrNull(partnerDetail.civilPartnershipDate)) {
      return dateComponents(partnerDetail.civilPartnershipDate, null);
    }
    if (statusLower === 'divorced' && isNotUndefinedEmptyOrNull(partnerDetail.divorcedDate)) {
      return dateComponents(partnerDetail.divorcedDate, null);
    }
    if (statusLower === 'dissolved' && isNotUndefinedEmptyOrNull(partnerDetail.dissolvedDate)) {
      return dateComponents(partnerDetail.dissolvedDate, null);
    }
    if (statusLower === 'widowed' && isNotUndefinedEmptyOrNull(partnerDetail.widowedDate)) {
      return dateComponents(partnerDetail.widowedDate, null);
    }
    return false;
  },
  maritalDate(partnerDetail, status) {
    const statusLower = lowerCaseOrNull(status);
    if (statusLower === 'married' && isNotUndefinedEmptyOrNull(partnerDetail.marriageDate)) {
      return partnerDetail.marriageDate;
    }
    if (statusLower === 'civil partnership' && isNotUndefinedEmptyOrNull(partnerDetail.civilPartnershipDate)) {
      return partnerDetail.civilPartnershipDate;
    }
    if (statusLower === 'divorced' && isNotUndefinedEmptyOrNull(partnerDetail.divorcedDate)) {
      return partnerDetail.divorcedDate;
    }
    if (statusLower === 'dissolved' && isNotUndefinedEmptyOrNull(partnerDetail.dissolvedDate)) {
      return partnerDetail.dissolvedDate;
    }
    if (statusLower === 'widowed' && isNotUndefinedEmptyOrNull(partnerDetail.widowedDate)) {
      return partnerDetail.widowedDate;
    }
    return false;
  },
};
