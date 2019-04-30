const dateHelper = require('./dateHelper');

/* istanbul ignore next */
module.exports = {
  formatter(details) {
    return {
      fullName: details.firstName && details.surname ? `${details.firstName} ${details.surname}` : null,
      nino: details.nino ? this.nino(details.nino) : null,
      status: details.status ? details.status : null,
      dateOfBirth: details.dateOfBirth ? `Date of birth: ${dateHelper.longDate(details.dateOfBirth)}` : null,
    };
  },
  nino(string) {
    return string.replace(/(.{2})/g, '$1 ');
  },
  formatterDob(details) {
    const formatDetails = JSON.parse(JSON.stringify(details));
    formatDetails.dateOfBirth = details.dob;
    delete formatDetails.status;
    return this.formatter(formatDetails);
  },
};
