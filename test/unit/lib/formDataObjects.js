const claimData = require('../../lib/claimData');

module.exports = {
  validPaymentApiResponse() {
    return {
      bankDetails: {
        accountHolder: 'Mr Joe Bloggs',
        accountNumber: '12345678',
        referenceNumber: '000000000',
        sortCode: '986456',
      },
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
  validPaymentApiResponseWithFirstSecondRegularPayment() {
    const object = JSON.parse(JSON.stringify(this.validPaymentApiResponse()));
    object.adjustedPayment = {
      endDate: '2018-12-31T09:43:11.315Z',
      paymentCalculation: {
        protectedPaymentAmount: 20,
        statePensionAmount: 50,
        totalAmount: 70,
      },
      startDate: '2018-12-10T09:43:11.315Z',
    };
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
      },
      user: { cis: { surname: 'User', givenname: 'Test' } },
    };
  },
  validPaymentFormattedObject() {
    return {
      bankDetails: {
        caption: 'Bank details',
        rows: [
          [{ text: 'Account holder' }, { text: 'Mr Joe Bloggs' }],
          [{ text: 'Sort code' }, { text: '986456' }],
          [{ text: 'Account number' }, { text: '12345678' }],
          [{ text: 'Roll number' }, { text: '000000000' }],
        ],
      },
      regularPayment: {
        caption: 'Second and regular payment',
        rows: [
          [{ text: 'Total' }, { text: '£170' }],
          [{ text: 'Breakdown' }, { html: 'New State Pension £140<br />Protected payment £30' }],
          [{ text: 'Payment period dates' }, { html: '1 January 2019 to<br />12 December 2019' }],
        ],
      },
      firstPayment: {
        caption: 'First payment',
        rows: [
          [{ text: 'Total' }, { text: '£150' }],
          [{ text: 'Breakdown' }, { html: 'New State Pension £100<br />Protected payment £50' }],
          [{ text: 'Payment period dates' }, { html: '10 December 2018 to<br />31 December 2018' }],
        ],
      },
    };
  },
  validPaymentFormattedObjectWithoutReferenceNumber() {
    const object = JSON.parse(JSON.stringify(this.validPaymentFormattedObject()));
    object.bankDetails.rows.splice(3, 1);
    return object;
  },
  validPaymentFormattedObjectWithoutFirstPaymentProtectedPayment() {
    const object = JSON.parse(JSON.stringify(this.validPaymentFormattedObject()));
    const [protectedPayment0] = object.firstPayment.rows[1][1].html.split('<br />');
    object.firstPayment.rows[1][1].html = protectedPayment0;
    return object;
  },
  validPaymentFormattedObjectWithoutRegularPaymentProtectedPayment() {
    const object = JSON.parse(JSON.stringify(this.validPaymentFormattedObject()));
    const [protectedPayment0] = object.regularPayment.rows[1][1].html.split('<br />');
    object.regularPayment.rows[1][1].html = protectedPayment0;
    return object;
  },
  validPaymentFormattedObjectWithoutFirstPayment() {
    const object = JSON.parse(JSON.stringify(this.validPaymentFormattedObject()));
    delete object.firstPayment;
    object.regularPayment.caption = 'First and regular payment';
    return object;
  },
  validPaymentFormattedObjectWithFirstSecondRegularPayment() {
    const object = JSON.parse(JSON.stringify(this.validPaymentFormattedObject()));
    object.secondPayment = {
      caption: 'Second payment',
      rows: [
        [{ text: 'Total' }, { text: '£70' }],
        [{ text: 'Breakdown' }, { html: 'New State Pension £50<br />Protected payment £20' }],
        [{ text: 'Payment period dates' }, { html: '10 December 2018 to<br />31 December 2018' }],
      ],
    };
    object.regularPayment.caption = 'Regular payment';
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
