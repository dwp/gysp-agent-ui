const dateHelper = require('../dateHelper');
const generalHelper = require('../helpers/general');

function formatRows(data) {
  return data.map((item) => {
    const format = [
      { text: dateHelper.longDateWithWeekday(item.creditDate) },
      { text: generalHelper.formatCurrency(item.paymentAmount) },
      { text: generalHelper.formatPaymentStatus(item.status) },
      { html: `<a href="/changes-and-enquiries/payment-history/${item.id}" class="govuk-link">Details</a>` },
    ];

    return format;
  });
}

module.exports = {
  formatter(details) {
    if (details === undefined || details === null) {
      return false;
    }
    if (details.recentPayments === undefined || details.recentPayments === null) {
      return false;
    }
    return {
      caption: 'Payment history',
      head: [
        { text: 'Payment date' },
        { text: 'Amount' },
        { text: 'Status' },
      ],
      rows: formatRows(details.recentPayments),
    };
  },
};
