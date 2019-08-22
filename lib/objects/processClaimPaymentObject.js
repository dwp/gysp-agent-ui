const dateHelper = require('../dateHelper');

function breakdown(statePensionAmount, protectedPaymentAmount) {
  let html = `New State Pension £${statePensionAmount}`;
  if (protectedPaymentAmount && protectedPaymentAmount !== '0.00') {
    html += `<br />Protected payment £${protectedPaymentAmount}`;
  }
  return html;
}

function regularPaymentCaption(details) {
  if (details.firstPayment && details.adjustedPayment) {
    return 'Regular payment';
  }
  if (details.firstPayment) {
    return 'Second and regular payment';
  }
  return 'First and regular payment';
}

module.exports = {
  formatter(details) {
    const json = {
      bankDetails: {
        caption: 'Bank details',
        rows: [
          [{ text: 'Account holder' }, { text: details.bankDetails.accountHolder }],
          [{ text: 'Sort code' }, { text: details.bankDetails.sortCode }],
          [{ text: 'Account number' }, { text: details.bankDetails.accountNumber }],
        ],
      },
      regularPayment: {
        caption: regularPaymentCaption(details),
        rows: [
          [{
            text: 'Total',
          }, {
            text: `£${details.regularPayment.paymentCalculation.totalAmount}`,
          }],
          [{
            text: 'Breakdown',
          }, {
            html: breakdown(
              details.regularPayment.paymentCalculation.statePensionAmount,
              details.regularPayment.paymentCalculation.protectedPaymentAmount,
            ),
          }],
          [{
            text: 'Payment period dates',
          }, {
            html: `${dateHelper.longDate(details.regularPayment.startDate)} to<br />${dateHelper.longDate(details.regularPayment.endDate)}`,
          }],
        ],
      },
    };

    if (details.firstPayment) {
      json.firstPayment = {
        caption: 'First payment',
        rows: [
          [{ text: 'Total' }, { text: `£${details.firstPayment.paymentCalculation.totalAmount}` }],
          [{
            text: 'Breakdown',
          }, {
            html: breakdown(
              details.firstPayment.paymentCalculation.statePensionAmount,
              details.firstPayment.paymentCalculation.protectedPaymentAmount,
            ),
          }],
          [{
            text: 'Payment period dates',
          }, {
            html: `${dateHelper.longDate(details.firstPayment.startDate)} to<br />${dateHelper.longDate(details.firstPayment.endDate)}`,
          }],
        ],
      };
    }

    if (details.adjustedPayment) {
      json.secondPayment = {
        caption: 'Second payment',
        rows: [
          [{ text: 'Total' }, { text: `£${details.adjustedPayment.paymentCalculation.totalAmount}` }],
          [{
            text: 'Breakdown',
          }, {
            html: breakdown(
              details.adjustedPayment.paymentCalculation.statePensionAmount,
              details.adjustedPayment.paymentCalculation.protectedPaymentAmount,
            ),
          }],
          [{
            text: 'Payment period dates',
          }, {
            html: `${dateHelper.longDate(details.adjustedPayment.startDate)} to<br />${dateHelper.longDate(details.adjustedPayment.endDate)}`,
          }],
        ],
      };
    }

    if (details.bankDetails.referenceNumber) {
      json.bankDetails.rows.push([{ text: 'Roll number' }, { text: details.bankDetails.referenceNumber }]);
    }

    return json;
  },
  postObject(details) {
    return {
      inviteKey: details.inviteKey,
    };
  },
};
