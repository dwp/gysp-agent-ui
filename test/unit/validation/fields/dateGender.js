const assert = require('assert');

const validator = require('../../../../lib/customerFieldsValidator');

const invalidDates = [{ gender: 'Male', date: { day: '05', month: '04', year: '1951' }, hook: 'before' },
  { gender: 'Female', date: { day: '05', month: '04', year: '1953' }, hook: 'before' },
  { gender: 'Male', date: { day: '06', month: '04', year: '1960' }, hook: 'after' },
  { gender: 'Female', date: { day: '06', month: '04', year: '1960' }, hook: 'after' }];

const validDates = [{ gender: 'Male', date: { day: '06', month: '04', year: '1951' } },
  { gender: 'Female', date: { day: '06', month: '04', year: '1953' } },
  { gender: 'Male', date: { day: '05', month: '04', year: '1960' } },
  { gender: 'Female', date: { day: '05', month: '04', year: '1960' } }];

const validDatesTest = [{ date: '06/04/1953', gender: 'Female' },
  { date: '26/04/1953', gender: 'Female' },
  { date: '01/08/1951', gender: 'Male' },
  { date: '06/05/1953', gender: 'Female' },
  { date: '02/06/1953', gender: 'Female' },
  { date: '20/11/1951', gender: 'Male' },
  { date: '6/06/1953', gender: 'Female' },
  { date: '15/06/1953', gender: 'Female' },
  { date: '28/02/1952', gender: 'Male' },
  { date: '06/07/1953', gender: 'Female' },
  { date: '02/08/1953', gender: 'Female' },
  { date: '29/02/1952', gender: 'Male' },
  { date: '06/08/1953', gender: 'Female' },
  { date: '30/08/1953', gender: 'Female' },
  { date: '01/03/1952', gender: 'Male' },
  { date: '06/09/1953', gender: 'Female' },
  { date: '05/10/1953', gender: 'Female' },
  { date: '10/10/1952', gender: 'Male' },
  { date: '06/10/1953', gender: 'Female' },
  { date: '16/10/1953', gender: 'Female' },
  { date: '31/01/1953', gender: 'Male' },
  { date: '06/11/1953', gender: 'Female' },
  { date: '05/12/1953', gender: 'Female' },
  { date: '05/12/1953', gender: 'Male' },
  { date: '06/12/1953', gender: 'Male' },
  { date: '02/01/1954', gender: 'Female' },
  { date: '06/01/1954', gender: 'Male' },
  { date: '24/01/1954', gender: 'Female' },
  { date: '06/02/1954', gender: 'Male' },
  { date: '14/02/1954', gender: 'Female' },
  { date: '06/03/1954', gender: 'Male' },
  { date: '01/04/1954', gender: 'Female' },
  { date: '06/04/1954', gender: 'Male' },
  { date: '18/04/1954', gender: 'Female' },
  { date: '06/05/1954', gender: 'Male' },
  { date: '29/05/1954', gender: 'Female' },
  { date: '06/06/1954', gender: 'Male' },
  { date: '30/06/1954', gender: 'Female' },
  { date: '06/07/1954', gender: 'Male' },
  { date: '31/07/1954', gender: 'Female' },
  { date: '06/08/1954', gender: 'Male' },
  { date: '02/09/1954', gender: 'Female' },
  { date: '06/09/1954', gender: 'Male' },
  { date: '22/09/1954', gender: 'Female' },
  { date: '06/10/1954', gender: 'Male' },
  { date: '29/02/1956', gender: 'Female' },
  { date: '05/03/1959', gender: 'Male' },
  { date: '05/04/1960', gender: 'Female' }];

describe('Form validation isValidDateWithGender', () => {
  invalidDates.forEach((test) => {
    it(`should return error ${test.hook} for ${test.gender} born on ${test.date.day}/${test.date.month}/${test.date.year}`, () => {
      assert.equal(test.hook, validator.isValidDateWithGender(test.date.day, test.date.month, test.date.year, test.gender));
    });
  });

  validDates.forEach((test) => {
    it(`should return no error for ${test.gender} born on ${test.date.day}/${test.date.month}/${test.date.year}`, () => {
      assert.equal(undefined, validator.isValidDateWithGender(test.date.day, test.date.month, test.date.year, test.gender));
    });
  });

  validDatesTest.forEach((test) => {
    it(`should return no error for ${test.gender} born on ${test.date}`, () => {
      const dateParms = test.date.split('/');
      assert.equal(undefined, validator.isValidDateWithGender(dateParms[0], dateParms[1], dateParms[2], test.gender));
    });
  });
});
