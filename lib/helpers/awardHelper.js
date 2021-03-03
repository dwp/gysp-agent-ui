const moment = require('moment');
const request = require('request-promise');

const dataStore = require('../../lib/dataStore');
const dateHelper = require('../../lib/dateHelper');
const maritalStatusHelper = require('../helpers/maritalStatusHelper');
const requestHelper = require('../../lib/requestHelper');
const stringHelper = require('../../lib/stringHelper');

function calculateTotal(award, updatedAward) {
  let total = 0;
  total += updatedAward.newStatePension || award.weeklyStatePensionAmount;
  total += updatedAward.protectedPayment || award.weeklyProtectedPaymentAmount;
  total += updatedAward.inheritedExtraStatePension || award.weeklyInheritedExtraStatePensionAmount;
  total += award.weeklyExtraStatePensionAmount;

  return total;
}

function formatUpdateAward(session) {
  const { amount: updatedNewStatePensionAmount } = session['update-state-pension-award-new-state-pension'] || Object.create(null);
  const { amount: updatedProtectedPaymentAmount } = session['update-state-pension-award-protected-payment'] || Object.create(null);
  const { amount: updatedInheritedExtraStatePensionAmount } = session['update-state-pension-award-inherited-extra-state-pension'] || Object.create(null);
  return {
    newStatePension: updatedNewStatePensionAmount ? Number(updatedNewStatePensionAmount) : null,
    protectedPayment: updatedProtectedPaymentAmount ? Number(updatedProtectedPaymentAmount) : null,
    inheritedExtraStatePension: updatedInheritedExtraStatePensionAmount ? Number(updatedInheritedExtraStatePensionAmount) : null,
  };
}

module.exports = {
  activeAward(awards, maritalSession) {
    if (maritalStatusHelper.isWidowed(maritalSession.maritalStatus) && maritalSession.widowedEntitlementDate) {
      return this.getActiveAwardOnDate(awards, moment(maritalSession.widowedEntitlementDate));
    }
    return this.returnActiveAwardAmounts(awards);
  },

  buildEntitlementDateApiUri(req) {
    const { claimFromDate: cfd, statePensionDate: spd, nino } = dataStore.get(req, 'awardDetails') || Object.create(null);
    const { dateYear, dateMonth, dateDay } = dataStore.get(req, 'date', 'marital') || Object.create(null);
    const claimFromDate = dateHelper.timestampToDateDash(cfd || spd);
    const entitlementDate = dateHelper.dateDash(`${dateYear}-${dateMonth}-${dateDay}`);
    const lastTwoNinoDigits = stringHelper.extractNumbers(nino).slice(-2);
    return {
      url: this.getEntitlementDateApiUri(entitlementDate, claimFromDate, lastTwoNinoDigits),
      cacheKey: `${entitlementDate}:${claimFromDate}:${lastTwoNinoDigits}`,
    };
  },

  currentAwardOrSession(award, session) {
    const updatedAward = formatUpdateAward(session);
    const total = calculateTotal(award, updatedAward);
    return {
      totalAmount: total,
      weeklyStatePensionAmount: updatedAward.newStatePension || award.weeklyStatePensionAmount,
      weeklyProtectedPaymentAmount: updatedAward.protectedPayment || award.weeklyProtectedPaymentAmount,
      weeklyExtraStatePensionAmount: award.weeklyExtraStatePensionAmount,
      weeklyInheritedExtraStatePensionAmount: updatedAward.inheritedExtraStatePension || award.weeklyInheritedExtraStatePensionAmount,
    };
  },

  getActiveAwardOnDate(awards, activeDate) {
    let activeAward = null;
    if (awards) {
      awards.forEach((award) => {
        const fromDate = moment(award.fromDate)
          .startOf('day');
        let toDate;
        if (award.toDate) {
          toDate = moment(award.toDate)
            .startOf('day');
        }
        if (activeDate.isSameOrAfter(fromDate) && (!toDate || activeDate.isSameOrBefore(toDate))) {
          if (activeAward) {
            // Should never happen - but just in case - prefer the award with no toDate
            if (!toDate) {
              activeAward = award;
            }
          } else {
            activeAward = award;
          }
        }
      });
    }
    return activeAward;
  },

  getEntitlementDate(req, res) {
    const { url, cacheKey } = this.buildEntitlementDateApiUri(req);
    return dataStore.cacheRetrieveAndStore(req, 'marital', cacheKey, () => {
      const awardCall = requestHelper.generateGetCall(res.locals.agentGateway + url, {}, 'award');
      return request(awardCall) || Object.create(null);
    });
  },

  getEntitlementDateApiUri(entitleDate, claimFromDate, ninoDigits) {
    return `api/award/entitlement-date?entitlementDate=${entitleDate}&claimFromDate=${claimFromDate}&ninoDigits=${ninoDigits}`;
  },

  returnActiveAwardAmounts(awardAmounts) {
    const amounts = awardAmounts.sort((a, b) => a.fromDate - b.fromDate);
    const inPayment = amounts.filter((item) => item.inPayment === true);
    if (inPayment.length > 0) {
      return inPayment[0];
    }
    return amounts[0];
  },
};
