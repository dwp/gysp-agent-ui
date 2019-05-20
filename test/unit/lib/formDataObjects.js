module.exports = {
  validProcessClaimPaymentApiResponse() {
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
  validProcessClaimPaymentApiResponseWithoutReferenceNumber() {
    const object = JSON.parse(JSON.stringify(this.validProcessClaimPaymentApiResponse()));
    delete object.bankDetails.referenceNumber;
    return object;
  },
  validProcessClaimPaymentApiResponseWithoutFirstPaymentProtectedPayment() {
    const object = JSON.parse(JSON.stringify(this.validProcessClaimPaymentApiResponse()));
    delete object.firstPayment.paymentCalculation.protectedPaymentAmount;
    return object;
  },
  validProcessClaimPaymentApiResponseFirstPaymentProtectedPaymentZero() {
    const object = JSON.parse(JSON.stringify(this.validProcessClaimPaymentApiResponse()));
    object.firstPayment.paymentCalculation.protectedPaymentAmount = '0.00';
    return object;
  },
  validProcessClaimPaymentApiResponseWithoutRegularPaymentProtectedPayment() {
    const object = JSON.parse(JSON.stringify(this.validProcessClaimPaymentApiResponse()));
    delete object.regularPayment.paymentCalculation.protectedPaymentAmount;
    return object;
  },
  validProcessClaimPaymentApiResponseRegularPaymentProtectedPaymentZero() {
    const object = JSON.parse(JSON.stringify(this.validProcessClaimPaymentApiResponse()));
    object.regularPayment.paymentCalculation.protectedPaymentAmount = '0.00';
    return object;
  },
  validProcessClaimPaymentApiResponseWithoutFirstPayment() {
    const object = JSON.parse(JSON.stringify(this.validProcessClaimPaymentApiResponse()));
    delete object.firstPayment;
    return object;
  },
  validProcessClaimPaymentApiResponseWithFirstSecondRegularPayment() {
    const object = JSON.parse(JSON.stringify(this.validProcessClaimPaymentApiResponse()));
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
  invalidProcessClaimPaymentRequest() {
    return {
      session: {},
      user: { cis: { surname: 'User', givenname: 'Test' } },
    };
  },
  validProcessClaimPaymentFormattedObject() {
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
  validProcessClaimPaymentFormattedObjectWithoutReferenceNumber() {
    const object = JSON.parse(JSON.stringify(this.validProcessClaimPaymentFormattedObject()));
    object.bankDetails.rows.splice(3, 1);
    return object;
  },
  validProcessClaimPaymentFormattedObjectWithoutFirstPaymentProtectedPayment() {
    const object = JSON.parse(JSON.stringify(this.validProcessClaimPaymentFormattedObject()));
    const [protectedPayment0] = object.firstPayment.rows[1][1].html.split('<br />');
    object.firstPayment.rows[1][1].html = protectedPayment0;
    return object;
  },
  validProcessClaimPaymentFormattedObjectWithoutRegularPaymentProtectedPayment() {
    const object = JSON.parse(JSON.stringify(this.validProcessClaimPaymentFormattedObject()));
    const [protectedPayment0] = object.regularPayment.rows[1][1].html.split('<br />');
    object.regularPayment.rows[1][1].html = protectedPayment0;
    return object;
  },
  validProcessClaimPaymentFormattedObjectWithoutFirstPayment() {
    const object = JSON.parse(JSON.stringify(this.validProcessClaimPaymentFormattedObject()));
    delete object.firstPayment;
    object.regularPayment.caption = 'First and regular payment';
    return object;
  },
  validProcessClaimPaymentFormattedObjectWithFirstSecondRegularPayment() {
    const object = JSON.parse(JSON.stringify(this.validProcessClaimPaymentFormattedObject()));
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
