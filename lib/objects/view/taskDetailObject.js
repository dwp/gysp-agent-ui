const i18n = require('i18next');
const { dateDashToLongDate, longDate } = require('../../dateHelper');
const { isNotUndefinedEmptyOrNull } = require('../../helpers/general');
const maritalStatusHelper = require('../../helpers/maritalStatusHelper');
const addressHelper = require('../../helpers/addressHelper');

function pageHeader(details) {
  const status = maritalStatusHelper.transformToShortStatus(details.maritalStatus);
  return i18n.t(`task-detail:header.${status}`);
}

function addOrChangeText(value) {
  if (isNotUndefinedEmptyOrNull(value)) {
    return i18n.t('app:link.change');
  }
  return i18n.t('app:link.add');
}

function statusIcon(status, field) {
  if (!isNotUndefinedEmptyOrNull(field)) {
    return '';
  }
  const cssClass = status ? 'active' : 'inactive';
  const text = i18n.t(`app:verification-status.${status ? 'verified' : 'not-verified'}`);
  return ` <span class="govuk-!-font-weight-bold govuk-!-padding-left-5 govuk-!-padding-right-2 gysp-secondary-text-colour gysp-status gysp-status--${cssClass}">
    ${text}
  </span>`;
}

function partnerDetailUpdatedFormatter(updateDetails) {
  const {
    'partner-nino': partnerNinoUpdate,
    'date-of-birth': dateOfBirth,
    'marital-date': maritalDate,
  } = updateDetails || Object.create(null);
  const details = Object.create(null);
  if (isNotUndefinedEmptyOrNull(partnerNinoUpdate) && partnerNinoUpdate.partnerNino) {
    details.updatedPartnerNino = partnerNinoUpdate.partnerNino;
  }
  if (isNotUndefinedEmptyOrNull(dateOfBirth)) {
    details.updatedDateOfBirth = `${dateOfBirth.dateYear}-${dateOfBirth.dateMonth}-${dateOfBirth.dateDay}`;
    details.updateDobVerified = dateOfBirth.verification === 'V';
  }
  if (isNotUndefinedEmptyOrNull(maritalDate)) {
    details.updatedMaritalDate = `${maritalDate.dateYear}-${maritalDate.dateMonth}-${maritalDate.dateDay}`;
    details.updatedMaritalVerified = maritalDate.verification === 'V';
  }
  return details;
}

function partnerDetailFormatter(details, updateDetails) {
  const {
    updatedPartnerNino, updatedDateOfBirth, updateDobVerified, updatedMaritalDate, updatedMaritalVerified,
  } = partnerDetailUpdatedFormatter(updateDetails);
  const { maritalStatus, maritalStatusVerified, partnerDetail: PD } = details;
  const maritalDate = maritalStatusHelper.maritalDate(PD, maritalStatus);
  const formatted = {
    nino: updatedPartnerNino || PD.partnerNino || '',
    firstName: PD.firstName,
    lastName: PD.surname,
    allOtherNames: PD.allOtherNames || '',
    dob: isNotUndefinedEmptyOrNull(PD.dob) ? longDate(PD.dob) : '',
    maritalDate: isNotUndefinedEmptyOrNull(updatedMaritalDate) ? dateDashToLongDate(updatedMaritalDate) : longDate(maritalDate),
    dobVerified: updateDobVerified || PD.dobVerified,
    maritalVerified: updatedMaritalVerified || maritalStatusVerified,
  };

  if (updatedDateOfBirth) {
    formatted.dob = dateDashToLongDate(updatedDateOfBirth);
  }

  return formatted;
}

function partnerSummary(details, updatedEntitlementDetails) {
  const status = maritalStatusHelper.transformToShortStatus(details.maritalStatus);
  const partnerDetail = partnerDetailFormatter(details, updatedEntitlementDetails);
  const summary = {
    header: i18n.t(`task-detail:partner-details.header.${status}`),
    rows: [{
      key: { text: i18n.t('task-detail:partner-details.summary-keys.nino') },
      value: { text: partnerDetail.nino },
      actions: {
        items: [{
          href: '/tasks/task/consider-entitlement/partner-nino',
          text: addOrChangeText(partnerDetail.nino),
          visuallyHiddenText: i18n.t('task-detail:partner-details.summary-keys.nino').toLowerCase(),
          classes: 'govuk-link--no-visited-state',
        }],
      },
    }, {
      key: { text: i18n.t('task-detail:partner-details.summary-keys.first-name') },
      value: { text: partnerDetail.firstName },
    }, {
      key: { text: i18n.t('task-detail:partner-details.summary-keys.last-name') },
      value: { text: partnerDetail.lastName },
    }, {
      key: { text: i18n.t('task-detail:partner-details.summary-keys.other-names') },
      value: { text: partnerDetail.allOtherNames },
    }, {
      key: { text: i18n.t('task-detail:partner-details.summary-keys.dob') },
      value: { html: `${partnerDetail.dob}${statusIcon(partnerDetail.dobVerified, partnerDetail.dob)}` },
    }, {
      key: { text: i18n.t(`task-detail:partner-details.summary-keys.marital-date.${status}`) },
      value: { html: `${partnerDetail.maritalDate}${statusIcon(partnerDetail.maritalVerified, partnerDetail.maritalDate)}` },
    }],
  };

  if (partnerDetail.dobVerified === false) {
    summary.rows[4].actions = {
      items: [{
        href: '/tasks/task/consider-entitlement/date-of-birth',
        text: addOrChangeText(partnerDetail.dob),
        visuallyHiddenText: i18n.t('task-detail:partner-details.summary-keys.dob').toLowerCase(),
        classes: 'govuk-link--no-visited-state',
      }],
    };
  }

  if (partnerDetail.maritalVerified === false) {
    summary.rows[5].actions = {
      items: [{
        href: '/tasks/task/consider-entitlement/marital-date',
        text: addOrChangeText(partnerDetail.maritalDate),
        visuallyHiddenText: i18n.t(`task-detail:partner-details.summary-keys.marital-date.${status}`).toLowerCase(),
        classes: 'govuk-link--no-visited-state',
      }],
    };
  }

  return summary;
}

function claimantDetailFormatter(details) {
  const formatted = {
    nino: details.nino,
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
      key: { text: i18n.t('task-detail:claimant-details.summary-keys.nino') },
      value: { text: detail.nino },
    }, {
      key: { text: i18n.t('task-detail:claimant-details.summary-keys.full-name') },
      value: { text: detail.fullName },
    }, {
      key: { text: i18n.t('task-detail:claimant-details.summary-keys.address') },
      value: { html: detail.address },
    }],
  };
}

module.exports = {
  formatter(details, updatedEntitlementDetails) {
    return {
      header: pageHeader(details),
      partnerSummary: partnerSummary(details, updatedEntitlementDetails),
      claimantSummary: claimantSummary(details),
    };
  },
};
