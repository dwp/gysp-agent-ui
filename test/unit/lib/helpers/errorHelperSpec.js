const { assert } = require('chai');

const httpStatus = require('http-status-codes');

const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../../config/i18next');

const helper = require('../../../../lib/helpers/errorHelper');

describe('error helper', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

  describe('globalErrorMessage', () => {
    it('should return string then state code 400', () => {
      assert.equal(helper.globalErrorMessage({ statusCode: httpStatus.BAD_REQUEST }), 'There has been a problem with the service, please go back and try again. This has been logged.');
    });

    it('should return string then state code 404', () => {
      assert.equal(helper.globalErrorMessage({ statusCode: httpStatus.NOT_FOUND }, 'service'), 'There has been a problem - service not found. This has been logged.');
    });

    it('should return string then state code 500', () => {
      assert.equal(helper.globalErrorMessage({ statusCode: httpStatus.INTERNAL_SERVER_ERROR }), 'There has been a problem with the service, please try again. This has been logged.');
    });
  });
});
