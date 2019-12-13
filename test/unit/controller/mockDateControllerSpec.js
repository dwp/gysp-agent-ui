const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const moment = require('moment');

chai.use(chaiAsPromised);

const controller = require('../../../app/routes/mock-date/functions');

let genericResponse;

const { assert } = chai;

const responseHelper = require('../../../test/lib/responseHelper');

const emptyDateTime = { params: { datetime: '' } };
const invalidDateTime = { params: { datetime: 'invalid' } };
const validDateTime = { params: { datetime: '2020-10-01T10:00:00' } };

const validRequest = {};
const currentDateTime = moment();

describe('mock date controller ', () => {
  beforeEach(() => {
    genericResponse = responseHelper.genericResponse();
    genericResponse.locals = {
      traceID: '',
      logMessage: '',
      agentGateway: 'http://test-url/',
      logger: {
        error(traceID, errorTxt) {
          genericResponse.locals.traceID = traceID;
          genericResponse.locals.logMessage = errorTxt;
        },
      },
    };
  });

  describe('getMockSetDate function', () => {
    it('should return error as datetime is empty', () => {
      controller.getMockSetDate(emptyDateTime, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/error');
      assert.equal(genericResponse.data.status, '- Datetime format invalid, please use YYYY-MM-DDTHH:MM:SS (2020-02-06T10:10:00)');
      assert.equal(genericResponse.locals.logMessage, 'MockSetDate - Datetime format invalid');
    });
    it('should return error as datetime is invalid', () => {
      controller.getMockSetDate(invalidDateTime, genericResponse);
      assert.equal(genericResponse.viewName, 'pages/error');
      assert.equal(genericResponse.data.status, '- Datetime format invalid, please use YYYY-MM-DDTHH:MM:SS (2020-02-06T10:10:00)');
      assert.equal(genericResponse.locals.logMessage, 'MockSetDate - Datetime format invalid');
    });
    it('should return redirect and set the date when valid datetime is supplied', () => {
      controller.getMockSetDate(validDateTime, genericResponse);
      assert.equal(new Date().toString(), 'Thu Oct 01 2020 10:00:00 GMT+0100 (British Summer Time)');
      assert.equal(genericResponse.address, '/');
    });
  });
  describe('getMockResetDate function', () => {
    it('should return redirect and set the date when valid datetime is supplied', () => {
      controller.getMockResetDate(validRequest, genericResponse);
      assert.equal(moment().format('YYYY-MM-DD'), currentDateTime.format('YYYY-MM-DD'));
      assert.equal(genericResponse.address, '/');
    });
  });
});
