const dateHelper = require('../../dateHelper');
const generalHelper = require('../../helpers/general');
const maritalStatusHelper = require('../../helpers/maritalStatusHelper');

function buildPartnerDetail(details, maritalStatus, awardDetails) {
  const maritalDate = dateHelper.dateDash(`${details.dateYear}-${details.dateMonth}-${details.dateDay}`);
  const { partnerDetail } = awardDetails;

  if (maritalStatus === 'divorced') {
    if (generalHelper.isNotUndefinedEmptyOrNull(partnerDetail.marriageDate)) {
      partnerDetail.marriageDate = null;
    }
    partnerDetail.divorcedDate = `${maritalDate}T00:00:00.000Z`;
  }
  if (maritalStatus === 'widowed') {
    if (generalHelper.isNotUndefinedEmptyOrNull(partnerDetail.marriageDate)) {
      partnerDetail.marriageDate = null;
    }
    if (generalHelper.isNotUndefinedEmptyOrNull(partnerDetail.civilPartnershipDate)) {
      partnerDetail.civilPartnershipDate = null;
    }
    partnerDetail.widowedDate = `${maritalDate}T00:00:00.000Z`;
  }
  if (maritalStatus === 'dissolved') {
    if (generalHelper.isNotUndefinedEmptyOrNull(partnerDetail.civilPartnershipDate)) {
      partnerDetail.civilPartnershipDate = null;
    }
    partnerDetail.dissolvedDate = `${maritalDate}T00:00:00.000Z`;
  }

  return partnerDetail;
}

function addOrChange(value) {
  if (generalHelper.isNotUndefinedEmptyOrNull(value)) {
    return 'CHANGE';
  }
  return 'ADD';
}

function formatPartnerPersonalDetails(details, awardDetails) {
  const { partnerDetail } = awardDetails;
  const object = { ...partnerDetail };
  if (generalHelper.isNotUndefinedEmptyOrNull(details.partnerNino)) {
    object.partnerNino = details.partnerNino;
  }
  return object;
}

module.exports = {
  formatter(details, maritalStatus, awardDetails) {
    return {
      nino: awardDetails.nino,
      eventCategory: 'PERSONAL',
      eventType: 'CHANGE',
      eventName: 'personal:timeline.marital-status',
      maritalStatus: maritalStatusHelper.transformToOriginalStatus(maritalStatus),
      maritalStatusVerified: details.verification === 'V',
      partnerDetail: buildPartnerDetail(details, maritalStatus, awardDetails),
    };
  },
  partnerDetailFormatter(details, maritalShortStatus, awardDetails) {
    return {
      nino: awardDetails.nino,
      eventCategory: 'PERSONAL',
      eventType: addOrChange(awardDetails.partnerDetail.partnerNino),
      eventName: `personal:timeline.marital-partner.${maritalShortStatus}`,
      maritalStatus: awardDetails.maritalStatus,
      maritalStatusVerified: awardDetails.maritalStatusVerified,
      partnerDetail: formatPartnerPersonalDetails(details, awardDetails),
    };
  },
};
