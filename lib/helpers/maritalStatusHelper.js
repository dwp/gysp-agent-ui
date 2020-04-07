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
};
