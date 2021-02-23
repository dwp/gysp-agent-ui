const request = require('request-promise');
const { StatusCodes } = require('http-status-codes');
const requestHelper = require('../requestHelper');

const postcodeLookupApiUri = 'address?excludeBusiness=true&showSourceData=true&postcode=';

module.exports = {
  getPostCodeAddressLookup(res, postcode) {
    return new Promise((resolve, reject) => {
      const apiUri = res.locals.agentGateway + postcodeLookupApiUri + postcode;
      const getPostcodeLookupCall = requestHelper.generateGetCall(apiUri, {}, 'address');
      request(getPostcodeLookupCall).then((response) => {
        if (response.data && response.data.length > 0) {
          resolve(response);
        } else {
          const error = new Error('address data not supplied');
          error.statusCode = StatusCodes.NOT_FOUND;
          throw error;
        }
      }).catch((err) => {
        const traceID = requestHelper.getTraceID(err);
        const type = err.statusCode === 404 ? 'info' : 'error';
        requestHelper.loggingHelper(err, postcodeLookupApiUri + postcode, traceID, res.locals.logger, type);
        reject(err);
      });
    });
  },
};
