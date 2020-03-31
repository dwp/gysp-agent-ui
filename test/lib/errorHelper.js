const httpStatus = require('http-status-codes');

module.exports = {
  errorMessage(statusCode) {
    if (statusCode === httpStatus.BAD_REQUEST) {
      return 'app:errors.api.bad-request';
    }
    if (statusCode === httpStatus.INTERNAL_SERVER_ERROR) {
      return 'app:errors.api.internal-server-error';
    }
    if (statusCode === httpStatus.NOT_FOUND) {
      return 'app:errors.api.not-found';
    }
    return 'app:errors.api.no-status';
  },
};
