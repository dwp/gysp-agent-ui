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
};
