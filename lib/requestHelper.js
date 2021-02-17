const itemID = require('itemid');

const config = require('../config/application');

const certsInfo = {
  rejectUnauthorized: false,
  json: true,
};

const { apiHost } = config.application.urls;

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
    headers.apiKey = config.application.urls.awardApiKey;
  } else if (apikeyType === 'award') {
    headers.apiKey = config.application.urls.awardApiKey;
  } else if (apikeyType === 'payment') {
    headers.apiKey = config.application.urls.paymentApiKey;
  } else if (apikeyType === 'address') {
    headers.apiKey = config.application.urls.addressLookupApiKey;
  } else if (apikeyType === 'hmrc-calculation') {
    headers.apiKey = config.application.urls.hmrcCalculationApiKey;
  } else if (apikeyType === 'audit') {
    headers.apiKey = config.application.urls.auditApiKey;
  } else if (apikeyType === 'event') {
    headers.apiKey = config.application.urls.eventApiKey;
  } else if (apikeyType === 'work-items') {
    headers.apiKey = config.application.urls.workItemsApiKey;
  } else {
    headers.apiKey = config.application.urls.apiKey;
  }

  if (agentRefObject !== undefined) {
    headers.agentRef = agentRefObject.cis.dwp_staffid;
    headers.location = agentRefObject.cis.SLOC;
  }

  return headers;
}

module.exports = {
  requestClaimPDF(inviteKey, url, agentRefObject) {
    const call = this.generateGetCall(`${url}api/claim/${inviteKey}`);
    delete call.json;
    call.headers = getHeaders('application/pdf');
    call.headers.agentRef = agentRefObject.cis.dwp_staffid;
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

    call.headers.agentRef = agentRefObject.cis.dwp_staffid;
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
  generatePostCall(url, body, apiKeyType, agentRefObject) {
    return this.generateCall(url, body, 'POST', apiKeyType, agentRefObject);
  },
  generateGetCall(url, body, apiKeyType, agentRefObject) {
    return this.generateCall(url, body, 'GET', apiKeyType, agentRefObject);
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
  getPath(errors) {
    if (errors.response !== undefined && errors.response.request !== undefined) {
      return errors.response.request.path;
    }
    return 'no path';
  },
  loggingHelper(error, location, traceID, logger, type = 'error') {
    if (type === 'error') {
      if (error.statusCode) {
        logger.error({ traceID }, `${error.statusCode} - ${error.message} - Requested on ${location}`);
      } else {
        logger.error({ traceID }, `Other - ${error.message} - Requested on ${location}`);
      }
    } else {
      logger.info({ traceID }, `${error.statusCode} - ${error.message} - Requested on ${location}`);
    }
  },
};
