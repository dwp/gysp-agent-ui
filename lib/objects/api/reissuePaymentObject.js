module.exports = {
  formatter(id, awardDetail) {
    const object = {
      id,
      inviteKey: awardDetail.inviteKey,
      eventName: 'payment-detail:timeline.reissueing',
      accountName: awardDetail.accountDetail.accountHolder,
      accountNumber: awardDetail.accountDetail.accountNumber,
      sortCode: awardDetail.accountDetail.sortCode,
    };
    if (awardDetail.accountDetail.referenceNumber) {
      object.referenceNumber = awardDetail.accountDetail.referenceNumber;
    }
    return object;
  },
};
