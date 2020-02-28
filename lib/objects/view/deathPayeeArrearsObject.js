const i18n = require('i18next');

const generalHelper = require('../../helpers/general');
const dateHelper = require('../../dateHelper');

function formatter(paymentDetails, accountDetails) {
  const details = {
    paymentDetails: {
      amount: generalHelper.formatCurrency(Math.abs(paymentDetails.arrearsAmount)),
      startDate: dateHelper.slashDate(paymentDetails.arrearsStartDate),
      endDate: dateHelper.slashDate(paymentDetails.arrearsEndDate),
    },
    accountDetails: {
      rows: [{
        key: { text: i18n.t('death-pay-arrears:accountDetails.account_holder') },
        value: { text: accountDetails.accountName },
      }, {
        key: { text: i18n.t('death-pay-arrears:accountDetails.account_number') },
        value: { text: accountDetails.accountNumber },
      }, {
        key: { text: i18n.t('death-pay-arrears:accountDetails.sort_code') },
        value: { text: generalHelper.formatSortCode(accountDetails.sortCode) },
      }],
    },
  };

  if (accountDetails.referenceNumber) {
    details.accountDetails.rows.push({
      key: { text: i18n.t('death-pay-arrears:accountDetails.roll_number') },
      value: { text: accountDetails.referenceNumber },
    });
  }
  return details;
}

module.exports = {
  pageData(paymentDetails, accountDetails) {
    const pageData = {
      header: i18n.t('death-pay-arrears:header'),
      back: '/changes-and-enquiries/personal/death/account-details',
      buttonText: i18n.t('death-pay-arrears:button'),
      buttonHref: '/changes-and-enquiries/personal/death/process-arrears',
    };

    return { ...pageData, ...formatter(paymentDetails, accountDetails) };
  },
};
