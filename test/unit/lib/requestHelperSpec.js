const { assert } = require('chai');
const requestHelper = require('../../../lib/requestHelper');

const agentRefObject = { username: 'test@test.com' };

describe('Request helper ', () => {
  describe('requestClaimPDF  ', () => {
    it('should return valid object when url and key is supplied', () => {
      const pdfCall = requestHelper.requestClaimPDF('key1234', 'http://url.com/', agentRefObject);
      assert.equal(pdfCall.url, 'http://url.com/api/claim/key1234');
      assert.equal(pdfCall.json, undefined);
      assert.equal(pdfCall.method, 'GET');
      assert.equal(pdfCall.headers['User-Agent'], 'Frontend');
      assert.isString(pdfCall.headers['X-B3-TraceId']);
      assert.isString(pdfCall.headers['X-B3-SpanId']);
      assert.equal(pdfCall.headers['Content-Type'], 'application/pdf');
      assert.equal(pdfCall.headers.agentRef, 'test@test.com');
    });
  });
  describe('generatePostCall  ', () => {
    it('should return valid object when url and body is supplied', () => {
      const postCall = requestHelper.generatePostCall('http://url.com/', { value1: 1 });
      assert.equal(postCall.url, 'http://url.com/');
      assert.equal(postCall.json, true);
      assert.equal(postCall.method, 'POST');
      assert.equal(postCall.body.value1, 1);
      assert.isString(postCall.headers['X-B3-TraceId']);
      assert.isString(postCall.headers['X-B3-SpanId']);
      assert.equal(postCall.headers['User-Agent'], 'Frontend');
      assert.equal(postCall.headers['Content-Type'], 'application/json');
    });
  });
  describe('Request helper ', () => {
    describe('generateGetCall  ', () => {
      it('should return valid object when url and body is supplied', () => {
        const getCall = requestHelper.generateGetCall('http://url.com/', { value1: 1 });
        assert.equal(getCall.url, 'http://url.com/');
        assert.equal(getCall.json, true);
        assert.equal(getCall.method, 'GET');
        assert.equal(getCall.body.value1, 1);
        assert.isString(getCall.headers['X-B3-TraceId']);
        assert.isString(getCall.headers['X-B3-SpanId']);
        assert.equal(getCall.headers['User-Agent'], 'Frontend');
        assert.equal(getCall.headers['Content-Type'], 'application/json');
      });
    });
  });
});
