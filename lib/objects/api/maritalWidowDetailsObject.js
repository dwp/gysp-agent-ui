const moment = require('moment');
const { dateDash } = require('../../dateHelper');
const { isNotUndefinedEmptyOrNull } = require('../../helpers/general');
const awardHelper = require('../../../lib/helpers/awardHelper');
const maritalStatusHelper = require('../../helpers/maritalStatusHelper');

function currentOrNewAmount(currentAmount, newAmount) {
  if (isNotUndefinedEmptyOrNull(newAmount)) {
    return Number(newAmount);
  }
  return currentAmount;
}

function widowedAmounts({ awardAmounts }, formDetails) {
  // Current state pension values

  let activeAward;
  if (maritalStatusHelper.isWidowed(formDetails.maritalStatus) && formDetails.widowedEntitlementDate) {
    activeAward = awardHelper.getActiveAwardOnDate(awardAmounts, moment(formDetails.widowedEntitlementDate));
  } else {
    activeAward = awardHelper.returnActiveAwardAmounts(awardAmounts);
  }
  const {
    weeklyStatePensionAmount,
    weeklyProtectedPaymentAmount,
    weeklyInheritedExtraStatePensionAmount,
  } = activeAward;

  // Updated state pension form values
  const { amount: newStatePension } = formDetails['update-state-pension-award-new-state-pension'] || Object.create(null);
  const { amount: protectedPayment } = formDetails['update-state-pension-award-protected-payment'] || Object.create(null);
  const { amount: inheritedExtraStatePension } = formDetails['update-state-pension-award-inherited-extra-state-pension'] || Object.create(null);

  // Inherited form values
  const {
    additionalPension,
    graduatedBenefit,
    basicExtraStatePension,
    additionalExtraStatePension,
    graduatedBenefitExtraStatePension,
    protectedPayment: inheritedProtectedPayment,
  } = formDetails['relevant-inherited-amounts'] || Object.create(null);

  return {
    weeklyStatePensionAmount: currentOrNewAmount(weeklyStatePensionAmount, newStatePension),
    weeklyProtectedPaymentAmount: currentOrNewAmount(weeklyProtectedPaymentAmount, protectedPayment),
    weeklyInheritedExtraStatePensionAmount: currentOrNewAmount(weeklyInheritedExtraStatePensionAmount, inheritedExtraStatePension),
    additionalPensionAmount: isNotUndefinedEmptyOrNull(additionalPension) ? Number(additionalPension) : null,
    graduatedBenefitAmount: isNotUndefinedEmptyOrNull(graduatedBenefit) ? Number(graduatedBenefit) : null,
    basicPensionEspAmount: isNotUndefinedEmptyOrNull(basicExtraStatePension) ? Number(basicExtraStatePension) : null,
    additionalEspAmount: isNotUndefinedEmptyOrNull(additionalExtraStatePension) ? Number(additionalExtraStatePension) : null,
    graduatedBenefitEspAmount: isNotUndefinedEmptyOrNull(graduatedBenefitExtraStatePension) ? Number(graduatedBenefitExtraStatePension) : null,
    protectedPaymentInheritableAmount: isNotUndefinedEmptyOrNull(inheritedProtectedPayment) ? Number(inheritedProtectedPayment) : null,
  };
}

module.exports = {
  formatter(details, awardDetails, task = false) {
    const { date } = details;
    const { entitledInheritableStatePension } = details['entitled-to-inherited-state-pension'] || Object.create(null);

    // Common requestBody both task and change
    const commonRequestBody = {
      nino: awardDetails.nino,
      widowedDate: `${dateDash(`${date.dateYear}-${date.dateMonth}-${date.dateDay}`)}T00:00:00.000Z`,
      entitledInheritableStatePension: isNotUndefinedEmptyOrNull(entitledInheritableStatePension) ? entitledInheritableStatePension === 'yes' : null,
    };

    if (task) {
      return {
        ...commonRequestBody,
        widowedDateVerified: awardDetails.maritalStatusVerified,
        checkInheritableStatePension: true,
        widowedAmounts: entitledInheritableStatePension === 'yes' ? widowedAmounts(awardDetails, details) : null,
      };
    }

    const { checkInheritableStatePension } = details['check-for-inheritable-state-pension'];
    return {
      ...commonRequestBody,
      eventCategory: 'PERSONAL',
      eventType: 'CHANGE',
      eventName: 'personal:timeline.marital-status',
      widowedDateVerified: date.verification === 'V',
      checkInheritableStatePension: checkInheritableStatePension === 'yes',
      widowedAmounts: {
        ...widowedAmounts(awardDetails, details),
      },
    };
  },
};
