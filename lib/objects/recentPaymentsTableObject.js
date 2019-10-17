const dateHelper = require('../dateHelper');

function currentStatus(status) {
  if (status === 'PAID') {
    return 'Paid';
  }
  if (status === 'RETURNED') {
    return 'Returned';
  }
  if (status === 'RECALLING') {
    return 'Recalling';
  }
  return 'Sent';
}

function formatCurrency(currency) {
  return `£${currency}`;
}

function formatRows(data) {
  return data.map((item) => {
    const format = [{
      text: dateHelper.slashDate(item.startDate),
    }, {
      text: dateHelper.slashDate(item.endDate),
    }, {
      text: dateHelper.slashDate(item.creditDate),
    }, {
      text: formatCurrency(item.paymentAmount),
    }, {
      text: currentStatus(item.status),
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
