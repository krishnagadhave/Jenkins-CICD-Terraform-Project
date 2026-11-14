/**
 * Cloud Native Microservice - Jenkins CI/CD & Terraform Demo
 * Author: Krishna Gadhave (PRN: 202301040250)
 * Course: Cloud Native Computing & DevOps
 * 
 * Features:
 * - Production-ready HTTP Server with Zero Third-Party Dependencies
 * - Health Check & Readiness Probes (/api/health, /api/ready)
 * - Telemetry, Metrics & System Diagnostics (/api/info, /api/metrics)
 * - Version & Build Metadata Endpoint (/api/version)
 * - Chaos Testing & Recovery Endpoints (/api/simulate-unhealthy, /api/reset)
 * - Interactive Web Dashboard (/public/index.html)
 * - Exportable Request Handler for Automated Testing
 */

const http = require('http');
const os = require('os');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Environment & Configuration (12-Factor App)
const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';
const APP_NAME = process.env.APP_NAME || 'Cloud-Native CI/CD Microservice';
const APP_VERSION = process.env.APP_VERSION || '1.2.0';
const BUILD_NUMBER = process.env.BUILD_NUMBER || 'local-dev';
const GIT_COMMIT = process.env.GIT_COMMIT || 'HEAD';
const ENVIRONMENT = process.env.NODE_ENV || 'production';

// Runtime State
const startTime = Date.now();
let requestCounter = 0;
let isHealthy = true;
let isReady = true;

// Helper: Get Primary Local IP
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

// Helper: Send JSON Response
function sendJSON(res, statusCode, payload) {
  const body = JSON.stringify(payload, null, 2);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
    'X-App-Version': APP_VERSION,
    'X-Build-Number': BUILD_NUMBER
  });
  res.end(body);
}

// Helper: Serve Static Files
function serveStatic(res, filePath, contentType) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      sendJSON(res, 404, { error: 'Not Found', path: filePath });
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': data.length,
        'Cache-Control': 'public, max-age=3600'
      });
      res.end(data);
    }
  });
}

// Request Router & Handler
function requestHandler(req, res) {
  requestCounter++;
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Global CORS & Security Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Route: /api/health (Liveness Probe)
  if (pathname === '/api/health' || pathname === '/health') {
    if (!isHealthy) {
      return sendJSON(res, 503, {
        status: 'DOWN',
        healthy: false,
        error: 'Simulated service failure'
      });
    }
    return sendJSON(res, 200, {
      status: 'UP',
      healthy: true,
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor((Date.now() - startTime) / 1000)
    });
  }

  // Route: /api/ready (Readiness Probe)
  if (pathname === '/api/ready' || pathname === '/ready') {
    if (!isReady) {
      return sendJSON(res, 503, {
        ready: false,
        status: 'UNREADY',
        reason: 'Service warming up or simulated unreadiness'
      });
    }
    return sendJSON(res, 200, {
      ready: true,
      status: 'READY',
      dependencies: {
        database: 'connected',
        cache: 'connected'
      },
      timestamp: new Date().toISOString()
    });
  }

  // Route: /api/info (System & Application Metadata)
  if (pathname === '/api/info') {
    const memory = process.memoryUsage();
    return sendJSON(res, 200, {
      application: {
        name: APP_NAME,
        version: APP_VERSION,
        environment: ENVIRONMENT,
        author: 'Krishna Gadhave',
        prn: '202301040250',
        course: 'Cloud Native Computing & DevOps'
      },
      ci_cd: {
        engine: 'Jenkins CI/CD Pipeline',
        buildNumber: BUILD_NUMBER,
        gitCommit: GIT_COMMIT,
        status: 'Verified & Deployed'
      },
      infrastructure: {
        provisioner: 'Terraform (Infrastructure as Code)',
        cloudProvider: 'AWS (Amazon Web Services)',
        resourceType: 'EC2 / VPC / Security Group / Subnet',
        host: os.hostname(),
        platform: os.platform(),
        arch: os.arch(),
        ip: getLocalIP()
      },
      runtime: {
        nodeVersion: process.version,
        uptimeSeconds: Math.floor((Date.now() - startTime) / 1000),
        memoryUsageMB: {
          rss: Math.round(memory.rss / (1024 * 1024)),
          heapUsed: Math.round(memory.heapUsed / (1024 * 1024)),
          heapTotal: Math.round(memory.heapTotal / (1024 * 1024))
        }
      }
    });
  }

  // Route: /api/metrics (Observability & Monitoring)
  if (pathname === '/api/metrics') {
    const mem = process.memoryUsage();
    return sendJSON(res, 200, {
      totalRequests: requestCounter,
      uptimeSeconds: Math.floor((Date.now() - startTime) / 1000),
      memory: {
        rssBytes: mem.rss,
        heapUsedBytes: mem.heapUsed,
        heapTotalBytes: mem.heapTotal
      },
      system: {
        cpuCount: os.cpus().length,
        freeMemoryMB: Math.round(os.freemem() / (1024 * 1024)),
        totalMemoryMB: Math.round(os.totalmem() / (1024 * 1024)),
        loadAverage: os.loadavg()
      }
    });
  }

  // Route: /api/version (Build & Commit Info for Deployment Verification)
  if (pathname === '/api/version') {
    return sendJSON(res, 200, {
      version: APP_VERSION,
      buildNumber: BUILD_NUMBER,
      gitCommit: GIT_COMMIT,
      pipeline: 'Jenkins Declarative Pipeline',
      deployedAt: new Date(startTime).toISOString()
    });
  }

  // Chaos Engineering Routes
  if (pathname === '/api/simulate-unhealthy') {
    isHealthy = false;
    return sendJSON(res, 200, { message: 'Health probe status flipped to UNHEALTHY (503)' });
  }

  if (pathname === '/api/simulate-unready') {
    isReady = false;
    return sendJSON(res, 200, { message: 'Readiness probe status flipped to UNREADY (503)' });
  }

  if (pathname === '/api/reset') {
    isHealthy = true;
    isReady = true;
    return sendJSON(res, 200, { message: 'All probes restored to healthy state (200 OK)' });
  }

  // Static Assets Serving
  const publicDir = path.join(__dirname, 'public');

  if (pathname === '/' || pathname === '/index.html') {
    return serveStatic(res, path.join(publicDir, 'index.html'), 'text/html; charset=utf-8');
  }

  if (pathname === '/style.css') {
    return serveStatic(res, path.join(publicDir, 'style.css'), 'text/css; charset=utf-8');
  }

  if (pathname === '/app.js') {
    return serveStatic(res, path.join(publicDir, 'app.js'), 'application/javascript; charset=utf-8');
  }

  // Fallback 404
  return sendJSON(res, 404, {
    error: 'Endpoint Not Found',
    path: pathname,
    availableEndpoints: [
      '/',
      '/api/health',
      '/api/ready',
      '/api/info',
      '/api/metrics',
      '/api/version',
      '/api/simulate-unhealthy',
      '/api/reset'
    ]
  });
}

// Server Instance
const server = http.createServer(requestHandler);

// Graceful Shutdown Management
function shutdown(signal) {
  console.log(`\n[${new Date().toISOString()}] Received ${signal}. Starting graceful shutdown...`);
  server.close(() => {
    console.log('[SHUTDOWN] HTTP server closed gracefully. Exiting process.');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('[SHUTDOWN ERROR] Forced termination due to timeout.');
    process.exit(1);
  }, 10000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Start Server if invoked directly from CLI
if (require.main === module) {
  server.listen(PORT, HOST, () => {
    console.log('================================================================');
    console.log(`🚀 ${APP_NAME}`);
    console.log(`📦 Version: ${APP_VERSION} (Build: ${BUILD_NUMBER})`);
    console.log(`👤 Author: Krishna Gadhave (PRN: 202301040250)`);
    console.log(`🌐 Server listening at: http://${HOST}:${PORT}`);
    console.log(`🩺 Healthcheck: http://${HOST}:${PORT}/api/health`);
    console.log(`📊 Metrics:     http://${HOST}:${PORT}/api/metrics`);
    console.log('================================================================');
  });
}

// Export for Unit & Integration Testing
module.exports = {
  server,
  requestHandler,
  PORT,
  APP_NAME,
  APP_VERSION
};
