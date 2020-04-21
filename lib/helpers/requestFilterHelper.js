module.exports = {
  requestFilter(fields, request) {
    const object = {};
    let i = 0;
    while (fields[i]) {
      object[fields[i]] = request[fields[i]];
      i++;
    }
    return object;
  },
  deathDapName() {
    return ['name'];
  },
  deathDapPhoneNumber() {
    return ['phoneNumber'];
  },
  deathDapPostcode() {
    return ['postcode'];
  },
  deathDapAddress() {
    return ['address'];
  },
  workItem() {
    return ['inviteKey', 'workItemReason'];
  },
  maritalStatus() {
    return ['maritalStatus'];
  },
  maritalDate() {
    return ['dateDay', 'dateMonth', 'dateYear', 'verification'];
  },
  partnerNino() {
    return ['partnerNino'];
  },
  maritalPartner() {
    return ['partnerNino', 'firstName', 'lastName', 'otherName', 'dobDay', 'dobMonth', 'dobYear'];
  },
};
