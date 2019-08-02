const dateHelper = require('../dateHelper');

function currentStatus(status) {
  if (status === 'PAID') {
    return 'Paid';
  }
  if (status === 'NOTPAID') {
    return 'Not paid';
  }
  return 'Sent';
}

function formatCurrency(currency) {
  return `£${currency}`;
}

function formatRows(data) {
  return data.map((item, index) => {
    let format = [{
      text: dateHelper.slashDate(item.startDate),
    }, {
      text: dateHelper.slashDate(item.endDate),
    }, {
      text: dateHelper.slashDate(item.creditDate),
    }, {
      text: formatCurrency(item.paymentAmount),
    }, {
      text: currentStatus(item.status),
    }];

    if (index === 0) {
      format = format.map((element) => {
        const object = Object.assign({}, element);
        object.classes = 'gysp-table__cell--first';
        return object;
      });
    }

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
      ],
      rows: formatRows(details.recentPayments),
    };
  },
};
