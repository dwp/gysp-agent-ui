const moment = require('moment');
const stringHelper = require('./stringHelper');

function humanReadableDate(date) {
  return moment(date).format('DD MM YYYY');
}

function formatPartnerDetail(detail) {
  const formettedDetails = detail;
  if (detail.dob) {
    formettedDetails.dob = humanReadableDate(detail.dob);
  }

  if (detail.civilPartnershipDate) {
    formettedDetails.civilPartnershipDate = humanReadableDate(detail.civilPartnershipDate);
  }

  if (detail.marriageDate) {
    formettedDetails.marriageDate = humanReadableDate(detail.marriageDate);
  }

  if (detail.divorcedDate) {
    formettedDetails.divorcedDate = humanReadableDate(detail.divorcedDate);
  }

  if (detail.dissolvedDate) {
    formettedDetails.dissolvedDate = humanReadableDate(detail.dissolvedDate);
  }

  return formettedDetails;
}

function formatTitle(title) {
  return stringHelper.uppercaseFirstLetter(title.toLowerCase());
}

function buildFilename(details) {
  return `sp claim ${details.createdDate} ${details.inviteKey}.pdf`;
}

module.exports = {
  formatter(details) {
    const json = Object.assign({}, details);
    json.confirmedAddress = json.confirmedAddress === true ? 'Yes' : 'No';
    json.livedAbroad = json.livedAbroad === true ? 'Yes' : 'No';
    json.workedAbroad = json.workedAbroad === true ? 'Yes' : 'No';
    json.declaration = json.declaration === true ? 'Yes' : 'No';
    json.createdDate = humanReadableDate(json.createdDate);
    json.customerDetail.title = formatTitle(json.customerDetail.title);
    json.customerDetail.createdDate = humanReadableDate(json.customerDetail.createdDate);
    json.customerDetail.dob = humanReadableDate(json.customerDetail.dob);
    json.customerDetail.statePensionDate = humanReadableDate(json.customerDetail.statePensionDate);

    if (json.partnerDetail) {
      json.partnerDetail = formatPartnerDetail(json.partnerDetail);
    }
    if (json.reCalculatedSpaDate) {
      json.reCalculatedSpaDate = humanReadableDate(json.reCalculatedSpaDate);
    }
    if (json.userAssertedDob) {
      json.userAssertedDob = humanReadableDate(json.userAssertedDob);
    }

    json.pdfFilename = buildFilename(json);

    return json;
  },
};
