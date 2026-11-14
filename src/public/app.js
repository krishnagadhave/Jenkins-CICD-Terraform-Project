/**
 * Dashboard Frontend Controller
 * Live Telemetry Poller & API Inspector
 */

async function fetchTelemetry() {
  try {
    const res = await fetch('/api/info');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    // Update Host & Runtime Telemetry
    document.getElementById('sys-platform').innerText = `${data.infrastructure.platform} (${data.infrastructure.arch})`;
    document.getElementById('sys-node').innerText = data.runtime.nodeVersion;
    document.getElementById('sys-ip').innerText = data.infrastructure.ip;
    document.getElementById('sys-memory').innerText = `${data.runtime.memoryUsageMB.rss} MB (Heap: ${data.runtime.memoryUsageMB.heapUsed} MB)`;
    document.getElementById('git-hash').innerText = data.ci_cd.gitCommit.substring(0, 7);
    document.getElementById('app-version').innerText = `v${data.application.version}`;
    document.getElementById('infra-cloud').innerText = data.infrastructure.cloudProvider;

    // Update Timestamp
    document.getElementById('last-updated').innerText = `Updated: ${new Date().toLocaleTimeString()}`;
  } catch (err) {
    console.error('Failed to fetch info:', err);
  }

  // Fetch Health & Readiness Probes
  try {
    const healthRes = await fetch('/api/health');
    const healthEl = document.getElementById('probe-health');
    if (healthRes.ok) {
      healthEl.innerText = 'UP (200 OK)';
      healthEl.className = 'stat-value text-success';
    } else {
      healthEl.innerText = `DOWN (${healthRes.status})`;
      healthEl.className = 'stat-value text-danger';
    }
  } catch (err) {
    document.getElementById('probe-health').innerText = 'OFFLINE';
    document.getElementById('probe-health').className = 'stat-value text-danger';
  }

  try {
    const readyRes = await fetch('/api/ready');
    const readyEl = document.getElementById('probe-ready');
    if (readyRes.ok) {
      readyEl.innerText = 'READY (200 OK)';
      readyEl.className = 'stat-value text-success';
    } else {
      readyEl.innerText = `UNREADY (${readyRes.status})`;
      readyEl.className = 'stat-value text-danger';
    }
  } catch (err) {
    document.getElementById('probe-ready').innerText = 'ERROR';
    document.getElementById('probe-ready').className = 'stat-value text-danger';
  }

  // Fetch Metrics
  try {
    const metricsRes = await fetch('/api/metrics');
    if (metricsRes.ok) {
      const metrics = await metricsRes.json();
      document.getElementById('app-uptime').innerText = `${metrics.uptimeSeconds}s`;
      document.getElementById('app-requests').innerText = metrics.totalRequests;
    }
  } catch (err) {
    console.error('Failed to fetch metrics:', err);
  }
}

// Interactive API Endpoint Inspector
async function testEndpoint(endpoint) {
  document.getElementById('current-endpoint').innerText = endpoint;
  const statusEl = document.getElementById('response-code');
  const codeEl = document.getElementById('json-viewer');

  codeEl.innerText = '// Requesting data from ' + endpoint + '...';

  try {
    const res = await fetch(endpoint);
    const data = await res.json();
    statusEl.innerText = `Status: ${res.status} ${res.statusText || (res.ok ? 'OK' : 'FAIL')}`;
    statusEl.className = res.ok ? 'viewer-status text-success' : 'viewer-status text-danger';
    codeEl.innerText = JSON.stringify(data, null, 2);
  } catch (err) {
    statusEl.innerText = 'Network / Execution Error';
    statusEl.className = 'viewer-status text-danger';
    codeEl.innerText = JSON.stringify({ error: err.message }, null, 2);
  }

  // Refresh general stats after trigger
  fetchTelemetry();
}

// Chaos Testing Actions
async function triggerChaos() {
  await testEndpoint('/api/simulate-unhealthy');
  fetchTelemetry();
}

async function resetChaos() {
  await testEndpoint('/api/reset');
  fetchTelemetry();
}

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
  fetchTelemetry();
  // Poll every 3 seconds for dynamic real-time telemetry
  setInterval(fetchTelemetry, 3000);
  // Default preview
  testEndpoint('/api/info');
});
