const itemID = require('itemid');
const encyption = require('../lib/encryption');

const config = require('../config/yaml');

const apiHost = process.env.GATEWAYHOST ? process.env.GATEWAYHOST : config.application.urls.host;

const certsInfo = {
  rejectUnauthorized: false,
  json: true,
};

const apikey = encyption.decrypt(config.application.urls.apiKey, config.secret);
const batchApiKey = encyption.decrypt(config.application.urls.batchApiKey, config.secret);
const awardApiKey = encyption.decrypt(config.application.urls.awardApiKey, config.secret);
const paymentApiKey = encyption.decrypt(config.application.urls.paymentApiKey, config.secret);
const addressApiKey = encyption.decrypt(config.application.urls.addressLookupApiKey, config.secret);
const hmrcCalculationApiKey = encyption.decrypt(config.application.urls.hmrcCalculationApiKey, config.secret);
const auditApiKey = encyption.decrypt(config.application.urls.auditApiKey, config.secret);

function getHeaders(type, apikeyType, agentRefObject) {
  const id = itemID.newId();
  let contentType = type;
  if (type === undefined) {
    contentType = 'application/json';
  }
  const headers = {
    'User-Agent': 'Frontend',
    'X-B3-TraceId': id,
    'X-B3-SpanId': id,
    Host: apiHost,
    'Content-Type': contentType,
  };
  if (apikeyType === 'batch') {
    headers.apiKey = batchApiKey;
  } else if (apikeyType === 'award') {
    headers.apiKey = awardApiKey;
  } else if (apikeyType === 'payment') {
    headers.apiKey = paymentApiKey;
  } else if (apikeyType === 'address') {
    headers.apiKey = addressApiKey;
  } else if (apikeyType === 'hmrc-calculation') {
    headers.apiKey = hmrcCalculationApiKey;
  } else if (apikeyType === 'audit') {
    headers.apiKey = auditApiKey;
  } else {
    headers.apiKey = apikey;
  }

  if (agentRefObject !== undefined) {
    headers.agentRef = `${agentRefObject.cis.givenname} ${agentRefObject.cis.surname}`;
  }

  return headers;
}

module.exports = {
  requestClaimPDF(inviteKey, url, agentRefObject) {
    const call = this.generateGetCall(`${url}api/claim/${inviteKey}`);
    delete call.json;
    call.headers = getHeaders('application/pdf');
    call.headers.agentRef = `${agentRefObject.cis.givenname} ${agentRefObject.cis.surname}`;
    call.encoding = null;
    call.resolveWithFullResponse = true;
    return call;
  },
  generateStatusUpdate(inviteKey, url, agentRefObject, requestedStatus) {
    let apiEndpoint;
    switch (requestedStatus) {
    case 'queue':
      apiEndpoint = 'api/claim/claiminerror';
      break;

    case 'COMPLETE':
      apiEndpoint = 'api/claim/completeoverseasclaim';
      break;

    case 'CREATED':
      apiEndpoint = 'api/claim/claimnotuploaded';
      break;

    default:
      apiEndpoint = 'api/claim/completeclaim';
    }

    const call = this.generatePutCall(url + apiEndpoint, { inviteKey });

    call.headers.agentRef = `${agentRefObject.cis.givenname} ${agentRefObject.cis.surname}`;
    return call;
  },
  requestCSV(url) {
    const call = this.generateGetCall(url);
    delete call.json;
    call.headers = getHeaders();
    call.headers.Accept = 'text/plain';
    return call;
  },
  generatePutCall(url, body, apiKeyType, agentRefObject) {
    return this.generateCall(url, body, 'PUT', apiKeyType, agentRefObject);
  },
  generatePostCall(url, body, apiKeyType) {
    return this.generateCall(url, body, 'POST', apiKeyType);
  },
  generateGetCall(url, body, apiKeyType) {
    return this.generateCall(url, body, 'GET', apiKeyType);
  },
  generateGetCallWithFullResponse(url, body, apiKeyType) {
    return this.generateCall(url, body, 'GET', apiKeyType, undefined, true);
  },
  generateCall(url, body, method, apiKeyType, agentRefObject, resolveWithFullResponse) {
    const call = {
      headers: getHeaders(undefined, apiKeyType, agentRefObject),
      url,
      body,
    };

    if (resolveWithFullResponse === true) {
      call.simple = false;
      call.resolveWithFullResponse = true;
    }

    if (method !== undefined) {
      call.method = method;
    }
    return Object.assign(call, certsInfo);
  },
  getTraceID(errors) {
    if (errors.options !== undefined) {
      return errors.options.headers['X-B3-TraceId'];
    }
    return 'no trace ID';
  },
  loggingHelper(error, location, traceID, logger) {
    if (error.statusCode) {
      logger.error({ traceID }, `${error.statusCode} - ${error.message} - Requested on ${location}`);
    } else {
      logger.error({ traceID }, `Other - ${error.message} - Requested on ${location}`);
    }
  },
};
