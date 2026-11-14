/**
 * Integration Test Suite - Cloud Native Microservice
 * Validates HTTP protocol semantics, security headers, CORS and response structures.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { requestHandler } = require('../src/server');

function createMockReqRes(url, method = 'GET') {
  const req = { url, method, headers: {} };
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
    name: 'Security Headers are Injected into Responses',
    fn() {
      const { req, res } = createMockReqRes('/api/health');
      requestHandler(req, res);
      const headers = res.getHeaders();
      assert.strictEqual(headers['X-Content-Type-Options'], 'nosniff');
      assert.strictEqual(headers['X-Frame-Options'], 'DENY');
      assert.strictEqual(headers['X-XSS-Protection'], '1; mode=block');
    }
  },
  {
    name: 'CORS Pre-flight (OPTIONS) Returns 204 No Content',
    fn() {
      const { req, res } = createMockReqRes('/api/info', 'OPTIONS');
      requestHandler(req, res);
      assert.strictEqual(res.getStatusCode(), 204);
      const headers = res.getHeaders();
      assert.strictEqual(headers['Access-Control-Allow-Origin'], '*');
    }
  },
  {
    name: 'Static Web Dashboard Files Exist on Disk',
    fn() {
      const publicDir = path.join(__dirname, '..', 'src', 'public');
      assert.ok(fs.existsSync(path.join(publicDir, 'index.html')), 'index.html must exist');
      assert.ok(fs.existsSync(path.join(publicDir, 'style.css')), 'style.css must exist');
      assert.ok(fs.existsSync(path.join(publicDir, 'app.js')), 'app.js must exist');
    }
  },
  {
    name: 'API Endpoints Return Valid Content-Type JSON Header',
    fn() {
      const { req, res } = createMockReqRes('/api/version');
      requestHandler(req, res);
      const headers = res.getHeaders();
      assert.strictEqual(headers['Content-Type'], 'application/json');
    }
  }
];
