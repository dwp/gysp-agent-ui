const httpStatus = require('http-status-codes');

const i18n = require('i18next');

i18n.init({ sendMissingTo: 'fallback' });

module.exports = {
  globalErrorMessage(error, service) {
    if (error.statusCode === httpStatus.BAD_REQUEST) {
      return i18n.t('app:errors.api.bad-request');
    }
    if (error.statusCode === httpStatus.INTERNAL_SERVER_ERROR) {
      return i18n.t('app:errors.api.internal-server-error');
    }
    if (error.statusCode === httpStatus.NOT_FOUND) {
      return i18n.t('app:errors.api.not-found', { SERVICE: service });
    }
    return i18n.t('app:errors.api.no-status');
  },
};
