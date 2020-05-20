const request = require('request-promise');
const generalHelper = require('../../lib/helpers/general');
const requestHelper = require('../../lib/requestHelper');
const dataStore = require('../../lib/dataStore');

const [CANNOT_CALCULATE, OVERPAYMENT, ARREARS, NOTHING_OWED] = ['CANNOT_CALCULATE', 'OVERPAYMENT', 'ARREARS', 'NOTHING_OWED'];

module.exports = {
  async payeeDetails(req, res, inviteKey, sessionData) {
    if (sessionData) {
      return false;
    }
    const details = await dataStore.cacheRetriveAndStore(req, 'death-payee-details', inviteKey, () => {
      const requestCall = requestHelper.generateGetCall(`${res.locals.agentGateway}api/award/death-payee-details/${inviteKey}`, {}, 'award');
      return request(requestCall);
    });
    return details;
  },
  deathPaymentStatus(amount) {
    let status = null;
    if (generalHelper.isThisDefined(amount)) {
      if (amount === null) {
        status = CANNOT_CALCULATE;
      } else if (Math.sign(amount) < 0) {
        status = OVERPAYMENT;
      } else if (Math.sign(amount) > 0) {
        status = ARREARS;
      } else {
        status = NOTHING_OWED;
      }
    }
    return status;
  },
  isCannotCalculate(status) {
    return status === CANNOT_CALCULATE;
  },
  isOverPayment(status) {
    return status === OVERPAYMENT;
  },
  isArrears(status) {
    return status === ARREARS;
  },
  isNothingOwed(status) {
    return status === NOTHING_OWED;
  },
};
