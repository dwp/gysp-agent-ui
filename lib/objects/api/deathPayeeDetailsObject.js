module.exports = {
  formatter(details, awardDetails) {
    const json = {
      accountName: details.accountName,
      accountNumber: details.accountNumber,
      sortCode: details.sortCode,
      nino: awardDetails.nino,
    };

    if (details.referenceNumber !== '') {
      json.referenceNumber = details.referenceNumber;
    }

    return json;
  },
};
