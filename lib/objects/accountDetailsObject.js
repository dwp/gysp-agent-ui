const generalHelper = require('../helpers/general');

module.exports = {
  formatter(details, awardDetails) {
    const json = {
      accountName: details.accountName,
      accountNumber: details.accountNumber,
      sortCode: generalHelper.removeSpacesAndHyphens(details.sortCode),
      nino: awardDetails.nino,
    };

    if (details.referenceNumber !== '') {
      json.referenceNumber = details.referenceNumber;
    }
    json.eventCategory = 'PAYMENT';
    json.eventType = 'CHANGE';
    json.eventName = 'payment:timeline.banking_details.changed';

    return json;
  },
};
