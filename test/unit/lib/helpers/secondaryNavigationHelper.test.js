const { assert } = require('chai');

const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../../config/i18next');

const helper = require('../../../../lib/helpers/secondaryNavigationHelper');

const baseRoute = '/changes-and-enquiries';

const navigationResponse = [{
  text: 'Personal',
  href: `${baseRoute}/personal`,
  visuallyHiddenTextStart: 'Navigate to',
  visuallyHiddenTextEnd: 'details',
}, {
  text: 'Contact',
  href: `${baseRoute}/contact`,
  visuallyHiddenTextStart: 'Navigate to',
  visuallyHiddenTextEnd: 'details',
}, {
  text: 'Award',
  href: `${baseRoute}/award`,
  visuallyHiddenTextStart: 'Navigate to State Pension',
  visuallyHiddenTextEnd: 'details',
}, {
  text: 'Payment',
  href: `${baseRoute}/payment`,
  visuallyHiddenTextStart: 'Navigate to',
  visuallyHiddenTextEnd: 'details',
}];

describe('secondary navigation helper', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

  describe('navigationItems', () => {
    it('should be a function', () => {
      assert.isFunction(helper.navigationItems);
    });

    it('should return an array', () => {
      assert.isArray(helper.navigationItems());
    });

    it('should return an array with 4 items', () => {
      assert.lengthOf(helper.navigationItems(), 4);
    });

    it('should return an array with no selected value when undefined', () => {
      assert.deepEqual(helper.navigationItems(), navigationResponse);
    });

    it('should return an array with no selected value when does not match', () => {
      assert.deepEqual(helper.navigationItems('foo'), navigationResponse);
    });

    it('should return an array with selected value when personal selected', () => {
      const selectedNavigationResponse = JSON.parse(JSON.stringify(navigationResponse));
      selectedNavigationResponse[0].selected = true;
      assert.deepEqual(helper.navigationItems('personal'), selectedNavigationResponse);
    });

    it('should return an array with selected value when contact selected', () => {
      const selectedNavigationResponse = JSON.parse(JSON.stringify(navigationResponse));
      selectedNavigationResponse[1].selected = true;
      assert.deepEqual(helper.navigationItems('contact'), selectedNavigationResponse);
    });

    it('should return an array with selected value when award selected', () => {
      const selectedNavigationResponse = JSON.parse(JSON.stringify(navigationResponse));
      selectedNavigationResponse[2].selected = true;
      assert.deepEqual(helper.navigationItems('award'), selectedNavigationResponse);
    });

    it('should return an array with selected value when payment selected', () => {
      const selectedNavigationResponse = JSON.parse(JSON.stringify(navigationResponse));
      selectedNavigationResponse[3].selected = true;
      assert.deepEqual(helper.navigationItems('payment'), selectedNavigationResponse);
    });
  });
});
