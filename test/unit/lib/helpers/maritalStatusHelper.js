const { assert } = require('chai');

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
    value: 'divorced', text: 'marital-status:fields.status.options.divorced', id: 'maritalStatus-divorced', checked: false,
  }, {
    value: 'widowed', text: 'marital-status:fields.status.options.widowed', id: 'maritalStatus-widowed', checked: false,
  },
];

const newStatusDissolvedWidowedOptionsCheckedFalse = [
  {
    value: 'dissolved', text: 'marital-status:fields.status.options.dissolved', id: 'maritalStatus-dissolved', checked: false,
  }, {
    value: 'widowed', text: 'marital-status:fields.status.options.widowed', id: 'maritalStatus-widowed', checked: false,
  },
];

const newStatusMarriedCivilOptionsCheckedFalse = [
  {
    value: 'civil', text: 'marital-status:fields.status.options.civil', id: 'maritalStatus-civil', checked: false,
  }, {
    value: 'married', text: 'marital-status:fields.status.options.married', id: 'maritalStatus-married', checked: false,
  },
];

describe('marital status helper', () => {
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
      const result = helper.newStatusOptions('invaild');
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
      assert.equal(helper.maritalDateSuccessAlert('married', 'divorced', 'V'), 'marital-status:success-message');
    });
    it('should return success alert key for verified marital date changed when current and new status are the same', () => {
      assert.equal(helper.maritalDateSuccessAlert('married', 'married', 'V'), 'marital-date:success-message.married.verified');
    });
    it('should return success alert key for not verified marital date changed when current and new status are the same', () => {
      assert.equal(helper.maritalDateSuccessAlert('married', 'married', 'NV'), 'marital-date:success-message.married.not-verified');
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
    it('should return continue button when status is married', () => {
      assert.equal(helper.maritalDateButton('married'), 'app:button.continue');
    });
    it('should return continue button when status is civil', () => {
      assert.equal(helper.maritalDateButton('civil'), 'app:button.continue');
    });
    it('should return save button when status is widowed', () => {
      assert.equal(helper.maritalDateButton('widowed'), 'app:button.save');
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
});
