const claimData = require('./claimData');

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
  validProcessClaimPaymentRequest() {
    return {
      session: {
        processClaim: {
          claimDetail: {
            inviteKey: 'BLOGG1234',
          },
        },
      },
      user: { cis: { surname: 'User', givenname: 'Test' } },
    };
  },
  invalidSessionPaymentRequest() {
    return {
      session: {},
      user: { cis: { surname: 'User', givenname: 'Test' } },
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
      user: { cis: { surname: 'User', givenname: 'Test' } },
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
      user: { cis: { surname: 'User', givenname: 'Test' } },
    };
  },
  validPaymentFormattedObject() {
    return {
      paragraphs: [
        'The weekly State Pension amount will go up from <strong>£168.60</strong> to <strong>£180.60</strong> from <strong>9 November 2018</strong>.',
        'An arrears payment of <strong>£150.00</strong> will be made for the period 10 December 2018 to 31 December 2018.',
        'A new award letter will be sent to the claimant.',
      ],
    };
  },
  validPaymentFormattedObjectAssertedEntitlementDate() {
    return {
      paragraphs: [
        'The weekly State Pension amount will go up from <strong>£168.60</strong> to <strong>£180.60</strong> from <strong>9 November 2020</strong>.',
        'An arrears payment of <strong>£150.00</strong> will be made for the period 10 December 2018 to 31 December 2018.',
        'A new award letter will be sent to the claimant.',
      ],
    };
  },
  validPaymentFormattedObjectWithoutReferenceNumber() {
    const object = JSON.parse(JSON.stringify(this.validPaymentFormattedObject()));
    object.bankDetails.rows.splice(3, 1);
    return object;
  },
  validPaymentFormattedObjectAwardIncreaseWithArrears() {
    const object = JSON.parse(JSON.stringify(this.validPaymentFormattedObject()));
    object.paragraphs[0] = 'The weekly State Pension amount will go up from <strong>£100.00</strong> to <strong>£200.00</strong> from <strong>9 November 2018</strong>.';
    return object;
  },
  validPaymentFormattedObjectAwardIncreaseWithoutArrears() {
    const object = JSON.parse(JSON.stringify(this.validPaymentFormattedObjectAwardIncreaseWithArrears()));
    object.paragraphs.splice(1, 1);
    return object;
  },
  validPaymentFormattedObjectAwardDecrease() {
    const object = JSON.parse(JSON.stringify(this.validPaymentFormattedObject()));
    object.paragraphs[0] = 'The weekly State Pension amount will go down from <strong>£200.00</strong> to <strong>£100.00</strong> from <strong>9 November 2018</strong>.';
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
};
