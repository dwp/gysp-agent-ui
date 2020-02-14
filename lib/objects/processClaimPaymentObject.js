const dateHelper = require('../dateHelper');
const generalHelper = require('../helpers/general');

function breakdown(statePensionAmount, protectedPaymentAmount) {
  let html = `New State Pension ${generalHelper.formatCurrency(statePensionAmount)}`;
  if (protectedPaymentAmount && protectedPaymentAmount !== '0.00') {
    html += `<br />Protected payment ${generalHelper.formatCurrency(protectedPaymentAmount)}`;
  }
  return html;
}

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
            key: { text: 'Breakdown' },
            value: {
              html: breakdown(
                details.regularPayment.paymentCalculation.statePensionAmount,
                details.regularPayment.paymentCalculation.protectedPaymentAmount,
              ),
            },
          }, {
            key: { text: 'Payment period dates' },
            value: { html: `${dateHelper.longDate(details.regularPayment.startDate)} to<br />${dateHelper.longDate(details.regularPayment.endDate)}` },
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
              text: 'Breakdown',
            },
            value: {
              html: breakdown(
                details.firstPayment.paymentCalculation.statePensionAmount,
                details.firstPayment.paymentCalculation.protectedPaymentAmount,
              ),
            },
          }, {
            key: {
              text: 'Payment period dates',
            },
            value: {
              html: `${dateHelper.longDate(details.firstPayment.startDate)} to<br />${dateHelper.longDate(details.firstPayment.endDate)}`,
            },
          },
        ],
      };
    }
    json.button = 'Save and send letter';

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
