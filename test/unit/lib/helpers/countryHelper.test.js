const { assert } = require('chai');

const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../../config/i18next');

const helper = require('../../../../lib/helpers/countryHelper');

describe('country helper', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

  describe('getCountryList', () => {
    it('should be defined', () => {
      assert.isDefined(helper.getCountryList);
    });

    it('should be a function', () => {
      assert.isFunction(helper.getCountryList);
    });

    it('should return array when no params passed in', () => {
      assert.isArray(helper.getCountryList());
    });

    it('should return array when params are passed in', () => {
      assert.isArray(helper.getCountryList('ESP:Spain', 'country:placeholder'));
    });

    it('should return 32 countries options with 1 blank option', () => {
      assert.lengthOf(helper.getCountryList(), 33);
    });

    it('should return options with portugal selected', () => {
      const options = helper.getCountryList('PRT:Portugal').filter((country) => country.selected);
      assert.lengthOf(options, 1);
      assert.equal(options[0].value, 'PRT:Portugal');
      assert.equal(options[0].text, 'Portugal');
    });

    it('should return array with first option blank with default select text', () => {
      const option = helper.getCountryList(null)[0];
      assert.equal(option.value, '');
      assert.equal(option.text, 'Select an option');
    });

    it('should return array with first option blank with custom select text', () => {
      const option = helper.getCountryList(null, 'app:service_name')[0];
      assert.equal(option.value, '');
      assert.equal(option.text, 'DWP');
    });
  });
});
