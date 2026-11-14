/**
 * Unit Test Suite - Cloud Native Microservice
 * Validates core business logic, probe endpoints, metadata and error handling.
 */

const assert = require('assert');
const { requestHandler, APP_NAME, APP_VERSION } = require('../src/server');

// Mock HTTP Request / Response objects
function createMockReqRes(url, method = 'GET') {
  const req = {
    url,
    method,
    headers: {}
  };

  let statusCode = 200;
  let headers = {};
  let body = '';

  const res = {
    writeHead(code, h = {}) {
      statusCode = code;
      Object.assign(headers, h);
      return res;
    },
    setHeader(key, value) {
      headers[key] = value;
      return res;
    },
    end(data = '') {
      body = data;
    },
    getStatusCode() { return statusCode; },
    getHeaders() { return headers; },
    getBody() { return body; },
    getJSON() { return JSON.parse(body || '{}'); }
  };

  return { req, res };
}

module.exports = [
  {
    name: 'Application Constants Validation',
    fn() {
      assert.strictEqual(typeof APP_NAME, 'string', 'APP_NAME must be a string');
      assert.strictEqual(typeof APP_VERSION, 'string', 'APP_VERSION must be a string');
      assert.ok(APP_VERSION.length > 0, 'APP_VERSION must not be empty');
    }
  },
  {
    name: 'Liveness Probe (/api/health) Returns 200 OK & Status UP',
    fn() {
      const { req, res } = createMockReqRes('/api/health');
      requestHandler(req, res);
      assert.strictEqual(res.getStatusCode(), 200, 'Expected HTTP 200');
      const data = res.getJSON();
      assert.strictEqual(data.status, 'UP', 'Status must be UP');
      assert.strictEqual(data.healthy, true, 'Healthy boolean must be true');
      assert.ok(data.timestamp, 'Timestamp should be present');
    }
  },
  {
    name: 'Readiness Probe (/api/ready) Returns Dependencies State',
    fn() {
      const { req, res } = createMockReqRes('/api/ready');
      requestHandler(req, res);
      assert.strictEqual(res.getStatusCode(), 200, 'Expected HTTP 200');
      const data = res.getJSON();
      assert.strictEqual(data.ready, true, 'Ready should be true');
      assert.strictEqual(data.dependencies.database, 'connected', 'Database should be connected');
    }
  },
  {
    name: 'Telemetry Endpoint (/api/info) Provides Complete Project & Student Metadata',
    fn() {
      const { req, res } = createMockReqRes('/api/info');
      requestHandler(req, res);
      assert.strictEqual(res.getStatusCode(), 200);
      const data = res.getJSON();
      assert.strictEqual(data.application.author, 'Krishna Gadhave');
      assert.strictEqual(data.application.prn, '202301040250');
      assert.strictEqual(data.ci_cd.engine, 'Jenkins CI/CD Pipeline');
      assert.strictEqual(data.infrastructure.provisioner, 'Terraform (Infrastructure as Code)');
    }
  },
  {
    name: 'Metrics Endpoint (/api/metrics) Returns Memory & Request Telemetry',
    fn() {
      const { req, res } = createMockReqRes('/api/metrics');
      requestHandler(req, res);
      assert.strictEqual(res.getStatusCode(), 200);
      const data = res.getJSON();
      assert.ok(typeof data.totalRequests === 'number', 'totalRequests should be a number');
      assert.ok(data.memory.rssBytes > 0, 'rssBytes should be positive');
      assert.ok(data.system.cpuCount > 0, 'cpuCount should be positive');
    }
  },
  {
    name: 'Version Endpoint (/api/version) Reflects CI/CD Pipeline Build Info',
    fn() {
      const { req, res } = createMockReqRes('/api/version');
      requestHandler(req, res);
      assert.strictEqual(res.getStatusCode(), 200);
      const data = res.getJSON();
      assert.strictEqual(data.version, APP_VERSION);
      assert.strictEqual(data.pipeline, 'Jenkins Declarative Pipeline');
    }
  },
  {
    name: 'Chaos Simulation Endpoints (/api/simulate-unhealthy and /api/reset)',
    fn() {
      // Simulate failure
      const chaos = createMockReqRes('/api/simulate-unhealthy');
      requestHandler(chaos.req, chaos.res);
      assert.strictEqual(chaos.res.getStatusCode(), 200);

      // Verify probe now returns 503
      const checkDown = createMockReqRes('/api/health');
      requestHandler(checkDown.req, checkDown.res);
      assert.strictEqual(checkDown.res.getStatusCode(), 503);
      assert.strictEqual(checkDown.res.getJSON().status, 'DOWN');

      // Reset
      const reset = createMockReqRes('/api/reset');
      requestHandler(reset.req, reset.res);
      assert.strictEqual(reset.res.getStatusCode(), 200);

      // Verify probe is restored to 200
      const checkUp = createMockReqRes('/api/health');
      requestHandler(checkUp.req, checkUp.res);
      assert.strictEqual(checkUp.res.getStatusCode(), 200);
    }
  },
  {
    name: 'Unknown Route Returns 404 with Available Routes Directory',
    fn() {
      const { req, res } = createMockReqRes('/api/non-existent-endpoint');
      requestHandler(req, res);
      assert.strictEqual(res.getStatusCode(), 404);
      const data = res.getJSON();
      assert.strictEqual(data.error, 'Endpoint Not Found');
      assert.ok(Array.isArray(data.availableEndpoints));
    }
  }
];
