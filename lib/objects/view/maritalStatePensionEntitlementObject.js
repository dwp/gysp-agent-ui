const i18n = require('i18next');
const { longDate } = require('../../dateHelper');
const { isNotUndefinedEmptyOrNull, formatNinoWithSpaces } = require('../../helpers/general');
const { transformToShortStatus, maritalDate } = require('../../helpers/maritalStatusHelper');
const { residentialAddress: address } = require('../../helpers/addressHelper');

const verificationStatusIcon = require('../../../utils/verificationStatusIcon');

function partnerSummary(details) {
  const { maritalStatus, partnerDetail } = details;
  const status = transformToShortStatus(maritalStatus);
  const {
    firstName, surname, partnerNino, allOtherNames, dob,
  } = partnerDetail || Object.create(null);
  const summary = {
    header: i18n.t(`marital-state-pension-entitlement:summary-header-1.${status}`),
    rows: [{
      key: { text: i18n.t('marital-state-pension-entitlement:summary-keys.first-name') },
      value: { text: firstName },
    }, {
      key: { text: i18n.t('marital-state-pension-entitlement:summary-keys.last-name') },
      value: { text: surname },
    }],
  };

  if (isNotUndefinedEmptyOrNull(partnerNino)) {
    // add to start of array as nino is first row in summary
    summary.rows.unshift({
      key: { text: i18n.t('marital-state-pension-entitlement:summary-keys.nino') },
      value: { text: formatNinoWithSpaces(partnerNino) },
    });
  }

  if (isNotUndefinedEmptyOrNull(allOtherNames)) {
    summary.rows.push({
      key: { text: i18n.t('marital-state-pension-entitlement:summary-keys.other-names') },
      value: { text: allOtherNames },
    });
  }

  if (isNotUndefinedEmptyOrNull(dob)) {
    summary.rows.push({
      key: { text: i18n.t('marital-state-pension-entitlement:summary-keys.dob') },
      value: { text: longDate(dob) },
    });
  }

  return summary;
}

function otherDetailsSummary(details) {
  const {
    maritalStatus, maritalStatusVerified, partnerDetail, residentialAddress,
  } = details;
  const status = transformToShortStatus(maritalStatus);
  const mDate = maritalDate(partnerDetail, maritalStatus);
  const summary = {
    header: i18n.t(`marital-state-pension-entitlement:summary-header-2.${status}`),
    rows: [{
      key: { text: i18n.t(`marital-state-pension-entitlement:summary-keys.marital-date.${status}`) },
      value: { html: `${longDate(mDate)}${verificationStatusIcon(maritalStatusVerified)}`, classes: 'govuk-!-padding-right-0' },
    }, {
      key: { text: i18n.t('marital-state-pension-entitlement:summary-keys.address') },
      value: { html: address(residentialAddress).join('<br />') },
    }],
  };

  return summary;
}

module.exports = {
  formatter(details) {
    if (!isNotUndefinedEmptyOrNull(details.partnerDetail)) {
      return null;
    }
    return {
      partnerSummary: partnerSummary(details),
      otherDetailsSummary: otherDetailsSummary(details),
    };
  },
};
