const { assert } = require('chai');

const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../../config/i18next');

const helper = require('../../../../lib/helpers/maritalStatusHelper');

const validStatus = {
  single: 'Single',
  married: 'Married',
  civil: 'Civil Partnership',
  divorced: 'Divorced',
  dissolved: 'Dissolved',
  widowed: 'Widowed',
};
const validStatusArray = Object.entries(validStatus).map(([key, value]) => ({ key, value }));

const newStatusDivorcedWidowedOptionsCheckedFalse = [
  {
    value: 'divorced', text: 'Divorced', id: 'maritalStatus-divorced', checked: false,
  }, {
    value: 'widowed', text: 'Widowed', id: 'maritalStatus-widowed', checked: false,
  },
];

const newStatusDissolvedWidowedOptionsCheckedFalse = [
  {
    value: 'dissolved', text: 'Dissolved civil partnership', id: 'maritalStatus-dissolved', checked: false,
  }, {
    value: 'widowed', text: 'Widowed', id: 'maritalStatus-widowed', checked: false,
  },
];

const newStatusMarriedCivilOptionsCheckedFalse = [
  {
    value: 'civil', text: 'In a civil partnership', id: 'maritalStatus-civil', checked: false,
  }, {
    value: 'married', text: 'Married', id: 'maritalStatus-married', checked: false,
  },
];

describe('marital status helper', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

  describe('transformToShortStatus', () => {
    validStatusArray.forEach((item) => {
      it(`should return formatted short status when ${item.value} status is passed`, () => {
        assert.equal(helper.transformToShortStatus(item.value), item.key);
      });
    });
  });

  describe('transformToOriginalStatus', () => {
    validStatusArray.forEach((item) => {
      it(`should return formatted short status when ${item.key} status is passed`, () => {
        assert.equal(helper.transformToOriginalStatus(item.key), item.value);
      });
    });
  });

  describe('newStatusOptions', () => {
    it('should return null when status is invalid', () => {
      const result = helper.newStatusOptions('invalid');
      assert.isNull(result);
    });
    ['single', 'dissolved', 'divorced', 'widowed'].forEach((s) => {
      it(`should return ${s} object options with checked as false when valid status supplied`, () => {
        const result = helper.newStatusOptions(s);
        assert.deepEqual(result, newStatusMarriedCivilOptionsCheckedFalse);
      });

      it(`should return ${s} object with civil checked as true when ${s} status supplied and civil selected`, () => {
        const result = helper.newStatusOptions(s, 'civil');
        assert.isTrue(result[0].checked);
        assert.isFalse(result[1].checked);
      });

      it(`should return ${s} object with civil checked as true when ${s} status supplied and married selected`, () => {
        const result = helper.newStatusOptions(s, 'married');
        assert.isFalse(result[0].checked);
        assert.isTrue(result[1].checked);
      });
    });

    it('should return married object options with checked as false when valid status supplied', () => {
      const result = helper.newStatusOptions('married');
      assert.deepEqual(result, newStatusDivorcedWidowedOptionsCheckedFalse);
    });

    it('should return married object with divorced checked as true when married status supplied and divorced selected', () => {
      const result = helper.newStatusOptions('married', 'divorced');
      assert.isTrue(result[0].checked);
      assert.isFalse(result[1].checked);
    });

    it('should return married object with widowed checked as true when married status supplied and widowed selected', () => {
      const result = helper.newStatusOptions('married', 'widowed');
      assert.isTrue(result[1].checked);
      assert.isFalse(result[0].checked);
    });

    it('should return civil object options with checked as false when valid status supplied', () => {
      const result = helper.newStatusOptions('civil');
      assert.deepEqual(result, newStatusDissolvedWidowedOptionsCheckedFalse);
    });

    it('should return civil object with dissolved checked as true when civil status supplied and dissolved selected', () => {
      const result = helper.newStatusOptions('civil', 'dissolved');
      assert.isTrue(result[0].checked);
      assert.isFalse(result[1].checked);
    });

    it('should return civil object with widowed checked as true when civil status supplied and widowed selected', () => {
      const result = helper.newStatusOptions('civil', 'widowed');
      assert.isTrue(result[1].checked);
      assert.isFalse(result[0].checked);
    });
  });

  describe('currentOrNewShortStatus', () => {
    it('should return short new status when new status is defined', () => {
      assert.equal(helper.currentOrNewShortStatus('Married', 'Divorced'), 'divorced');
    });

    it('should return short current marital status when new status is not provided', () => {
      assert.equal(helper.currentOrNewShortStatus('Married'), 'married');
    });

    it('should return short current marital status when new status is undefined', () => {
      assert.equal(helper.currentOrNewShortStatus('Married', undefined), 'married');
    });
  });

  describe('maritalDateBackHref', () => {
    it('should return marital status url when new status is defined', () => {
      assert.equal(helper.maritalDateBackHref('divorced'), '/marital-details/status');
    });

    it('should return marital details url when new status is not provided', () => {
      assert.equal(helper.maritalDateBackHref(), '/marital-details');
    });

    it('should return marital details url when new status is undefined', () => {
      assert.equal(helper.maritalDateBackHref(undefined), '/marital-details');
    });
  });

  describe('hasMaritalStatusChanged', () => {
    it('should return true when current status is different to new status', () => {
      assert.isTrue(helper.hasMaritalStatusChanged('married', 'divorced'));
    });

    it('should return false when current status is same as new status', () => {
      assert.isFalse(helper.hasMaritalStatusChanged('married', 'married'));
    });

    it('should return false when new status is not provided', () => {
      assert.isFalse(helper.hasMaritalStatusChanged('married'));
    });

    it('should return false when new status is undefined', () => {
      assert.isFalse(helper.hasMaritalStatusChanged('married', undefined));
    });
  });

  describe('maritalDateSuccessAlert', () => {
    it('should return success alert key for marital status changed when current and new status are different', () => {
      assert.equal(helper.maritalDateSuccessAlert('married', 'divorced', 'V'), 'Marital status changed');
    });

    it('should return success alert key for marital status changed and award updated', () => {
      assert.equal(helper.maritalDateSuccessAlert('married', 'widowed', 'V', '-award-updated'), 'Marital status changed - award updated');
    });

    it('should return success alert key for marital status changed and no change to award', () => {
      assert.equal(helper.maritalDateSuccessAlert('married', 'widowed', 'V', '-no-change-to-award'), 'Marital status changed - no change to award');
    });

    it('should return success alert key for verified marital date changed when current and new status are the same', () => {
      assert.equal(helper.maritalDateSuccessAlert('married', 'married', 'V'), 'Date of marriage verified');
    });

    it('should return success alert key for not verified marital date changed when current and new status are the same', () => {
      assert.equal(helper.maritalDateSuccessAlert('married', 'married', 'NV'), 'Date of marriage not verified');
    });
  });

  describe('verificationStatusTransformer', () => {
    it('should return verified when verification status is V', () => {
      assert.equal(helper.verificationStatusTransformer('V'), 'verified');
    });

    it('should return not verified when verification status is NV', () => {
      assert.equal(helper.verificationStatusTransformer('NV'), 'not-verified');
    });
  });

  describe('maritalDateButton', () => {
    it('should return continue button when status is married and widowInheritanceFeature is false', () => {
      assert.equal(helper.maritalDateButton('married', false), 'Continue');
    });

    it('should return continue button when status is civil and widowInheritanceFeature is false', () => {
      assert.equal(helper.maritalDateButton('civil', false), 'Continue');
    });

    it('should return save button when status is widowed and widowInheritanceFeature is false', () => {
      assert.equal(helper.maritalDateButton('widowed', false), 'Save');
    });

    it('should return continue button when status is married and widowInheritanceFeature is true', () => {
      assert.equal(helper.maritalDateButton('married', true), 'Continue');
    });

    it('should return continue button when status is civil and widowInheritanceFeature is true', () => {
      assert.equal(helper.maritalDateButton('civil', true), 'Continue');
    });

    it('should return save button when status is widowed and widowInheritanceFeature is true', () => {
      assert.equal(helper.maritalDateButton('widowed', true), 'Continue');
    });
  });

  describe('newMaritalStatusRequiresPartnerDetails', () => {
    it('should return true when status is married', () => {
      assert.isTrue(helper.newMaritalStatusRequiresPartnerDetails('married'));
    });

    it('should return true when status is civil', () => {
      assert.isTrue(helper.newMaritalStatusRequiresPartnerDetails('civil'));
    });

    it('should return false when status is widowed', () => {
      assert.isFalse(helper.newMaritalStatusRequiresPartnerDetails('widowed'));
    });
  });

  describe('redirectUrlBasedOnStatusPartner', () => {
    it('should return spouse url when status is married', () => {
      assert.equal(helper.redirectUrlBasedOnStatusPartner('married'), 'spouse-details');
    });

    it('should return partner url when status is civil', () => {
      assert.equal(helper.redirectUrlBasedOnStatusPartner('civil'), 'partner-details');
    });

    it('should return date url when status is widowed', () => {
      assert.equal(helper.redirectUrlBasedOnStatusPartner('widowed'), 'date');
    });
  });

  describe('maritalDateToComponents', () => {
    it('should return marital date components when status is married and marriage date is available', () => {
      assert.deepEqual(helper.maritalDateToComponents({ marriageDate: 1599368400000 }, 'Married'), { dateDay: '06', dateMonth: '09', dateYear: '2020' });
    });

    it('should return marital date components when status is civil partnership and civil partnership date is available', () => {
      assert.deepEqual(helper.maritalDateToComponents({ civilPartnershipDate: 1599368400000 }, 'Civil Partnership'), { dateDay: '06', dateMonth: '09', dateYear: '2020' });
    });

    it('should return marital date components when status is divorced and divorced date is available', () => {
      assert.deepEqual(helper.maritalDateToComponents({ divorcedDate: 1599368400000 }, 'Divorced'), { dateDay: '06', dateMonth: '09', dateYear: '2020' });
    });

    it('should return marital date components when status is dissolved and dissolved date is available', () => {
      assert.deepEqual(helper.maritalDateToComponents({ dissolvedDate: 1599368400000 }, 'Dissolved'), { dateDay: '06', dateMonth: '09', dateYear: '2020' });
    });

    it('should return marital date components when status is widowed and widowed date is available', () => {
      assert.deepEqual(helper.maritalDateToComponents({ widowedDate: 1599368400000 }, 'Widowed'), { dateDay: '06', dateMonth: '09', dateYear: '2020' });
    });

    it('should return false when status is married but date is undefined', () => {
      assert.isFalse(helper.maritalDateToComponents({ }, 'Married'));
    });

    it('should return false when status is civil partnership but date is undefined', () => {
      assert.isFalse(helper.maritalDateToComponents({ }, 'Civil Partnership'));
    });

    it('should return false when status is divorced but date is undefined', () => {
      assert.isFalse(helper.maritalDateToComponents({ }, 'Divorced'));
    });

    it('should return false when status is dissolved but date is undefined', () => {
      assert.isFalse(helper.maritalDateToComponents({ }, 'Dissolved'));
    });

    it('should return false when status is widowed but date is undefined', () => {
      assert.isFalse(helper.maritalDateToComponents({ }, 'Widowed'));
    });

    it('should return false when status is null', () => {
      assert.isFalse(helper.maritalDateToComponents({ }, null));
    });
  });

  describe('maritalDate', () => {
    it('should return marital date when status is married and marriage date is available', () => {
      assert.equal(helper.maritalDate({ marriageDate: 1599368400000 }, 'Married'), 1599368400000);
    });

    it('should return marital date when status is civil partnership and civil partnership date is available', () => {
      assert.equal(helper.maritalDate({ civilPartnershipDate: 1599368400000 }, 'Civil Partnership'), 1599368400000);
    });

    it('should return marital date when status is divorced and divorced date is available', () => {
      assert.equal(helper.maritalDate({ divorcedDate: 1599368400000 }, 'Divorced'), 1599368400000);
    });

    it('should return marital date when status is dissolved and dissolved date is available', () => {
      assert.equal(helper.maritalDate({ dissolvedDate: 1599368400000 }, 'Dissolved'), 1599368400000);
    });

    it('should return marital date when status is widowed and widowed date is available', () => {
      assert.equal(helper.maritalDate({ widowedDate: 1599368400000 }, 'Widowed'), 1599368400000);
    });

    it('should return false when status is married but date is undefined', () => {
      assert.isFalse(helper.maritalDate({ }, 'Married'));
    });

    it('should return false when status is civil partnership but date is undefined', () => {
      assert.isFalse(helper.maritalDate({ }, 'Civil Partnership'));
    });

    it('should return false when status is divorced but date is undefined', () => {
      assert.isFalse(helper.maritalDate({ }, 'Divorced'));
    });

    it('should return false when status is dissolved but date is undefined', () => {
      assert.isFalse(helper.maritalDate({ }, 'Dissolved'));
    });

    it('should return false when status is widowed but date is undefined', () => {
      assert.isFalse(helper.maritalDate({ }, 'Widowed'));
    });

    it('should return false when status is null', () => {
      assert.isFalse(helper.maritalDate({ }, null));
    });
  });
});
