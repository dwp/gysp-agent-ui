const { dateDash } = require('../../dateHelper');
const { isNotUndefinedEmptyOrNull } = require('../../helpers/general');

function returnActiveAwardAmounts(awardAmounts) {
  const inPayment = awardAmounts.filter((item) => item.inPayment === true);
  if (inPayment.length > 0) {
    return inPayment[0];
  }
  return awardAmounts[0];
}

function currentOrNewAmount(currentAmount, newAmount) {
  if (isNotUndefinedEmptyOrNull(newAmount)) {
    return Number(newAmount);
  }
  return currentAmount;
}

function widowedAmounts({ awardAmounts }, formDetails) {
  // Current state pension values
  const {
    weeklyStatePensionAmount,
    weeklyProtectedPaymentAmount,
    weeklyInheritedExtraStatePensionAmount,
  } = returnActiveAwardAmounts(awardAmounts);

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
  formatter(details, awardDetails) {
    const { date } = details;
    const { checkInheritableStatePension } = details['check-for-inheritable-state-pension'];
    const { entitledInheritableStatePension } = details['entitled-to-inherited-state-pension'] || Object.create(null);

    return {
      nino: awardDetails.nino,
      eventCategory: 'PERSONAL',
      eventType: 'CHANGE',
      eventName: 'personal:timeline.marital-status',
      widowedDate: `${dateDash(`${date.dateYear}-${date.dateMonth}-${date.dateDay}`)}T00:00:00.000Z`,
      widowedDateVerified: date.verification === 'V',
      checkInheritableStatePension: checkInheritableStatePension === 'yes',
      entitledInheritableStatePension: isNotUndefinedEmptyOrNull(entitledInheritableStatePension) ? entitledInheritableStatePension === 'yes' : null,
      widowedAmounts: {
        ...widowedAmounts(awardDetails, details),
      },
    };
  },
};
