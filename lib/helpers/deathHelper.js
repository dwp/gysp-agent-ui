const request = require('request-promise');
const i18n = require('i18next');
const generalHelper = require('../../lib/helpers/general');
const requestHelper = require('../../lib/requestHelper');
const dataStore = require('../../lib/dataStore');

const [CANNOT_CALCULATE, OVERPAYMENT, ARREARS, NOTHING_OWED, DEATH_NOT_VERIFIED] = ['CANNOT_CALCULATE', 'OVERPAYMENT', 'ARREARS', 'NOTHING_OWED', 'DEATH_NOT_VERIFIED'];
const localesKeys = {
  ARREARS: 'arrears',
  OVERPAYMENT: 'overpayment',
  NOTHING_OWED: 'nothing-owed',
};

const viewFilePath = {
  ARREARS: '/arrears',
  OVERPAYMENT: '/overpayment',
  NOTHING_OWED: '/nothing-owed',
};

const allSections = '^(?:retryCalc|verifiedDateOfDeathYes|reVerifiedDateOfDeath)$';
const verifyDateOfDeathSections = '^(?:verifiedDateOfDeathYes|reVerifiedDateOfDeath)$';

const deathVerification = {
  VERIFIED: 'V',
  NOT_VERIFIED: 'NV',
};

module.exports = {
  async payeeDetails(req, res, inviteKey, sessionData) {
    if (sessionData) {
      return false;
    }
    const details = await dataStore.cacheRetrieveAndStore(req, 'death-payee-details', inviteKey, () => {
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
  isCalDeathNotVerified(status) {
    return status === DEATH_NOT_VERIFIED;
  },
  isNullOrCannotCalculate(status) {
    if (status === null) {
      return true;
    }
    return status === CANNOT_CALCULATE;
  },
  isRetryCalc(section) {
    return section === 'retryCalc';
  },
  isOriginCanVerifyDateOfDeath(origin) {
    return origin === 'canVerifyDateOfDeath';
  },
  isAllSection(section) {
    return new RegExp(allSections).test(section);
  },
  isDateOfDeathSection(section) {
    return new RegExp(verifyDateOfDeathSections).test(section);
  },
  statusLocalesKey(status) {
    return localesKeys[status] || 'default';
  },
  successMessage(verification, status, section) {
    if (status === ARREARS) {
      return i18n.t('death-record:messages.success.arrears');
    }
    if (status === OVERPAYMENT) {
      if (section === 'retryCalc' || section === 'canVerifyDateOfDeath') {
        return i18n.t('death-record:messages.retryCalc.success.overpayment');
      }
      return i18n.t('death-record:messages.success.overpayment');
    }
    if (status === NOTHING_OWED) {
      if (section === 'retryCalc' || section === 'canVerifyDateOfDeath') {
        return i18n.t('death-record:messages.retryCalc.success.nothing-owed');
      }
      return i18n.t('death-record:messages.success.nothing-owed');
    }
    if (status === DEATH_NOT_VERIFIED && section === 'canVerifyDateOfDeath') {
      return i18n.t('death-record:messages.retryCalc.success.not-verified');
    }
    if (verification === 'V') {
      return i18n.t('death-record:messages.success.verified');
    }
    return i18n.t('death-record:messages.success.not-verified');
  },
  deathPaymentView(status) {
    const viewPath = 'pages/changes-enquiries/death/payment';
    return viewPath + (viewFilePath[status] || '/cannot-calculate');
  },
  isDapOnly(req) {
    if (req && req.session && req.session.death) {
      return dataStore.get(req, 'dapOnly', 'death') === true;
    }
    return false;
  },
  isDeathVerified(details) {
    const { deathDetail } = details || Object.create(null);
    if (deathDetail && deathDetail.dateOfDeathVerification === deathVerification.VERIFIED) {
      return true;
    }
    return false;
  },
  isDeathNotVerified(details) {
    const { deathDetail } = details || Object.create(null);
    if (deathDetail && deathDetail.dateOfDeathVerification === deathVerification.NOT_VERIFIED) {
      return true;
    }
    return false;
  },
};
