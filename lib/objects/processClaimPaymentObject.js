const dateHelper = require('../dateHelper');
const generalHelper = require('../helpers/general');

function regularPaymentCaption(details) {
  if (details.firstPayment && details.arrearsPayment) {
    return 'Next and regular payment';
  }
  if (details.firstPayment) {
    return 'Second and regular payment';
  }
  return 'First and regular payment';
}

function firstPaymentCaption(details) {
  if (details.arrearsPayment === true) {
    return 'Arrears payment';
  }
  return 'First payment';
}

module.exports = {
  formatter(details) {
    const json = {
      regularPayment: {
        title: regularPaymentCaption(details),
        rows: [
          {
            key: { text: 'Total' },
            value: { text: `${generalHelper.formatCurrency(details.regularPayment.paymentCalculation.totalAmount)}` },
          }, {
            key: { text: 'Payment period' },
            value: { html: `${dateHelper.longDate(details.regularPayment.startDate)} to ${dateHelper.longDate(details.regularPayment.endDate)}` },
          },
        ],
      },
    };

    if (details.firstPayment) {
      json.firstPayment = {
        title: firstPaymentCaption(details),
        rows: [
          {
            key: {
              text: 'Total',
            },
            value: {
              text: `${generalHelper.formatCurrency(details.firstPayment.paymentCalculation.totalAmount)}`,
            },
          }, {
            key: {
              text: 'Payment period',
            },
            value: {
              html: `${dateHelper.longDate(details.firstPayment.startDate)} to ${dateHelper.longDate(details.firstPayment.endDate)}`,
            },
          },
        ],
      };
    }
    json.button = 'Send new award letter';

    if (details.arrearsPayment === true) {
      json.button = 'Pay arrears and send letter';
    }

    return json;
  },
  postObject(details) {
    return {
      inviteKey: details.inviteKey,
    };
  },
};
