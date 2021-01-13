const { assert } = require('chai');

const controller = require('../../../app/routes/actuator/functions');

const responseHelper = require('../../lib/responseHelper');

let genericResponse;

const mockMetricsClient = {
  register: {
    contentType: 'test-header',
    metrics() {
      return 'test-response';
    },
  },
};

describe('Actuator controller ', () => {
  beforeEach(() => {
    genericResponse = { ...responseHelper.genericResponse() };
  });

  describe('getHealth function ', () => {
    it('should set status to 200', () => {
      controller.getHealth({}, genericResponse);
      assert.equal(genericResponse.currentStatus, 200);
    });

    it('should return JSON', () => {
      controller.getHealth({}, genericResponse);
      assert.deepEqual(genericResponse.jsonResponse, { status: 'UP' });
    });
  });

  describe('getInfo function ', () => {
    it('should set status to 200', () => {
      controller.getInfo({}, genericResponse);
      assert.equal(genericResponse.currentStatus, 200);
    });

    it('should return JSON', () => {
      controller.getInfo({}, genericResponse);
      assert.hasAllKeys(genericResponse.jsonResponse, ['app', 'node']);
      assert.hasAllKeys(genericResponse.jsonResponse.app, ['description', 'name', 'version']);
      assert.hasAllKeys(genericResponse.jsonResponse.node, ['version']);
    });
  });

  describe('getMetrics function ', () => {
    it('should set status to 200', () => {
      controller.getMetrics({}, genericResponse);
      assert.equal(genericResponse.currentStatus, 200);
    });

    it('should return JSON', () => {
      controller.getMetrics({}, genericResponse);
      assert.hasAllKeys(genericResponse.jsonResponse, ['uptime']);
    });
  });

  describe('getPrometheus function ', () => {
    it('should set Content-Type header to metricsClient contentType', async () => {
      await controller.getPrometheus(mockMetricsClient)({}, genericResponse);
      assert.equal(genericResponse.headers['Content-Type'], 'test-header');
    });

    it('should send metrics', async () => {
      await controller.getPrometheus(mockMetricsClient)({}, genericResponse);
      assert.equal(genericResponse.body, 'test-response');
    });
  });
});
