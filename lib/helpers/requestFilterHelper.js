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
};