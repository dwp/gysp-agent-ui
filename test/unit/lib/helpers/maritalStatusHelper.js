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

describe('marital status helper', () => {
  describe('transformToShortStatus', () => {
    validStatusArray.forEach((item) => {
      it(`should return formatted short status when ${item.value} status is passed`, () => {
        assert.equal(helper.transformToShortStatus(item.value), item.key);
      });
    });
  });
});
