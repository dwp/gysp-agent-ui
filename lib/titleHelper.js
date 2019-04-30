const request = require('request-promise');

const requestHelper = require('../lib/requestHelper');
const config = require('../config/yaml');

const apiGateway = process.env.GATEWAY ? process.env.GATEWAY : config.application.urls.agentGateway;

/* istanbul ignore next */
module.exports = {
  getTitleList(callback) {
    const titleList = requestHelper.generateGetCall(`${apiGateway}api/customer/titles`);
    request(titleList).then((req) => {
      callback(undefined, req);
    }).catch((err) => {
      callback(err, undefined);
    });
  },
};
