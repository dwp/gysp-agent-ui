const claimData = require('./claimData');
const kongData = require('./kongData');

module.exports = {
  validPaymentApiResponse() {
    return {
      arrearsPayment: false,
      paymentsAlreadyMade: false,
      firstPayment: {
        endDate: '2018-12-31T09:43:11.315Z',
        paymentCalculation: {
          protectedPaymentAmount: 50,
          statePensionAmount: 100,
          totalAmount: 150,
        },
        startDate: '2018-12-10T09:43:11.315Z',
      },
      regularPayment: {
        endDate: '2019-12-12T09:43:11.315Z',
        paymentCalculation: {
          protectedPaymentAmount: 30,
          statePensionAmount: 140,
          totalAmount: 170,
        },
        startDate: '2019-01-01T09:43:11.315Z',
      },
    };
  },

  validPaymentApiResponseWithAdditionalPayment() {
    return {
      arrearsPayment: false,
      paymentsAlreadyMade: true,
      regularPayment: {
        endDate: '2018-12-31T09:43:11.315Z',
        paymentCalculation: {
          protectedPaymentAmount: 50,
          statePensionAmount: 100,
          totalAmount: 150,
        },
        startDate: '2018-12-10T09:43:11.315Z',
      },
      additionalRegularPayment: {
        endDate: '2019-12-12T09:43:11.315Z',
        paymentCalculation: {
          protectedPaymentAmount: 30,
          statePensionAmount: 140,
          totalAmount: 170,
        },
        startDate: '2019-01-01T09:43:11.315Z',
      },
    };
  },

  validPaymentApiResponseWithoutReferenceNumber() {
    const object = JSON.parse(JSON.stringify(this.validPaymentApiResponse()));
    delete object.bankDetails.referenceNumber;
    return object;
  },
  validPaymentApiResponseWithoutFirstPaymentProtectedPayment() {
    const object = JSON.parse(JSON.stringify(this.validPaymentApiResponse()));
    delete object.firstPayment.paymentCalculation.protectedPaymentAmount;
    return object;
  },
  validPaymentApiResponseFirstPaymentProtectedPaymentZero() {
    const object = JSON.parse(JSON.stringify(this.validPaymentApiResponse()));
    object.firstPayment.paymentCalculation.protectedPaymentAmount = '0.00';
    return object;
  },
  validPaymentApiResponseWithoutRegularPaymentProtectedPayment() {
    const object = JSON.parse(JSON.stringify(this.validPaymentApiResponse()));
    delete object.regularPayment.paymentCalculation.protectedPaymentAmount;
    return object;
  },
  validPaymentApiResponseRegularPaymentProtectedPaymentZero() {
    const object = JSON.parse(JSON.stringify(this.validPaymentApiResponse()));
    object.regularPayment.paymentCalculation.protectedPaymentAmount = '0.00';
    return object;
  },
  validPaymentApiResponseWithoutFirstPayment() {
    const object = JSON.parse(JSON.stringify(this.validPaymentApiResponse()));
    delete object.firstPayment;
    return object;
  },
  validPaymentApiResponseWithFirstPaymentArrearsFalse() {
    const object = JSON.parse(JSON.stringify(this.validPaymentApiResponse()));
    return object;
  },
  validPaymentApiResponseWithFirstPaymentArrearsTrue() {
    const object = JSON.parse(JSON.stringify(this.validPaymentApiResponse()));
    object.arrearsPayment = true;
    return object;
  },
  validPaymentApiResponseWithoutFirstPaymentAndPaymentsAlreadyMade() {
    const object = JSON.parse(JSON.stringify(this.validPaymentApiResponse()));
    delete object.firstPayment;
    object.paymentsAlreadyMade = true;
    return object;
  },
  validPaymentApiResponseWithAdditionalRegularPayment() {
    const object = JSON.parse(JSON.stringify(this.validPaymentApiResponseWithAdditionalPayment()));
    return object;
  },
  validProcessClaimPaymentRequest() {
    return {
      session: {
        processClaim: {
          claimDetail: {
            inviteKey: 'BLOGG1234',
          },
        },
      },
      ...kongData(),
    };
  },
  invalidSessionPaymentRequest() {
    return {
      session: {},
      ...kongData(),
    };
  },
  validReviewAwardPaymentScheduleRequest() {
    return {
      session: {
        award: claimData.validClaim(),
        'review-award': {
          nino: 'AA370773A',
          reasonForChange: 'REVISION OF ENTITLEMENT DUE TO CHANGE IN CONT/CREDIT POSITION',
          entitlementDate: '2018-11-09T12:27:48.795Z',
          newStatePensionAmount: 100.0,
          protectedPaymentAmount: 200.0,
          totalAmount: 300.0,
        },
        'srb-breakdown': {
          arrearsPayment: false,
        },
      },
      ...kongData(),
    };
  },
  validReviewAwardPaymentScheduleAssetedEntitlementDateRequest() {
    return {
      session: {
        award: claimData.validClaim(),
        'review-award': {
          nino: 'AA370773A',
          reasonForChange: 'REVISION OF ENTITLEMENT DUE TO CHANGE IN CONT/CREDIT POSITION',
          entitlementDate: '2018-11-09T12:27:48.795Z',
          newStatePensionAmount: 100.0,
          protectedPaymentAmount: 200.0,
          totalAmount: 300.0,
        },
        'srb-breakdown': {
          arrearsPayment: false,
        },
        'review-award-date': {
          dateYear: '2020',
          dateMonth: '11',
          dateDay: '09',
        },
      },
      ...kongData(),
    };
  },
  validPaymentFormattedObject() {
    return {
      regularPayment: {
        title: 'Second and regular payment',
        rows: [
          { key: { text: 'Total' }, value: { text: '£170.00' } },
          { key: { text: 'Payment period' }, value: { html: '1 January 2019 to<br/> 12 December 2019' } },
        ],
      },
      firstPayment: {
        title: 'First payment',
        rows: [
          { key: { text: 'Total' }, value: { text: '£150.00' } },
          { key: { text: 'Payment period' }, value: { html: '10 December 2018 to<br/> 31 December 2018' } },
        ],
      },
      button: 'Send new award letter',
    };
  },
  validPaymentFormattedObjectWithoutReferenceNumber() {
    const object = JSON.parse(JSON.stringify(this.validPaymentFormattedObject()));
    object.bankDetails.rows.splice(3, 1);
    return object;
  },
  validPaymentFormattedObjectWithoutFirstPaymentProtectedPayment() {
    const object = JSON.parse(JSON.stringify(this.validPaymentFormattedObject()));
    const [protectedPayment0] = object.firstPayment.rows[1].value.html.split('<br />');
    object.firstPayment.rows[1].value.html = protectedPayment0;
    object.button = 'Send new award letter';
    return object;
  },
  validPaymentFormattedObjectWithoutRegularPaymentProtectedPayment() {
    const object = JSON.parse(JSON.stringify(this.validPaymentFormattedObject()));
    const [protectedPayment0] = object.firstPayment.rows[1].value.html.split('<br />');
    object.firstPayment.rows[1].value.html = protectedPayment0;
    object.button = 'Send new award letter';
    return object;
  },
  validPaymentFormattedObjectWithoutFirstPayment() {
    const object = JSON.parse(JSON.stringify(this.validPaymentFormattedObject()));
    delete object.firstPayment;
    object.regularPayment.title = 'First and regular payment';
    object.button = 'Send new award letter';
    return object;
  },
  validPaymentFormattedObjectWithFirstPaymentArrearsFalse() {
    const object = JSON.parse(JSON.stringify(this.validPaymentFormattedObject()));
    object.regularPayment.title = 'Second and regular payment';
    object.button = 'Send new award letter';
    return object;
  },
  validPaymentFormattedObjectWithFirstPaymentArrearsTrue() {
    const object = JSON.parse(JSON.stringify(this.validPaymentFormattedObject()));
    object.firstPayment.title = 'Arrears payment';
    object.regularPayment.title = 'Next and regular payment';
    object.button = 'Pay arrears and send letter';
    return object;
  },
  validPaymentFormattedObjectWithNoFirstPaymentAndPaymentsMade() {
    const object = JSON.parse(JSON.stringify(this.validPaymentFormattedObject()));
    delete object.firstPayment;
    object.regularPayment.title = 'Next and regular payment';
    object.button = 'Send new award letter';
    return object;
  },
  validPaymentFormattedObjectWithAdditionalRegularPaymentPresent() {
    const object = JSON.parse(JSON.stringify(this.validPaymentFormattedObject()));
    object.firstPayment.title = 'Next payment';
    object.regularPayment.title = 'Next regular payment';
    object.button = 'Send new award letter';
    return object;
  },
  validProcessClaimPaymentFormRequest() {
    return {
      session: {
        processClaim: {
          claimDetail: {
            inviteKey: 'BLOGG1234',
          },
        },
      },
      body: {},
    };
  },
  invalidProcessClaimPaymentFormRequest() {
    return {
      session: {},
      body: {},
    };
  },
  noNinoChangePaymentScheduleRequest() {
    return {
      session: { 'payment-frequency': '1W' },
    };
  },
  noPaymentFrequencyChangePaymentScheduleRequest() {
    return {
      session: { searchedNino: 'AA123456C' },
    };
  },
};
