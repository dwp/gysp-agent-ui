const dateHelper = require('../../dateHelper');
const { isNotUndefinedEmptyOrNull } = require('../../helpers/general');
const maritalStatusHelper = require('../../helpers/maritalStatusHelper');

function maritalDateAndVerifcationTransformer(details, maritalShortStatus) {
  const maritalDate = `${dateHelper.dateDash(`${details.dateYear}-${details.dateMonth}-${details.dateDay}`)}T00:00:00.000Z`;
  const { verification } = details;
  switch (maritalShortStatus) {
  case 'married':
    return { marriageDate: maritalDate, marriageDateVerified: verification === 'V' };
  case 'civil':
    return { civilPartnershipDate: maritalDate, civilPartnershipDateVerified: verification === 'V' };
  default:
    return { };
  }
}

module.exports = {
  formatter(updatedEntitlementDetails, awardDetails) {
    const {
      'partner-nino': partnerNinoUpdate,
      'date-of-birth': dateOfBirthUpdate,
      'marital-date': maritalDateUpdate,
    } = updatedEntitlementDetails || Object.create(null);

    const {
      maritalStatus, maritalStatusVerified, nino, partnerDetail: currentPartnerDetail,
    } = awardDetails;

    const maritalObject = {
      eventCategory: null,
      eventName: null,
      eventType: null,
      maritalStatus,
      maritalStatusVerified,
      nino,
    };

    const status = maritalStatusHelper.transformToShortStatus(maritalStatus);

    let partnerDetail = currentPartnerDetail;
    if (isNotUndefinedEmptyOrNull(partnerNinoUpdate)) {
      partnerDetail.partnerNino = partnerNinoUpdate.partnerNino;
    }
    if (isNotUndefinedEmptyOrNull(dateOfBirthUpdate)) {
      partnerDetail.dob = `${dateHelper.dateDash(`${dateOfBirthUpdate.dateYear}-${dateOfBirthUpdate.dateMonth}-${dateOfBirthUpdate.dateDay}`)}T00:00:00.000Z`;
      partnerDetail.dobVerified = dateOfBirthUpdate.verification === 'V';
    }
    if (isNotUndefinedEmptyOrNull(maritalDateUpdate)) {
      const maritalDateAndVerifcation = maritalDateAndVerifcationTransformer(maritalDateUpdate, status);
      partnerDetail = { ...partnerDetail, ...maritalDateAndVerifcation };
    }

    maritalObject.partnerDetail = { ...partnerDetail };

    return maritalObject;
  },
};
