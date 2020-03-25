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

function detailsFormatter(details) {
  const status = maritalStatusHelper.transformToShortStatus(details.maritalStatus);
  return {
    status: i18n.t(`marital-details:details.summary.values.status.${status}`),
    dateLabel: i18n.t(`marital-details:details.summary.keys.date.${status}`),
    date: maritalDate(details.maritalStatus, details.partnerDetail),
  };
}

function partnerDetailFormatter(details) {
  const { partnerDetail } = details;
  const formatted = {
    firstName: partnerDetail.firstName || '',
    surname: partnerDetail.surname || '',
    allOtherNames: partnerDetail.allOtherNames || '',
    dob: '',
  };
  if (generalHelper.isNotUndefinedEmptyOrNull(partnerDetail.dob)) {
    formatted.dob = dateHelper.longDate(partnerDetail.dob);
  }
  return formatted;
}

function partnerSummary(details) {
  const status = maritalStatusHelper.transformToShortStatus(details.maritalStatus);
  const partnerDetail = partnerDetailFormatter(details);
  return {
    header: i18n.t(`marital-details:partner-details.header.${status}`),
    rows: [{
      key: { text: i18n.t('marital-details:partner-details.summary-keys.first-name'), classes: 'govuk-!-width-one-half' },
      value: { text: partnerDetail.firstName },
    }, {
      key: { text: i18n.t('marital-details:partner-details.summary-keys.surname'), classes: 'govuk-!-width-one-half' },
      value: { text: partnerDetail.surname },
    }, {
      key: { text: i18n.t('marital-details:partner-details.summary-keys.other-names'), classes: 'govuk-!-width-one-half' },
      value: { text: partnerDetail.allOtherNames },
    }, {
      key: { text: i18n.t('marital-details:partner-details.summary-keys.dob'), classes: 'govuk-!-width-one-half' },
      value: { text: partnerDetail.dob },
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
