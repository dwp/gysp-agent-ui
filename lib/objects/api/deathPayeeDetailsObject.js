const generalHelper = require('../../helpers/general');

module.exports = {
  formatter(details, awardDetails) {
    const json = {
      accountName: details.accountName,
      accountNumber: details.accountNumber,
      sortCode: generalHelper.removeSpacesAndHyphens(details.sortCode),
      nino: awardDetails.nino,
    };

    if (generalHelper.isNotUndefinedEmptyOrNull(details.referenceNumber)) {
      json.referenceNumber = details.referenceNumber;
    }

    return json;
  },
};
