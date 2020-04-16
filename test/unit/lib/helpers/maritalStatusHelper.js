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

const newStatusOptionsCheckedFalse = [
  {
    value: 'divorced', text: 'marital-status:fields.status.options.divorced', id: 'maritalStatus-divorced', checked: false,
  }, {
    value: 'widowed', text: 'marital-status:fields.status.options.widowed', id: 'maritalStatus-widowed', checked: false,
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
      const result = helper.newStatusOptions('single');
      assert.isNull(result);
    });
    it('should return object with checked as false when valid status supplied', () => {
      const result = helper.newStatusOptions('married');
      assert.deepEqual(result, newStatusOptionsCheckedFalse);
    });
    it('should return object with divorced checked as true when married status supplied and divorced selected', () => {
      const result = helper.newStatusOptions('married', 'divorced');
      assert.isTrue(result[0].checked);
      assert.isFalse(result[1].checked);
    });
    it('should return object with widowed checked as true when married status supplied and widowed selected', () => {
      const result = helper.newStatusOptions('married', 'widowed');
      assert.isTrue(result[1].checked);
      assert.isFalse(result[0].checked);
    });
  });
  describe('currentOrNewShortStatus', () => {
    it('should return short new status when new status is defined', () => {
      assert.equal(helper.currentOrNewShortStatus('Married', 'Divorsed'), 'divorsed');
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
      assert.equal(helper.maritalDateBackHref('divorsed'), '/marital-details/status');
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
      assert.isTrue(helper.hasMaritalStatusChanged('married', 'divorsed'));
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
      assert.equal(helper.maritalDateSuccessAlert('married', 'divorsed', 'V'), 'marital-status:success-message');
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
});
