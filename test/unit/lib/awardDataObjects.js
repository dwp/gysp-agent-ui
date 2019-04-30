module.exports = {
  validScheduleApiResponse() {
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
          protectedPaymentAmount: 50.00,
          statePensionAmount: 100.00,
          totalAmount: 150.00,
        },
        startDate: '2018-12-10T09:43:11.315Z',
      },
      regularPayment: {
        endDate: '2019-12-12T09:43:11.315Z',
        paymentCalculation: {
          protectedPaymentAmount: 30.00,
          statePensionAmount: 140.00,
          totalAmount: 170.00,
        },
        startDate: '2019-01-01T09:43:11.315Z',
      },
    };
  },
  validScheduleFormatterResponse(frequency, nino) {
    const object = JSON.parse(JSON.stringify(this.validScheduleApiResponse()));
    object.paymentFrequency = frequency;
    object.nino = nino;
    return object;
  },
};
