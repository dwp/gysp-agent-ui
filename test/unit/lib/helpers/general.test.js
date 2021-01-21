const { assert } = require('chai');
const moment = require('moment');

const helper = require('../../../../lib/helpers/general');

const monthsWith30Days = ['04', '06', '09', '11'];
const monthsWith31Days = ['01', '03', '05', '07', '08', '10', '12'];

const leapYear1972 = 1972;
const leapYear2200 = 2200;
const leapYear2100 = 2100;

describe('General Helper ', () => {
  describe('isDateDayValid', () => {
    it('should return false when no params are passed', () => {
      assert.isFalse(helper.isDateDayValid());
    });

    it('should return true when day is undefined', () => {
      assert.isTrue(helper.isDateDayValid(undefined, '1', '2020'));
    });

    it('should return false when month is undefined', () => {
      assert.isFalse(helper.isDateDayValid('1', undefined, '2020'));
    });

    it('should return false when year is undefined', () => {
      assert.isFalse(helper.isDateDayValid('1', '1', undefined));
    });

    monthsWith30Days.forEach((month) => {
      it(`should return false when day is an invalid day of month - 2020-${month}-31`, () => {
        assert.isFalse(helper.isDateDayValid('31', month, '2020'));
      });

      it(`should return true when day is an valid day of month - 2020-${month}-30`, () => {
        assert.isTrue(helper.isDateDayValid('30', month, '2020'));
      });
    });

    monthsWith31Days.forEach((month) => {
      it(`should return true when day is an valid day of month - 2020-${month}-31`, () => {
        assert.isTrue(helper.isDateDayValid('31', month, '2020'));
      });
    });

    it('should return false when day is an invalid day (31) of February - 2020-02-31', () => {
      assert.isFalse(helper.isDateDayValid('31', '02', '2020'));
    });

    it('should return false when day is an invalid day of February - 2020-02-29', () => {
      assert.isTrue(helper.isDateDayValid('29', '02', '2020'));
    });

    it('should return false when day is an invalid day of February - 2021-02-29', () => {
      assert.isFalse(helper.isDateDayValid('29', '02', '2021'));
    });

    it('should return true when day is valid - single digit', () => {
      assert.isTrue(helper.isDateDayValid('1', '1', '2020'));
    });

    it('should return true when day is valid - double digit', () => {
      assert.isTrue(helper.isDateDayValid('01', '01', '2020'));
    });
  });

  describe('daysInMonth', () => {
    monthsWith30Days.forEach((month) => {
      it(`should return 30 when month is ${moment(`2020-${month}`).format('MMMM')}`, () => {
        assert.equal(helper.daysInMonth(month, '2020'), 30);
      });
    });

    monthsWith31Days.forEach((month) => {
      it(`should return 31 when month is ${moment(`2020-${month}`).format('MMMM')}`, () => {
        assert.equal(helper.daysInMonth(month, '2020'), 31);
      });
    });

    for (let year = leapYear1972; year <= leapYear2200; year++) {
      if ((year === leapYear2100 || year === leapYear2200) || year % 4 !== 0) {
        it(`should return 28 when month is February and year is ${year} which is not a leap year`, () => {
          assert.equal(helper.daysInMonth('02', year), 28);
        });
      }
    }

    for (let year = leapYear1972; year <= leapYear2200; year += 4) {
      if (year !== leapYear2100 && year !== leapYear2200) { // only years that not a leap year
        it(`should return 29 when month is February and year is ${year} which is a leap year`, () => {
          assert.equal(helper.daysInMonth('02', year), 29);
        });
      }
    }
  });

  describe('removeNullFromArray', () => {
    it('should return array with nulls removed then nulls are present', () => {
      assert.deepEqual(helper.removeNullFromArray(['test', 'test', null, 'test', null]), ['test', 'test', 'test']);
    });

    it('should return array with modification when there are no nulls present', () => {
      assert.deepEqual(helper.removeNullFromArray(['test', 'test', 'test']), ['test', 'test', 'test']);
    });

    it('should return empty array when all items are nulls', () => {
      assert.deepEqual(helper.removeNullFromArray([null, null]), []);
    });
  });

  describe('formatNinoWithSpaces', () => {
    it('should return string with spaces every 2 characters when a string with more than 2 characters is supplied', () => {
      assert.equal(helper.formatNinoWithSpaces('ZZ887755'), 'ZZ 88 77 55');
    });

    it('should return string with no spaces when a string with 2 characters is supplied', () => {
      assert.equal(helper.formatNinoWithSpaces('ZZ'), 'ZZ');
    });

    it('should return string with no spaces when a string with less than 2 characters is supplied', () => {
      assert.equal(helper.formatNinoWithSpaces('Z'), 'Z');
    });
  });

  describe('formatSortCode', () => {
    it('should return string with spaces every 2 characters when a string with more than 2 characters is supplied', () => {
      assert.equal(helper.formatSortCode('887755'), '88 77 55');
    });

    it('should return string with no spaces when a string with 2 characters is supplied', () => {
      assert.equal(helper.formatSortCode('00'), '00');
    });

    it('should return string with no spaces when a string with less than 2 characters is supplied', () => {
      assert.equal(helper.formatSortCode('0'), '0');
    });

    it('should return string with dashes removed and spaces every 2 characters when a string with dashes is supplied', () => {
      assert.equal(helper.formatSortCode('88-77-55'), '88 77 55');
    });

    it('should return string with only spaces every 2 characters when a string with spaces is supplied', () => {
      assert.equal(helper.formatSortCode('88 77 55'), '88 77 55');
    });

    it('should return string with only spaces every 2 characters when a string with spaces and dashes are supplied', () => {
      assert.equal(helper.formatSortCode('88-77 55'), '88 77 55');
    });
  });

  describe('removeSpacesAndHyphens', () => {
    it('should return string with no spaces or hyphens', () => {
      assert.equal(helper.removeSpacesAndHyphens('00  -00-  00-00   '), '00000000');
    });
  });

  describe('checkIfValidMaritalStatusByStatus', () => {
    it('should return false when undefined', () => {
      assert.isFalse(helper.checkIfValidMaritalStatusByStatus());
    });

    it('should return false when invalid status supplied', () => {
      assert.isFalse(helper.checkIfValidMaritalStatusByStatus('bob'));
    });

    it('should return true when divorced status supplied and current status Married', () => {
      assert.isTrue(helper.checkIfValidMaritalStatusByStatus('divorced', 'Married'));
    });

    it('should return true when widowed status supplied and current status Married', () => {
      assert.isTrue(helper.checkIfValidMaritalStatusByStatus('widowed', 'Married'));
    });

    it('should return true when dissolved status supplied and current status Civil Partnership', () => {
      assert.isTrue(helper.checkIfValidMaritalStatusByStatus('dissolved', 'Civil Partnership'));
    });

    it('should return true when widowed status supplied and current status Civil Partnership', () => {
      assert.isTrue(helper.checkIfValidMaritalStatusByStatus('widowed', 'Civil Partnership'));
    });

    it('should return true when married status supplied and current status Single', () => {
      assert.isTrue(helper.checkIfValidMaritalStatusByStatus('married', 'Single'));
    });

    it('should return true when civil status supplied and current status Single', () => {
      assert.isTrue(helper.checkIfValidMaritalStatusByStatus('civil', 'Single'));
    });

    it('should return true when married status supplied and current status Divorced', () => {
      assert.isTrue(helper.checkIfValidMaritalStatusByStatus('married', 'Divorced'));
    });

    it('should return true when civil status supplied and current status Divorced', () => {
      assert.isTrue(helper.checkIfValidMaritalStatusByStatus('civil', 'Divorced'));
    });

    it('should return true when married status supplied and current status Dissolved', () => {
      assert.isTrue(helper.checkIfValidMaritalStatusByStatus('married', 'Dissolved'));
    });

    it('should return true when civil status supplied and current status Dissolved', () => {
      assert.isTrue(helper.checkIfValidMaritalStatusByStatus('civil', 'Dissolved'));
    });

    it('should return true when married status supplied and current status Widowed', () => {
      assert.isTrue(helper.checkIfValidMaritalStatusByStatus('married', 'Widowed'));
    });

    it('should return true when civil status supplied and current status Widowed', () => {
      assert.isTrue(helper.checkIfValidMaritalStatusByStatus('civil', 'Widowed'));
    });
  });

  describe('lowerCaseOrNull', () => {
    it('should return null when undefined', () => {
      assert.isNull(helper.lowerCaseOrNull());
    });

    it('should return null when empty', () => {
      assert.isNull(helper.lowerCaseOrNull(''));
    });

    it('should return lowercase string when string supplied', () => {
      assert.equal(helper.lowerCaseOrNull('TEST TEST'), 'test test');
    });
  });

  describe('checkNameCharacters', () => {
    it('should return false when blank', () => {
      assert.isFalse(helper.checkNameCharacters(''));
    });

    it('should return false when contains a invalid character', () => {
      assert.isFalse(helper.checkNameCharacters('Test!'));
    });

    it('should return true when contains a valid characters with space', () => {
      assert.isTrue(helper.checkNameCharacters('Test tester'));
    });

    it('should return true when contains a valid characters with full stop', () => {
      assert.isTrue(helper.checkNameCharacters('Test.'));
    });

    it('should return true when contains a valid characters with dash', () => {
      assert.isTrue(helper.checkNameCharacters('Test-tester'));
    });

    it('should return true when contains a valid characters with all', () => {
      assert.isTrue(helper.checkNameCharacters('Joe Test-tester The First.'));
    });
  });

  describe('isValidCurrency', () => {
    const invalid = ['1.1', '1.111', '.0', '1', '-1.00', '+1.00', 'aaa', '1,000.00'];
    invalid.forEach((value) => {
      it(`should return false when value is ${value}`, () => {
        assert.isFalse(helper.isValidCurrency(value));
      });
    });
    const valid = ['1.10', '0.11', '111.00', '123456.00'];
    valid.forEach((value) => {
      it(`should return true when value is ${value}`, () => {
        assert.isTrue(helper.isValidCurrency(value));
      });
    });
  });

  describe('isGreaterThenFiveCharacterExcludingPoint', () => {
    it('should return true when value is greater then 5 without point', () => {
      assert.isTrue(helper.isGreaterThenFiveCharacterExcludingPoint('123456'));
    });
    it('should return true when value is greater then 5 with point', () => {
      assert.isTrue(helper.isGreaterThenFiveCharacterExcludingPoint('1234.56'));
    });
    it('should return false when value is 5 with point', () => {
      assert.isFalse(helper.isGreaterThenFiveCharacterExcludingPoint('123.66'));
    });
    it('should return false when value is 5 without point', () => {
      assert.isFalse(helper.isGreaterThenFiveCharacterExcludingPoint('12345'));
    });
    it('should return false when value is less than 5 with point', () => {
      assert.isFalse(helper.isGreaterThenFiveCharacterExcludingPoint('12.66'));
    });
    it('should return false when value is less than 5 without point', () => {
      assert.isFalse(helper.isGreaterThenFiveCharacterExcludingPoint('1234'));
    });
  });

  describe('formatPaymentFrequency', () => {
    const weeklyString = 'weekly';
    it('should formatted frequency string for 1 week', () => {
      assert.equal(helper.formatPaymentFrequency('1W'), `1 ${weeklyString}`);
    });

    it('should formatted frequency string for 2 weeks', () => {
      assert.equal(helper.formatPaymentFrequency('2W'), `2 ${weeklyString}`);
    });

    it('should formatted frequency string for 4 weeks', () => {
      assert.equal(helper.formatPaymentFrequency('4W'), `4 ${weeklyString}`);
    });

    it('should formatted frequency string for 13 weeks', () => {
      assert.equal(helper.formatPaymentFrequency('13W'), `13 ${weeklyString}`);
    });
  });

  describe('checkFirstNameCharacters', () => {
    context('valid', () => {
      it('should return true when contains one valid character', () => {
        assert.isTrue(helper.checkFirstNameCharacters('T'));
      });

      it('should return true when contains valid characters with a space', () => {
        assert.isTrue(helper.checkFirstNameCharacters('Test tester'));
      });

      it('should return true when contains valid characters with a full stop', () => {
        assert.isTrue(helper.checkFirstNameCharacters('Test.tester'));
      });

      it('should return true when contains valid characters with a dash', () => {
        assert.isTrue(helper.checkFirstNameCharacters('Test-tester'));
      });

      it('should return true when contains valid characters with all', () => {
        assert.isTrue(helper.checkFirstNameCharacters('Joe Test-tester.The First'));
      });
    });

    context('invalid', () => {
      it('should return false when blank', () => {
        assert.isFalse(helper.checkFirstNameCharacters(''));
      });

      it('should return false when contains an invalid character', () => {
        assert.isFalse(helper.checkFirstNameCharacters('Test!tester'));
      });

      it('should return false when starts with a space', () => {
        assert.isFalse(helper.checkFirstNameCharacters(' Test'));
      });

      it('should return false when starts with a full stop', () => {
        assert.isFalse(helper.checkFirstNameCharacters('.Test'));
      });

      it('should return false when starts with a dash', () => {
        assert.isFalse(helper.checkFirstNameCharacters('-Test'));
      });

      it('should return false when starts with a apostrophe', () => {
        assert.isFalse(helper.checkFirstNameCharacters('\'Test'));
      });

      it('should return false when ends with a space', () => {
        assert.isFalse(helper.checkFirstNameCharacters('Test '));
      });

      it('should return false when ends with a full stop', () => {
        assert.isFalse(helper.checkFirstNameCharacters('Test.'));
      });

      it('should return false when ends with a dash', () => {
        assert.isFalse(helper.checkFirstNameCharacters('Test-'));
      });

      it('should return false when ends with a apostrophe', () => {
        assert.isFalse(helper.checkFirstNameCharacters('Test\''));
      });

      it('should return false when contains valid characters double spaces', () => {
        assert.isFalse(helper.checkFirstNameCharacters('Test  tester'));
      });

      it('should return false when contains valid characters double full stops', () => {
        assert.isFalse(helper.checkFirstNameCharacters('Test..tester'));
      });

      it('should return false when contains valid characters double dashes', () => {
        assert.isFalse(helper.checkFirstNameCharacters('Test--tester'));
      });

      it('should return false when contains valid characters double apostrophes', () => {
        assert.isFalse(helper.checkFirstNameCharacters('Test\'\'tester'));
      });

      it('should return false when contains valid characters consecutive punctuation', () => {
        assert.isFalse(helper.checkFirstNameCharacters('Test -tester'));
        assert.isFalse(helper.checkFirstNameCharacters('Test- tester'));
        assert.isFalse(helper.checkFirstNameCharacters('Test .tester'));
        assert.isFalse(helper.checkFirstNameCharacters('Test. tester'));
        assert.isFalse(helper.checkFirstNameCharacters('Test \'tester'));
        assert.isFalse(helper.checkFirstNameCharacters('Test\' tester'));
        assert.isFalse(helper.checkFirstNameCharacters('Test.-tester'));
        assert.isFalse(helper.checkFirstNameCharacters('Test-.tester'));
        assert.isFalse(helper.checkFirstNameCharacters('Test.\'tester'));
        assert.isFalse(helper.checkFirstNameCharacters('Test\'.tester'));
        assert.isFalse(helper.checkFirstNameCharacters('Test-\'tester'));
        assert.isFalse(helper.checkFirstNameCharacters('Test\'-tester'));
      });
    });
  });

  describe('checkLastNameCharacters', () => {
    context('valid', () => {
      it('should return true when contains valid characters with a space', () => {
        assert.isTrue(helper.checkLastNameCharacters('Test tester'));
      });

      it('should return true when contains valid characters with a full stop', () => {
        assert.isTrue(helper.checkLastNameCharacters('Test.tester'));
      });

      it('should return true when contains valid characters with a dash', () => {
        assert.isTrue(helper.checkLastNameCharacters('Test-tester'));
      });

      it('should return true when contains valid characters with all', () => {
        assert.isTrue(helper.checkLastNameCharacters('Joe Test-tester.The First'));
      });
    });

    context('invalid', () => {
      it('should return false when blank', () => {
        assert.isFalse(helper.checkLastNameCharacters(''));
      });

      it('should return true when contains one valid character', () => {
        assert.isFalse(helper.checkLastNameCharacters('T'));
      });

      it('should return false when contains an invalid character', () => {
        assert.isFalse(helper.checkLastNameCharacters('Test!tester'));
      });

      it('should return false when starts with a space', () => {
        assert.isFalse(helper.checkLastNameCharacters(' Test'));
      });

      it('should return false when starts with a full stop', () => {
        assert.isFalse(helper.checkLastNameCharacters('.Test'));
      });

      it('should return false when starts with a dash', () => {
        assert.isFalse(helper.checkLastNameCharacters('-Test'));
      });

      it('should return false when starts with a apostrophe', () => {
        assert.isFalse(helper.checkLastNameCharacters('\'Test'));
      });

      it('should return false when ends with a space', () => {
        assert.isFalse(helper.checkLastNameCharacters('Test '));
      });

      it('should return false when ends with a full stop', () => {
        assert.isFalse(helper.checkLastNameCharacters('Test.'));
      });

      it('should return false when ends with a dash', () => {
        assert.isFalse(helper.checkLastNameCharacters('Test-'));
      });

      it('should return false when ends with a apostrophe', () => {
        assert.isFalse(helper.checkLastNameCharacters('Test\''));
      });

      it('should return false when contains valid characters double spaces', () => {
        assert.isFalse(helper.checkLastNameCharacters('Test  tester'));
      });

      it('should return false when contains valid characters double full stops', () => {
        assert.isFalse(helper.checkLastNameCharacters('Test..tester'));
      });

      it('should return false when contains valid characters double dashes', () => {
        assert.isFalse(helper.checkLastNameCharacters('Test--tester'));
      });

      it('should return false when contains valid characters double apostrophes', () => {
        assert.isFalse(helper.checkLastNameCharacters('Test\'\'tester'));
      });

      it('should return false when contains valid characters consecutive punctuation', () => {
        assert.isFalse(helper.checkLastNameCharacters('Test -tester'));
        assert.isFalse(helper.checkLastNameCharacters('Test- tester'));
        assert.isFalse(helper.checkLastNameCharacters('Test .tester'));
        assert.isFalse(helper.checkLastNameCharacters('Test. tester'));
        assert.isFalse(helper.checkLastNameCharacters('Test \'tester'));
        assert.isFalse(helper.checkLastNameCharacters('Test\' tester'));
        assert.isFalse(helper.checkLastNameCharacters('Test.-tester'));
        assert.isFalse(helper.checkLastNameCharacters('Test-.tester'));
        assert.isFalse(helper.checkLastNameCharacters('Test.\'tester'));
        assert.isFalse(helper.checkLastNameCharacters('Test\'.tester'));
        assert.isFalse(helper.checkLastNameCharacters('Test-\'tester'));
        assert.isFalse(helper.checkLastNameCharacters('Test\'-tester'));
      });
    });
  });
});
