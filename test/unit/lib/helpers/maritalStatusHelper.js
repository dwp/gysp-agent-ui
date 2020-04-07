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
});
