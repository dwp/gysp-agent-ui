const httpStatus = require('http-status-codes');

module.exports = {
  errorMessage(statusCode) {
    if (statusCode === httpStatus.BAD_REQUEST) {
      return 'There has been a problem with the service, please go back and try again. This has been logged.';
    }
    if (statusCode === httpStatus.INTERNAL_SERVER_ERROR) {
      return 'There has been a problem with the service, please try again. This has been logged.';
    }
    if (statusCode === httpStatus.NOT_FOUND) {
      return 'app:errors.api.not-found';
    }
    return 'app:errors.api.no-status';
  },
};
