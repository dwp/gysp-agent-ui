const { assert } = require('chai');
const httpStatus = require('http-status-codes');

const helper = require('../../../../lib/helpers/errorHelper');

describe('error helper', () => {
  describe('globalErrorMessage', () => {
    it('should return string then state code 400', () => {
      assert.equal(helper.globalErrorMessage({ statusCode: httpStatus.BAD_REQUEST }), 'app:errors.api.bad-request');
    });
    it('should return string then state code 404', () => {
      assert.equal(helper.globalErrorMessage({ statusCode: httpStatus.NOT_FOUND }, 'service'), 'app:errors.api.not-found');
    });
    it('should return string then state code 500', () => {
      assert.equal(helper.globalErrorMessage({ statusCode: httpStatus.INTERNAL_SERVER_ERROR }), 'app:errors.api.internal-server-error');
    });
  });
});
