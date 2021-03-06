const { assert } = require('chai');
const requestHelper = require('../../../lib/requestHelper');
const kongData = require('../../lib/kongData');

const assertDefault = (call, callback) => {
  assert.equal(call.json, true);
  assert.isString(call.headers['X-B3-TraceId']);
  assert.isString(call.headers['X-B3-SpanId']);
  assert.equal(call.headers['User-Agent'], 'Frontend');
  assert.equal(call.headers['Content-Type'], 'application/json');
  callback();
};

describe('Request helper ', () => {
  describe('requestClaimPDF', () => {
    it('should return valid object when url and key is supplied', () => {
      const pdfCall = requestHelper.requestClaimPDF('key1234', 'http://url.com/', kongData().user);
      assert.equal(pdfCall.url, 'http://url.com/api/claim/key1234');
      assert.equal(pdfCall.json, undefined);
      assert.equal(pdfCall.method, 'GET');
      assert.equal(pdfCall.headers['User-Agent'], 'Frontend');
      assert.isString(pdfCall.headers['X-B3-TraceId']);
      assert.isString(pdfCall.headers['X-B3-SpanId']);
      assert.equal(pdfCall.headers['Content-Type'], 'application/pdf');
      assert.equal(pdfCall.headers.agentRef, '123456789');
    });
  });

  describe('generatePostCall', () => {
    it('should return valid object when url and body is supplied', () => {
      const postCall = requestHelper.generatePostCall('http://url.com/', { value1: 1 });
      assert.equal(postCall.url, 'http://url.com/');
      assert.equal(postCall.method, 'POST');
      assert.equal(postCall.body.value1, 1);
      assertDefault(postCall, () => {});
    });

    it('should return valid object when url and body is supplied with agentRefObject - GB', () => {
      const postCall = requestHelper.generatePostCall('http://url.com/', { value1: 1 }, null, kongData().user);
      assert.equal(postCall.url, 'http://url.com/');
      assert.equal(postCall.method, 'POST');
      assert.equal(postCall.body.value1, 1);
      assertDefault(postCall, () => {
        assert.equal(postCall.headers.agentRef, '123456789');
        assert.equal(postCall.headers.location, '104815');
      });
    });

    it('should return valid object when url and body is supplied with agentRefObject - NI', () => {
      const postCall = requestHelper.generatePostCall('http://url.com/', { value1: 1 }, null, kongData(true).user);
      assert.equal(postCall.url, 'http://url.com/');
      assert.equal(postCall.method, 'POST');
      assert.equal(postCall.body.value1, 1);
      assertDefault(postCall, () => {
        assert.equal(postCall.headers.agentRef, '123456789');
        assert.equal(postCall.headers.location, '107886');
      });
    });
  });

  describe('generateGetCall', () => {
    it('should return valid object when url and body is supplied', () => {
      const getCall = requestHelper.generateGetCall('http://url.com/', { value1: 1 });
      assert.equal(getCall.url, 'http://url.com/');
      assert.equal(getCall.json, true);
      assert.equal(getCall.method, 'GET');
      assert.equal(getCall.body.value1, 1);
      assertDefault(getCall, () => {});
    });

    it('should return valid object when url and body is supplied with agentRefObject - GB', () => {
      const getCall = requestHelper.generateGetCall('http://url.com/', { value1: 1 }, null, kongData().user);
      assert.equal(getCall.url, 'http://url.com/');
      assert.equal(getCall.json, true);
      assert.equal(getCall.method, 'GET');
      assert.equal(getCall.body.value1, 1);
      assertDefault(getCall, () => {
        assert.equal(getCall.headers.agentRef, '123456789');
        assert.equal(getCall.headers.location, '104815');
      });
    });

    it('should return valid object when url and body is supplied with agentRefObject - NI', () => {
      const getCall = requestHelper.generateGetCall('http://url.com/', { value1: 1 }, null, kongData(true).user);
      assert.equal(getCall.url, 'http://url.com/');
      assert.equal(getCall.method, 'GET');
      assert.equal(getCall.body.value1, 1);
      assert.isString(getCall.headers['X-B3-TraceId']);
      assert.isString(getCall.headers['X-B3-SpanId']);
      assert.equal(getCall.headers['User-Agent'], 'Frontend');
      assert.equal(getCall.headers['Content-Type'], 'application/json');
      assertDefault(getCall, () => {
        assert.equal(getCall.headers.agentRef, '123456789');
        assert.equal(getCall.headers.location, '107886');
      });
    });
  });

  describe('generatePutCall', () => {
    it('should return valid object when url and body is supplied', () => {
      const postCall = requestHelper.generatePutCall('http://url.com/', { value1: 1 });
      assert.equal(postCall.url, 'http://url.com/');
      assert.equal(postCall.method, 'PUT');
      assert.equal(postCall.body.value1, 1);
      assertDefault(postCall, () => {});
    });

    it('should return valid object when url and body is supplied with agentRefObject - GB', () => {
      const postCall = requestHelper.generatePutCall('http://url.com/', { value1: 1 }, null, kongData().user);
      assert.equal(postCall.url, 'http://url.com/');
      assert.equal(postCall.method, 'PUT');
      assert.equal(postCall.body.value1, 1);
      assertDefault(postCall, () => {
        assert.equal(postCall.headers.agentRef, '123456789');
        assert.equal(postCall.headers.location, '104815');
      });
    });

    it('should return valid object when url and body is supplied with agentRefObject - NI', () => {
      const postCall = requestHelper.generatePutCall('http://url.com/', { value1: 1 }, null, kongData(true).user);
      assert.equal(postCall.url, 'http://url.com/');
      assert.equal(postCall.method, 'PUT');
      assert.equal(postCall.body.value1, 1);
      assertDefault(postCall, () => {
        assert.equal(postCall.headers.agentRef, '123456789');
        assert.equal(postCall.headers.location, '107886');
      });
    });
  });
});
