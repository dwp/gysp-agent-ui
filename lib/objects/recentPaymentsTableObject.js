const dateHelper = require('../dateHelper');

function currentStatus(status) {
  if (status === 'PAID') {
    return '<span class="govuk-!-font-size-16 govuk-!-font-weight-bold gysp-secondary-text-colour gysp-status gysp-status--active">Paid</span>';
  }
  return '<span class="govuk-!-font-size-16 govuk-!-font-weight-bold gysp-secondary-text-colour gysp-status gysp-status--active">Sent</span>';
}

function formatCurrency(currency) {
  return `£${currency}`;
}

function formatRows(data) {
  return data.map((item, index) => {
    let format = [{
      text: dateHelper.longDate(item.creditDate),
    }, {
      text: formatCurrency(item.paymentAmount),
    }, {
      html: currentStatus(item.status),
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
      caption: 'Recent payments',
      rows: formatRows(details.recentPayments),
    };
  },
};
