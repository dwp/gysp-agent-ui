const dateHelper = require('../dateHelper');
const generalHelper = require('../helpers/general');

function regularPaymentCaption(details) {
  if (details.firstPayment && details.arrearsPayment) {
    return 'Next and regular payment';
  }
  if (details.additionalRegularPayment) {
    return 'Next regular payment';
  }
  if (details.firstPayment) {
    return 'Second and regular payment';
  }
  if (details.paymentsAlreadyMade === true) {
    return 'Next and regular payment';
  }
  return 'First and regular payment';
}

function firstPaymentCaption(details) {
  if (details.arrearsPayment === true) {
    return 'Arrears payment';
  }
  if (details.additionalRegularPayment) {
    return 'Next payment';
  }
  return 'First payment';
}

module.exports = {
  formatter(details) {
    let regularCaptionStartDate = details.regularPayment.startDate;
    let regularCaptionEndDate = details.regularPayment.endDate;
    let regularCaptionTotal = details.regularPayment.paymentCalculation.totalAmount;
    let firstCaptionStartDate;
    let firstCaptionEndDate;
    let firstCaptionTotal;
    if (details.firstPayment) {
      firstCaptionStartDate = details.firstPayment.startDate;
      firstCaptionEndDate = details.firstPayment.endDate;
      firstCaptionTotal = details.firstPayment.paymentCalculation.totalAmount;
    }
    if (details.additionalRegularPayment) {
      regularCaptionStartDate = details.additionalRegularPayment.startDate;
      regularCaptionEndDate = details.additionalRegularPayment.endDate;
      regularCaptionTotal = details.additionalRegularPayment.paymentCalculation.totalAmount;
      firstCaptionStartDate = details.regularPayment.startDate;
      firstCaptionEndDate = details.regularPayment.endDate;
      firstCaptionTotal = details.regularPayment.paymentCalculation.totalAmount;
    }
    const json = {
      regularPayment: {
        title: regularPaymentCaption(details),
        rows: [
          {
            key: { text: 'Total' },
            value: { text: `${generalHelper.formatCurrency(regularCaptionTotal)}` },
          }, {
            key: { text: 'Payment period' },
            value: { html: `${dateHelper.longDate(regularCaptionStartDate)} to ${dateHelper.longDate(regularCaptionEndDate)}` },
          },
        ],
      },
    };

    if (details.firstPayment || details.additionalRegularPayment) {
      json.firstPayment = {
        title: firstPaymentCaption(details),
        rows: [
          {
            key: {
              text: 'Total',
            },
            value: {
              text: `${generalHelper.formatCurrency(firstCaptionTotal)}`,
            },
          }, {
            key: {
              text: 'Payment period',
            },
            value: {
              html: `${dateHelper.longDate(firstCaptionStartDate)} to ${dateHelper.longDate(firstCaptionEndDate)}`,
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
