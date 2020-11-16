const i18n = require('i18next');
const { dateDashToLongDate, longDate } = require('../../dateHelper');
const { isNotUndefinedEmptyOrNull, formatNinoWithSpaces } = require('../../helpers/general');
const maritalStatusHelper = require('../../helpers/maritalStatusHelper');
const addressHelper = require('../../helpers/addressHelper');

function pageHeader(workItemReason) {
  const workItemReasonLower = workItemReason.toLowerCase();
  return i18n.t(`task-detail:header.${workItemReasonLower}`);
}

function pageHint(workItemReason) {
  if (workItemReason === 'WIDOWED') {
    const workItemReasonLower = workItemReason.toLowerCase();
    return i18n.t(`task-detail:hint.${workItemReasonLower}`);
  }
  return false;
}

function buttonHref(workItemReason) {
  if (workItemReason === 'WIDOWED') {
    return '/tasks/task/consider-entitlement/entitled-to-any-inherited-state-pension';
  }
  return '/tasks/task/complete';
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
  const previousMarital = maritalStatusHelper.previousMaritalDate(PD);
  const formatted = {
    nino: isNotUndefinedEmptyOrNull(PD.partnerNino) ? formatNinoWithSpaces(PD.partnerNino) : '',
    firstName: PD.firstName,
    lastName: PD.surname,
    allOtherNames: PD.allOtherNames || '',
    dob: isNotUndefinedEmptyOrNull(PD.dob) ? longDate(PD.dob) : '',
    maritalDate: isNotUndefinedEmptyOrNull(updatedMaritalDate) ? dateDashToLongDate(updatedMaritalDate) : longDate(maritalDate),
    dobVerified: updateDobVerified || PD.dobVerified,
    maritalVerified: updatedMaritalVerified || maritalStatusVerified,
  };

  if (updatedPartnerNino) {
    formatted.nino = formatNinoWithSpaces(updatedPartnerNino);
  }

  if (updatedDateOfBirth) {
    formatted.dob = dateDashToLongDate(updatedDateOfBirth);
  }

  if (previousMarital) {
    const { status, date } = previousMarital;
    formatted.previousMarital = { status, date: longDate(date) };
  }

  return formatted;
}

function widowedMaritalStatus(partnerDetail, status) {
  const summary = {
    header: i18n.t(`task-detail:partner-details.header.${status}`),
    rows: [{
      key: { text: i18n.t('task-detail:partner-details.summary-keys.first-name') },
      value: { text: partnerDetail.firstName },
    }, {
      key: { text: i18n.t('task-detail:partner-details.summary-keys.last-name') },
      value: { text: partnerDetail.lastName },
    }],
    classes: 'gysp-widow-partner-details-summary',
  };

  if (partnerDetail.nino) {
    summary.rows.unshift({
      key: { text: i18n.t('task-detail:partner-details.summary-keys.nino') },
      value: { text: partnerDetail.nino },
    });
  }

  if (partnerDetail.allOtherNames) {
    summary.rows.push({
      key: { text: i18n.t('task-detail:partner-details.summary-keys.other-names') },
      value: { text: partnerDetail.allOtherNames },
    });
  }

  if (partnerDetail.dob) {
    summary.rows.push({
      key: { text: i18n.t('task-detail:partner-details.summary-keys.dob') },
      value: { text: partnerDetail.dob },
    });
  }

  if (partnerDetail.previousMarital) {
    summary.rows.push({
      key: { text: i18n.t(`task-detail:partner-details.summary-keys.marital-date.${partnerDetail.previousMarital.status}`) },
      value: { text: partnerDetail.previousMarital.date },
    });
  }

  return summary;
}

function otherMaritalStatus(partnerDetail, status) {
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

function partnerSummary(details, updatedEntitlementDetails) {
  const status = maritalStatusHelper.transformToShortStatus(details.maritalStatus);
  const partnerDetail = partnerDetailFormatter(details, updatedEntitlementDetails);

  if (status === 'widowed') {
    return widowedMaritalStatus(partnerDetail, status);
  }
  return otherMaritalStatus(partnerDetail, status);
}

function claimantDetailFormatter(details) {
  const formatted = {
    nino: formatNinoWithSpaces(details.nino),
    fullName: `${details.firstName} ${details.surname}`,
    address: addressHelper.address(details.residentialAddress).join('<br />'),
  };
  return formatted;
}

function claimantSummary(details) {
  const detail = claimantDetailFormatter(details);
  const status = maritalStatusHelper.transformToShortStatus(details.maritalStatus);
  const summary = {
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
  if (status === 'widowed') {
    summary.classes = 'gysp-widow-partner-details-summary';
  }
  return summary;
}

module.exports = {
  formatter(details, workItemReason, updatedEntitlementDetails) {
    return {
      backHref: '/task',
      header: pageHeader(workItemReason),
      hint: pageHint(workItemReason),
      summaryList: [
        partnerSummary(details, updatedEntitlementDetails),
        claimantSummary(details),
      ],
      buttonHref: buttonHref(workItemReason),
    };
  },
};
