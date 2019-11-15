module.exports = {
  formatter(deathPayment, awardDetails) {
    return {
      nino: awardDetails.nino,
      amountDetails: deathPayment,
    };
  },
};
