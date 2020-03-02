const addressHelper = require('./helpers/addressHelper');

module.exports = {
  formatter(details) {
    return {
      address: addressHelper.address(details.residentialAddress),
      homeTelephoneNumber: details.contactDetail.homeTelephoneNumber,
      mobileTelephoneNumber: details.contactDetail.mobileTelephoneNumber,
      workTelephoneNumber: details.contactDetail.workTelephoneNumber,
      email: details.contactDetail.email,
    };
  },
};
