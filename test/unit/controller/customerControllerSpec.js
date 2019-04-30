const assert = require('assert');

const customerController = require('../../../app/routes/customer/functions');
const responseHelper = require('../../lib/responseHelper');
const customerData = require('../../lib/customerData');

const titles = customerData.validTitles();
const validCustomerData = customerData.validPost();
const emptyCustomerData = customerData.emptyPost();
const emptyCustomerDataLowerCaseNino = customerData.emptyPost();
emptyCustomerDataLowerCaseNino.nino = 'aa370773a';

let genericResponse = {};
const emptyRequest = { session: {}, body: {} };
const populatedRequest = { session: {}, body: validCustomerData };
const emptyPostRequest = { session: {}, body: emptyCustomerData };
const emptyPostRequestNino = { session: {}, body: emptyCustomerDataLowerCaseNino };

describe('Customer controller ', () => {
  beforeEach(() => {
    genericResponse = responseHelper.genericResponse();
    genericResponse.locals = {
      traceID: '',
      logMessage: '',
      logger: {
        error(traceID, errorTxt) {
          genericResponse.locals.traceID = traceID;
          genericResponse.locals.logMessage = errorTxt;
        },
      },
    };
  });

  describe(' customerAdd function (GET /customer/add', () => {
    it('should return view name when called', (done) => {
      customerController.customerAdd(emptyRequest, genericResponse, titles);
      assert.equal(genericResponse.viewName, 'pages/customer/add');
      done();
    });
  });

  describe(' customerPost function (post /customer/add', () => {
    it('should return view name when called with empty post with errors', (done) => {
      customerController.customerAddPost(emptyPostRequest, genericResponse, titles);
      assert.equal(genericResponse.viewName, 'pages/customer/add');
      assert.equal(Object.keys(genericResponse.data.errors).length, 13);
      done();
    });
  });

  describe(' customerPost function (post /customer/add) uppercase nino', () => {
    it('should return error view with uppercase nino', (done) => {
      customerController.customerAddPost(emptyPostRequestNino, genericResponse, titles);
      assert.equal(genericResponse.viewName, 'pages/customer/add');
      assert.equal(emptyPostRequestNino.body.nino, 'AA370773A');
      assert.equal(Object.keys(genericResponse.data.errors).length, 12);
      done();
    });
  });

  describe(' customerPostErrorHandler function', () => {
    it('should return default view name when called with Error - duplicate Nino Found when status is 409', (done) => {
      customerController.customerPostErrorHandler({ statusCode: 409 }, populatedRequest, genericResponse, titles);
      assert.equal(genericResponse.viewName, 'pages/customer/add');
      assert.equal(genericResponse.locals.logMessage, '409 - undefined - Requested on /api/customer');
      assert.equal(genericResponse.data.globalError, 'Error - duplicate National Insurance number found.');
      done();
    });

    it('should return default view name when called with Error - connection refused. when service is not found', (done) => {
      customerController.customerPostErrorHandler({ name: 'RequestError' }, populatedRequest, genericResponse, titles);
      assert.equal(genericResponse.locals.logMessage, 'Other - undefined - Requested on /api/customer');
      assert.equal(genericResponse.viewName, 'pages/customer/add');
      assert.equal(genericResponse.data.globalError, 'Error - connection refused.');
      done();
    });

    it('should return default view name when called with Error - could not save data. when status is not 500', (done) => {
      customerController.customerPostErrorHandler({ statusCode: 500 }, populatedRequest, genericResponse, titles);
      assert.equal(genericResponse.locals.logMessage, '500 - undefined - Requested on /api/customer');
      assert.equal(genericResponse.viewName, 'pages/customer/add');
      assert.equal(genericResponse.data.globalError, 'Error - could not save data.');
      done();
    });
  });
});
