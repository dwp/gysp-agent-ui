module.exports = {
  genericResponse() {
    const genericResponse = {
      locals: { agentGateway: 'http://localhost:3000/' },
      viewName: '',
      data: {},
      address: '',
      currentStatus: '',
      redirect(url) {
        this.address = url;
      },
      render(view, viewData) {
        this.viewName = view;
        this.data = viewData;
      },
      status(value) {
        this.currentStatus = value;
      },
    };
    return genericResponse;
  },
  localResponse(genericResponse) {
    const response = genericResponse;
    return {
      traceID: '',
      logMessage: '',
      agentGateway: 'http://test-url/',
      logger: {
        error(traceID, errorTxt) {
          response.locals.traceID = traceID;
          response.locals.logMessage = errorTxt;
        },
      },
    };
  },
  csvResponse() {
    const genericResponse = this.genericResponse();
    genericResponse.responseType = '';
    genericResponse.header = '';
    genericResponse.body = '';

    genericResponse.type = (responseType) => {
      genericResponse.responseType = responseType;
    };
    genericResponse.setHeader = (type, value) => {
      if (genericResponse.header.length < 1) {
        genericResponse.header = [];
      }
      genericResponse.header.push({
        type,
        value,
      });
    };
    genericResponse.end = (body) => {
      genericResponse.body = body;
    };

    return genericResponse;
  },
  pdfResponse() {
    const genericResponse = this.genericResponse();
    genericResponse.responseType = '';
    genericResponse.header = '';
    genericResponse.body = '';
    genericResponse.writeHeadStatus = '';
    genericResponse.writeHeadHeaders = '';

    genericResponse.type = (responseType) => {
      genericResponse.responseType = responseType;
    };
    genericResponse.setHeader = (type, value) => {
      if (genericResponse.header.length < 1) {
        genericResponse.header = [];
      }
      genericResponse.header.push({
        type,
        value,
      });
    };
    genericResponse.end = (body) => {
      genericResponse.body = body;
    };
    genericResponse.writeHead = (status, headers) => {
      genericResponse.writeHeadStatus = status;
      genericResponse.writeHeadHeaders = headers;
    };

    return genericResponse;
  },
};
