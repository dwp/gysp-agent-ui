const dateHelper = require('./dateHelper');

module.exports = {
  formatter(details) {
    const json = {
      fullName: `${details.firstName} ${details.surname}`,
      nino: this.nino(details.nino),
      dob: dateHelper.longDate(details.dob),
      statePensionDate: dateHelper.longDate(details.statePensionDate),
    };

    if (details.dateOfDeath) {
      json.dateOfDeath = dateHelper.longDate(details.dateOfDeath);
    }

    if (details.dateOfDeathVerification) {
      json.dateOfDeathVerification = this.verification(details.dateOfDeathVerification);
    }

    return json;
  },
  nino(string) {
    return string.replace(/(.{2})/g, '$1 ');
  },
  verification(status) {
    if (status === 'V') {
      return '<span class="govuk-!-font-size-16 govuk-!-font-weight-bold gysp-secondary-text-colour gysp-status gysp-status--active">Verified</span>';
    }
    return '<span class="govuk-!-font-size-16 govuk-!-font-weight-bold gysp-secondary-text-colour gysp-status gysp-status--inactive">Not verified</span>';
  },
};
