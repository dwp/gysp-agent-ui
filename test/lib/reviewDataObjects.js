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
        arrearsExist: true,
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
      currentAwardAmount: 168.60,
      updatedAwardAmount: 180.60,
      entitlementDate: '2020-01-01T06:00:00.000Z',
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
  validPaymentApiResponseAwardIncreaseWithArrears() {
    const object = JSON.parse(JSON.stringify(this.validPaymentApiResponse()));
    object.currentAwardAmount = 100;
    object.updatedAwardAmount = 200;
    return object;
  },
  validPaymentApiResponseAwardIncreaseWithoutArrears() {
    const object = JSON.parse(JSON.stringify(this.validPaymentApiResponseAwardIncreaseWithArrears()));
    object.firstPayment.arrearsExist = false;
    return object;
  },
  validPaymentApiResponseAwardDecrease() {
    const object = JSON.parse(JSON.stringify(this.validPaymentApiResponse()));
    object.currentAwardAmount = 200;
    object.updatedAwardAmount = 100;
    object.firstPayment.arrearsExist = false;
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
  validOverPaymentApiResponse() {
    return {
      paymentsAlreadyMade: true,
      firstPayment: null,
      regularPayment: {
        startDate: 1602133200000,
        endDate: 1604469600000,
        paymentCalculation: {
          statePensionAmount: '571.60',
          protectedPaymentAmount: '29.20',
          inheritedExtraStatePensionAmount: '0.00',
          extraStatePensionAmount: '0.00',
          totalAmount: '600.80',
        },
      },
      currentAwardAmount: 173.9,
      updatedAwardAmount: 150.2,
      entitlementDate: 1599346800000,
      overpaymentPeriods: [{
        totalAmount: -108.34,
        fromDate: 1599346800000,
        toDate: 1602025200000,
        oldAmount: 173.9,
      }],
      totalOverpayment: -108.34,
      upratingDate: null,
      updatedUpratingAwardAmount: null,
    };
  },
  validOverPaymentApiResponseSpanUprating() {
    const object = JSON.parse(JSON.stringify(this.validOverPaymentApiResponse()));
    object.overpaymentPeriods.push({
      totalAmount: -50.34,
      fromDate: 1609778225000,
      toDate: 1612456625000,
      oldAmount: 43.9,
    });
    return object;
  },
  validPaymentApiResponseAwardDecreaseSpansUprating() {
    const object = JSON.parse(JSON.stringify(this.validPaymentApiResponseAwardDecrease()));
    object.updatedUpratingAwardAmount = 150.00;
    object.upratingDate = '2020-04-20T06:00:00.000Z';
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
  validReviewAwardOverPaymentPaymentScheduleRequest() {
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
        'srb-payment-breakdown': {
          paymentsAlreadyMade: true,
          firstPayment: null,
          regularPayment: {
            startDate: 1602133200000,
            endDate: 1604469600000,
            paymentCalculation: {
              statePensionAmount: '571.60',
              protectedPaymentAmount: '29.20',
              inheritedExtraStatePensionAmount: '0.00',
              extraStatePensionAmount: '0.00',
              totalAmount: '600.80',
            },
          },
          currentAwardAmount: 173.9,
          updatedAwardAmount: 150.2,
          entitlementDate: 1599346800000,
          overpaymentPeriods: [{
            totalAmount: -108.34,
            fromDate: 1599346800000,
            toDate: 1602025200000,
            oldAmount: 173.9,
          }],
          totalOverpayment: -108.34,
          upratingDate: null,
          updatedUpratingAwardAmount: null,
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
      paragraphs: [
        'The weekly State Pension amount will go up from <strong>£168.60</strong> to <strong>£180.60</strong> from <strong>1 January 2020</strong>.',
        'An arrears payment of <strong>£150.00</strong> will be made for the period 10 December 2018 to 31 December 2018.',
        'A new award letter will be sent to the claimant.',
      ],
    };
  },
  validPaymentFormattedObjectEndTask() {
    return {
      header: 'Complete Task',
      paragraphs: [
        'The weekly State Pension amount will go up from <strong>£168.60</strong> to <strong>£180.60</strong> from <strong>1 January 2020</strong>.',
        'An arrears payment of <strong>£150.00</strong> will be made for the period 10 December 2018 to 31 December 2018.',
        'A new award letter will be sent to the claimant.',
      ],
      button: 'End Task',
    };
  },
  validPaymentFormattedObjectAssertedEntitlementDate() {
    return {
      header: 'Complete Task',
      paragraphs: [
        'The weekly State Pension amount will go up from <strong>£168.60</strong> to <strong>£180.60</strong> from <strong>1 January 2020</strong>.',
        'An arrears payment of <strong>£150.00</strong> will be made for the period 10 December 2018 to 31 December 2018.',
        'A new award letter will be sent to the claimant.',
      ],
      button: 'End Task',
    };
  },
  validPaymentFormattedObjectWithoutReferenceNumber() {
    const object = JSON.parse(JSON.stringify(this.validPaymentFormattedObject()));
    object.bankDetails.rows.splice(3, 1);
    return object;
  },
  validPaymentFormattedObjectAwardIncreaseWithArrears() {
    const object = JSON.parse(JSON.stringify(this.validPaymentFormattedObject()));
    object.paragraphs[0] = 'The weekly State Pension amount will go up from <strong>£100.00</strong> to <strong>£200.00</strong> from <strong>1 January 2020</strong>.';
    return object;
  },
  validPaymentFormattedObjectAwardIncreaseWithArrearsTask() {
    const object = JSON.parse(JSON.stringify(this.validPaymentFormattedObjectEndTask()));
    object.paragraphs[0] = 'The weekly State Pension amount will go up from <strong>£100.00</strong> to <strong>£200.00</strong> from <strong>1 January 2020</strong>.';
    return object;
  },
  validPaymentFormattedObjectAwardIncreaseWithoutArrears() {
    const object = JSON.parse(JSON.stringify(this.validPaymentFormattedObjectAwardIncreaseWithArrears()));
    object.paragraphs.splice(1, 1);
    return object;
  },
  validPaymentFormattedObjectAwardIncreaseWithoutArrearsTask() {
    const object = JSON.parse(JSON.stringify(this.validPaymentFormattedObjectAwardIncreaseWithArrearsTask()));
    object.paragraphs.splice(1, 1);
    return object;
  },
  validPaymentFormattedObjectAwardDecrease() {
    const object = JSON.parse(JSON.stringify(this.validPaymentFormattedObject()));
    object.paragraphs[0] = 'The weekly State Pension amount will go down from <strong>£200.00</strong> to <strong>£100.00</strong> from <strong>1 January 2020</strong>.';
    object.paragraphs.splice(1, 1);
    return object;
  },
  validPaymentFormattedObjectAwardDecreaseTask() {
    const object = JSON.parse(JSON.stringify(this.validPaymentFormattedObjectEndTask()));
    object.paragraphs[0] = 'The weekly State Pension amount will go down from <strong>£200.00</strong> to <strong>£100.00</strong> from <strong>1 January 2020</strong>.';
    object.paragraphs.splice(1, 1);
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
  validPaymentFormattedObjectAwardDecreaseSpansUprating() {
    const object = JSON.parse(JSON.stringify(this.validPaymentFormattedObjectAwardDecreaseTask()));
    object.paragraphs.splice(1, 0, 'From <strong>20 April 2020</strong> the award changes to <strong>£150.00</strong> due to annual uprating.');
    return object;
  },
};
