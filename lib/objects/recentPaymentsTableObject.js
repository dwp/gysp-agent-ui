const dateHelper = require('../dateHelper');
const generalHelper = require('../helpers/general');

function formatRows(data) {
  return data.map((item) => {
    const format = [{
      text: dateHelper.slashDate(item.startDate),
    }, {
      text: dateHelper.slashDate(item.endDate),
    }, {
      text: dateHelper.slashDate(item.creditDate),
    }, {
      text: generalHelper.formatCurrency(item.paymentAmount),
    }, {
      text: generalHelper.formatPaymentStatus(item.status),
    }, {
      html: `<a href="/changes-and-enquiries/payment-history/${item.id}" class="govuk-link">Details</a>`,
      classes: 'govuk-table__cell--numeric',
    }];

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
        { text: 'From' },
        { text: 'To' },
        { text: 'Payment date' },
        { text: 'Amount' },
        { text: 'Status' },
        { text: '' },
      ],
      rows: formatRows(details.recentPayments),
    };
  },
};
