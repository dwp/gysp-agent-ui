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
  if (generalHelper.isNotUndefinedEmptyOrNull(details.dobDay, details.dobMonth, details.dobYear)) {
    const dob = `${dateHelper.dateDash(`${details.dobYear}-${details.dobMonth}-${details.dobDay}`)}T00:00:00.000Z`;
    object.dob = dob;
  }
  return object;
}

function maritalDateTransformer(details, maritalShortStatus) {
  const maritalDate = `${dateHelper.dateDash(`${details.dateYear}-${details.dateMonth}-${details.dateDay}`)}T00:00:00.000Z`;
  switch (maritalShortStatus) {
  case 'married':
    return { marriageDate: maritalDate };
  case 'civil':
    return { civilPartnershipDate: maritalDate };
  case 'divorced':
    return { divorcedDate: maritalDate };
  case 'dissolved':
    return { dissolvedDate: maritalDate };
  case 'widowed':
    return { widowedDate: maritalDate };
  default:
    return { };
  }
}

function allPartnerDetail(details, maritalData) {
  const maritalDate = maritalDateTransformer(maritalData.date, maritalData.maritalStatus);
  const partnerDetails = {
    firstName: details.firstName,
    surname: details.lastName,
    ...maritalDate,
  };
  if (!generalHelper.isThisUndefinedOrEmpty(details.otherName)) {
    partnerDetails.allOtherNames = details.otherName;
  }
  if (!generalHelper.isThisUndefinedOrEmpty(details.dobDay) && !generalHelper.isThisUndefinedOrEmpty(details.dobMonth) && !generalHelper.isThisUndefinedOrEmpty(details.dobYear)) {
    const dob = `${dateHelper.dateDash(`${details.dobYear}-${details.dobMonth}-${details.dobDay}`)}T00:00:00.000Z`;
    partnerDetails.dob = dob;
  }
  if (!generalHelper.isThisUndefinedOrEmpty(details.partnerNino)) {
    partnerDetails.partnerNino = details.partnerNino;
  }
  return partnerDetails;
}

module.exports = {
  formatter(details, maritalShortStatus, awardDetails) {
    const currentMaritalStatus = awardDetails.maritalStatus;
    const newMaritalStatus = maritalStatusHelper.transformToOriginalStatus(maritalShortStatus);
    const maritalObject = {
      nino: awardDetails.nino,
      eventCategory: 'PERSONAL',
      eventType: 'CHANGE',
      maritalStatusVerified: details.verification === 'V',
    };

    if (maritalStatusHelper.hasMaritalStatusChanged(currentMaritalStatus, newMaritalStatus)) {
      maritalObject.eventName = 'personal:timeline.marital-status';
      maritalObject.maritalStatus = newMaritalStatus;
      maritalObject.partnerDetail = buildPartnerDetail(details, maritalShortStatus, awardDetails);
    } else {
      const verification = maritalStatusHelper.verificationStatusTransformer(details.verification);
      maritalObject.eventName = `personal:timeline.marital-date.${maritalShortStatus}.${verification}`;
      maritalObject.maritalStatus = currentMaritalStatus;
      maritalObject.partnerDetail = { ...awardDetails.partnerDetail, ...maritalDateTransformer(details, maritalShortStatus) };
    }

    return maritalObject;
  },
  partnerDetailByItemFormatter(details, maritalShortStatus, awardDetails) {
    const maritalDetailObject = {
      nino: awardDetails.nino,
      eventCategory: 'PERSONAL',
      eventName: `personal:timeline.marital-partner.${maritalShortStatus}`,
      maritalStatus: awardDetails.maritalStatus,
      maritalStatusVerified: awardDetails.maritalStatusVerified,
      partnerDetail: formatPartnerPersonalDetails(details, awardDetails),
    };
    if (generalHelper.isNotUndefinedEmptyOrNull(details.partnerNino)) {
      maritalDetailObject.eventType = addOrChange(awardDetails.partnerDetail.partnerNino);
    }
    if (generalHelper.isNotUndefinedEmptyOrNull(details.dobDay, details.dobMonth, details.dobYear)) {
      maritalDetailObject.eventType = addOrChange(awardDetails.partnerDetail.dob);
    }
    return maritalDetailObject;
  },
  partnerDetailFormatter(details, maritalData, awardDetails) {
    const newMaritalStatus = maritalStatusHelper.transformToOriginalStatus(maritalData.maritalStatus);
    return {
      nino: awardDetails.nino,
      eventCategory: 'PERSONAL',
      eventType: 'CHANGE',
      eventName: 'personal:timeline.marital-status',
      maritalStatus: newMaritalStatus,
      maritalStatusVerified: maritalData.date.verification === 'V',
      partnerDetail: allPartnerDetail(details, maritalData),
    };
  },
};
