const i18n = require('i18next');
const dateHelper = require('../../dateHelper');
const generalHelper = require('../../helpers/general');
const maritalStatusHelper = require('../../helpers/maritalStatusHelper');
const addressHelper = require('../../helpers/addressHelper');

function pageHeader(details) {
  const status = maritalStatusHelper.transformToShortStatus(details.maritalStatus);
  return i18n.t(`task-detail:header.${status}`);
}

function partnerDetailFormatter(details) {
  const { partnerDetail } = details;
  const formatted = {
    firstName: partnerDetail.firstName,
    surname: partnerDetail.surname,
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
    header: i18n.t(`task-detail:partner-details.header.${status}`),
    rows: [{
      key: { text: i18n.t('task-detail:partner-details.summary-keys.first-name'), classes: 'govuk-!-width-two-thirds' },
      value: { text: partnerDetail.firstName },
    }, {
      key: { text: i18n.t('task-detail:partner-details.summary-keys.surname'), classes: 'govuk-!-width-two-thirds' },
      value: { text: partnerDetail.surname },
    }, {
      key: { text: i18n.t('task-detail:partner-details.summary-keys.other-names'), classes: 'govuk-!-width-two-thirds' },
      value: { text: partnerDetail.allOtherNames },
    }, {
      key: { text: i18n.t('task-detail:partner-details.summary-keys.dob'), classes: 'govuk-!-width-two-thirds' },
      value: { text: partnerDetail.dob },
    }],
  };
}

function claimantDetailFormatter(details) {
  const formatted = {
    nino: generalHelper.formatNinoWithSpaces(details.nino),
    fullName: `${details.firstName} ${details.surname}`,
    address: addressHelper.address(details.residentialAddress).join('<br />'),
  };
  return formatted;
}

function claimantSummary(details) {
  const detail = claimantDetailFormatter(details);
  return {
    header: i18n.t('task-detail:claimant-details.header'),
    rows: [{
      key: { text: i18n.t('task-detail:claimant-details.summary-keys.nino'), classes: 'govuk-!-width-two-thirds' },
      value: { text: detail.nino },
    }, {
      key: { text: i18n.t('task-detail:claimant-details.summary-keys.full-name'), classes: 'govuk-!-width-two-thirds' },
      value: { text: detail.fullName },
    }, {
      key: { text: i18n.t('task-detail:claimant-details.summary-keys.address'), classes: 'govuk-!-width-two-thirds' },
      value: { html: detail.address },
    }],
  };
}

module.exports = {
  formatter(details) {
    return {
      header: pageHeader(details),
      partnerSummary: partnerSummary(details),
      claimantSummary: claimantSummary(details),
    };
  },
};
