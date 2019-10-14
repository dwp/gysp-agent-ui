const dateHelper = require('./dateHelper');

/* istanbul ignore next */
module.exports = {
  formatter(details, displayStatus = true) {
    return {
      fullName: details.firstName && details.surname ? `${details.firstName} ${details.surname}` : null,
      nino: details.nino ? this.nino(details.nino) : null,
      status: this.status(details.awardStatus, displayStatus),
      dateOfBirth: details.dateOfBirth ? `Date of birth: ${dateHelper.longDate(details.dateOfBirth)}` : null,
    };
  },
  status(currentStatus, displayStatus) {
    if (!displayStatus) {
      return null;
    }

    let status;
    switch (currentStatus) {
    case 'DEAD':
      status = {
        text: 'DEAD',
        class: 'dead',
      };
      break;
    case 'DEADNOTVERIFIED':
      status = {
        text: 'DEAD - NOT VERIFIED',
        class: 'dead',
      };
      break;
    case 'PAYMENTSSTOPPED':
      status = {
        text: 'PAYMENTS STOPPED',
        class: 'payments-stopped',
      };
      break;
    default:
      status = {
        text: 'RECEIVING STATE PENSION',
        class: 'active',
      };
    }

    return status;
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
