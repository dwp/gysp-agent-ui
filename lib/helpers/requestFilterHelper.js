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
  partnerDob() {
    return ['dobDay', 'dobMonth', 'dobYear', 'dobVerified'];
  },
  deathPayeeName() {
    return ['name'];
  },
  deathPayeePhoneNumber() {
    return ['phoneNumber'];
  },
  deathPayeePostcode() {
    return ['postcode'];
  },
  deathPayeeAddress() {
    return ['address'];
  },
  dateOfBirthVerification() {
    return ['dateDay', 'dateMonth', 'dateYear', 'verification'];
  },
  maritalDateVerification() {
    return ['dateDay', 'dateMonth', 'dateYear', 'verification'];
  },
  maritalCheckInheritableStatePension() {
    return ['checkInheritableStatePension'];
  },
  maritalEntitledToInheritedStatePension() {
    return ['entitledInheritableStatePension'];
  },
  maritalRelevantInheritedAmounts() {
    return ['additionalPension', 'graduatedBenefit', 'basicExtraStatePension', 'additionalExtraStatePension', 'graduatedBenefitExtraStatePension', 'protectedPayment'];
  },
  maritalUpdateStatePensionAwardAmount() {
    return ['amount'];
  },
  name(request, name) {
    const object = {};
    object[`${name === 'first-name' ? 'firstName' : 'lastName'}`] = request;
    return object;
  },
};
