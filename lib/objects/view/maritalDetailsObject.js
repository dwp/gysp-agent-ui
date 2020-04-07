const i18n = require('i18next');
const dateHelper = require('../../dateHelper');
const generalHelper = require('../../helpers/general');
const maritalStatusHelper = require('../../helpers/maritalStatusHelper');

function maritalDate(status, partnerDetail) {
  const statusTransformed = maritalStatusHelper.transformToShortStatus(status);
  let date;
  switch (statusTransformed) {
  case 'married':
    date = partnerDetail.marriageDate;
    break;
  case 'civil':
    date = partnerDetail.civilPartnershipDate;
    break;
  case 'divorced':
    date = partnerDetail.divorcedDate;
    break;
  case 'dissolved':
    date = partnerDetail.dissolvedDate;
    break;
  case 'widowed':
    date = partnerDetail.widowedDate;
    break;
  default:
    date = null;
  }
  return dateHelper.longDate(date);
}

function enableChange(status) {
  if (status === 'married' || status === 'civil') {
    return true;
  }
  return false;
}

function detailsFormatter(details) {
  const status = maritalStatusHelper.transformToShortStatus(details.maritalStatus);
  return {
    status: i18n.t(`marital-details:details.summary.values.status.${status}`),
    dateLabel: i18n.t(`marital-details:details.summary.keys.date.${status}`),
    date: maritalDate(details.maritalStatus, details.partnerDetail),
    maritalStatusVerified: details.maritalStatusVerified,
    enableChange: enableChange(status),
  };
}

function partnerDetailFormatter(details) {
  const { partnerDetail } = details;
  const formatted = {
    firstName: partnerDetail.firstName || '',
    surname: partnerDetail.surname || '',
    allOtherNames: partnerDetail.allOtherNames || '',
    dob: '',
    partnerNino: '',
  };
  if (generalHelper.isNotUndefinedEmptyOrNull(partnerDetail.dob)) {
    formatted.dob = dateHelper.longDate(partnerDetail.dob);
  }
  if (generalHelper.isNotUndefinedEmptyOrNull(partnerDetail.partnerNino)) {
    formatted.partnerNino = generalHelper.formatNinoWithSpaces(partnerDetail.partnerNino);
  }
  return formatted;
}

function addOrChangeText(value) {
  if (generalHelper.isNotUndefinedEmptyOrNull(value)) {
    return i18n.t('app:link.change');
  }
  return i18n.t('app:link.add');
}

function partnerSummary(details) {
  const status = maritalStatusHelper.transformToShortStatus(details.maritalStatus);
  const partnerDetail = partnerDetailFormatter(details);
  return {
    header: i18n.t(`marital-details:partner-details.header.${status}`),
    rows: [{
      key: { text: i18n.t('marital-details:partner-details.summary-keys.first-name'), classes: 'gysp-col-1' },
      value: { text: partnerDetail.firstName },
    }, {
      key: { text: i18n.t('marital-details:partner-details.summary-keys.surname'), classes: 'gysp-col-1' },
      value: { text: partnerDetail.surname },
    }, {
      key: { text: i18n.t('marital-details:partner-details.summary-keys.other-names'), classes: 'gysp-col-1' },
      value: { text: partnerDetail.allOtherNames },
    }, {
      key: { text: i18n.t('marital-details:partner-details.summary-keys.dob'), classes: 'gysp-col-1' },
      value: { text: partnerDetail.dob },
    }, {
      key: { text: i18n.t('marital-details:partner-details.summary-keys.nino'), classes: 'gysp-col-1' },
      value: { text: partnerDetail.partnerNino },
      actions: {
        items: [{
          href: '/changes-and-enquiries/marital-details/nino',
          text: addOrChangeText(partnerDetail.partnerNino),
          visuallyHiddenText: i18n.t('marital-details:partner-details.summary-keys.nino').toLowerCase(),
          classes: 'govuk-link--no-visited-state',
        }],
      },
    }],
  };
}

module.exports = {
  formatter(details) {
    if (!generalHelper.isNotUndefinedEmptyOrNull(details.partnerDetail)) {
      return null;
    }
    return {
      details: detailsFormatter(details),
      partnerSummary: partnerSummary(details),
    };
  },
};
