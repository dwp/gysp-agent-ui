function formatFrequencyPeriod(period) {
  if (period.includes('W')) {
    return 'weeks';
  }
  return period;
}

function formatFrequency(frequency) {
  return frequency.replace(/\D/g, '');
}

function formatSortCode(sortCode) {
  return sortCode.replace(/(.{2})/g, '$1 ').trim();
}

function showChangeFrequency(status) {
  return !new RegExp('^(?:DEAD|DEADNOTVERIFIED)$').test(status);
}

module.exports = {
  formatter(details) {
    return {
      accountHolder: details.accountDetail.accountHolder,
      accountNumber: details.accountDetail.accountNumber,
      sortCode: formatSortCode(details.accountDetail.sortCode),
      referenceNumber: details.accountDetail.referenceNumber,
      frequency: formatFrequency(details.paymentFrequency),
      frequencyPeriod: formatFrequencyPeriod(details.paymentFrequency),
      showChangeFrequency: showChangeFrequency(details.awardStatus),
    };
  },
};
