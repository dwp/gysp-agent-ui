const dateHelper = require('./dateHelper');
const generalHelper = require('./helpers/general');

module.exports = {
  formatter(details) {
    const json = {
      fullName: `${details.firstName} ${details.surname}`,
      nino: this.nino(details.nino),
      dob: dateHelper.longDate(details.dob),
      statePensionDate: dateHelper.longDate(details.statePensionDate),
      deathCalculationPerformed: details.deathCalculationPerformed,
      deathAllActionsPerformed: details.deathAllActionsPerformed,
    };
    if (details.dateOfDeath) {
      json.dateOfDeath = dateHelper.longDate(details.dateOfDeath);
    }

    if (generalHelper.isNotUndefinedEmptyOrNull(details.deathArrearsAmount) && Math.sign(details.deathArrearsAmount) > 0) {
      json.deathArrearsAmount = generalHelper.formatCurrency(Math.abs(details.deathArrearsAmount));
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
      return 'Verified';
    }
    return 'Not verified';
  },
};
