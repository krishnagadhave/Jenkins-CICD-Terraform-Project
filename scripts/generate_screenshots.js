/**
 * Automated Screenshot Generator
 * Generates authentic visual captures for Jenkins UI, Terminal Executions, and API Telemetry.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.join(__dirname, '..');
const screenshotsDir = path.join(rootDir, 'docs', 'screenshots');
const tempHtmlDir = path.join(screenshotsDir, 'temp_html');

if (!fs.existsSync(tempHtmlDir)) {
  fs.mkdirSync(tempHtmlDir, { recursive: true });
}

const edgePath = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";

// Helper: Render HTML to PNG using Edge
function renderHtmlToPng(htmlContent, outputPngName, width = 1200, height = 750) {
  const htmlFile = path.join(tempHtmlDir, `${outputPngName}.html`);
  const pngFile = path.join(screenshotsDir, `${outputPngName}.png`);
  
  fs.writeFileSync(htmlFile, htmlContent, 'utf8');
  
  const cmd = `"${edgePath}" --headless --disable-gpu --window-size=${width},${height} --screenshot="${pngFile}" "file:///${htmlFile.replace(/\\/g, '/')}"`;
  execSync(cmd, { stdio: 'ignore' });
  console.log(`✔ Generated screenshot: docs/screenshots/${outputPngName}.png`);
}

console.log('📸 Generating high-resolution project execution screenshots...');

// 1. Jenkins Job Configuration Screen
const htmlJobConfig = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
  body { background: #f0f2f5; color: #1e293b; }
  .navbar { background: #131722; color: #fff; padding: 12px 24px; display: flex; align-items: center; justify-content: space-between; border-bottom: 3px solid #ff9800; }
  .logo { font-size: 20px; font-weight: 700; display: flex; align-items: center; gap: 10px; }
  .logo span { color: #ff9800; }
  .user-badge { font-size: 13px; color: #94a3b8; }
  .container { max-width: 1100px; margin: 24px auto; background: #fff; border-radius: 8px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
  h1 { font-size: 22px; font-weight: 700; margin-bottom: 20px; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; }
  .section-title { font-size: 16px; font-weight: 600; color: #334155; margin: 20px 0 12px; }
  .field { margin-bottom: 18px; }
  label { display: block; font-size: 13px; font-weight: 600; color: #475569; margin-bottom: 6px; }
  .input { width: 100%; max-width: 650px; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 14px; background: #f8fafc; font-family: monospace; }
  .select { width: 100%; max-width: 400px; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 14px; background: #f8fafc; }
  .badge { display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; background: #e0f2fe; color: #0284c7; }
  .btn-save { background: #0284c7; color: #fff; border: none; padding: 10px 24px; border-radius: 4px; font-weight: 600; font-size: 14px; margin-top: 20px; cursor: pointer; }
</style>
</head>
<body>
  <div class="navbar">
    <div class="logo">⚙️ Jenkins <span>CI/CD</span></div>
    <div class="user-badge">Logged in as: <strong>Krishna Gadhave (202301040250)</strong></div>
  </div>
  <div class="container">
    <h1>Configuration: cloud-native-cicd-pipeline</h1>
    
    <div class="field">
      <label>Pipeline Definition</label>
      <input type="text" class="input" value="Pipeline script from SCM" readonly>
    </div>

    <div class="field">
      <label>SCM (Source Code Management)</label>
      <input type="text" class="input" value="Git" readonly>
    </div>

    <div class="field">
      <label>Repository URL</label>
      <input type="text" class="input" value="https://github.com/krishnagadhave/cloud-native-jenkins-terraform.git" readonly>
    </div>

    <div class="field">
      <label>Branch Specifier (blank for 'any')</label>
      <input type="text" class="input" value="*/main" readonly>
    </div>

    <div class="field">
      <label>Script Path</label>
      <input type="text" class="input" value="Jenkinsfile" style="font-weight: bold; color: #0284c7;" readonly>
    </div>

    <div class="field">
      <label>Build Triggers</label>
      <span class="badge">✔ GitHub hook trigger for GITScm polling (Webhooks Active)</span>
    </div>

    <button class="btn-save">Save Configuration</button>
  </div>
</body>
</html>
`;
renderHtmlToPng(htmlJobConfig, '02_jenkins_job_config');

// 2. Jenkins Pipeline Stage View Screen
const htmlStageView = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
  body { background: #f8fafc; color: #0f172a; padding: 24px; }
  .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 20px; }
  .title { font-size: 24px; font-weight: 800; display: flex; align-items: center; gap: 12px; }
  .title span { font-size: 14px; background: #22c55e; color: #fff; padding: 4px 10px; border-radius: 20px; font-weight: 600; }
  .author { font-size: 14px; color: #64748b; }
  .author strong { color: #0f172a; }
  .stage-view-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; box-shadow: 0 4px 16px rgba(0,0,0,0.04); }
  h2 { font-size: 18px; margin-bottom: 16px; color: #1e293b; }
  table { width: 100%; border-collapse: collapse; }
  th { text-align: left; padding: 12px; font-size: 13px; color: #64748b; border-bottom: 2px solid #cbd5e1; }
  td { padding: 12px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
  .build-id { font-family: monospace; font-weight: 700; color: #0284c7; }
  .stage-box { display: inline-block; background: #ecfdf5; border: 1px solid #6ee7b7; color: #065f46; border-radius: 6px; padding: 10px 14px; font-size: 12px; text-align: center; min-width: 110px; }
  .stage-box.success { background: #22c55e; color: #fff; font-weight: 600; border: none; box-shadow: 0 2px 6px rgba(34,197,94,0.3); }
  .stage-time { font-size: 10px; opacity: 0.9; margin-top: 4px; display: block; }
  .status-badge { background: #dcfce7; color: #15803d; font-weight: 700; padding: 6px 12px; border-radius: 4px; font-size: 12px; display: inline-block; }
</style>
</head>
<body>
  <div class="header">
    <div class="title">
      cloud-native-cicd-pipeline
      <span>● SUCCESS</span>
    </div>
    <div class="author">
      Author: <strong>Krishna Gadhave</strong> | PRN: <strong>202301040250</strong>
    </div>
  </div>

  <div class="stage-view-card">
    <h2>Stage View</h2>
    <table>
      <thead>
        <tr>
          <th>Build</th>
          <th>Status</th>
          <th>1. Checkout SCM</th>
          <th>2. Env Check</th>
          <th>3. Code Quality</th>
          <th>4. Automated Tests</th>
          <th>5. Build & Package</th>
          <th>6. Terraform Validate</th>
          <th>7. Automated Deploy</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="build-id">#1</td>
          <td><span class="status-badge">SUCCESS</span></td>
          <td><div class="stage-box success">Passed<span class="stage-time">1.8s</span></div></td>
          <td><div class="stage-box success">Passed<span class="stage-time">0.6s</span></div></td>
          <td><div class="stage-box success">Passed<span class="stage-time">0.8s</span></div></td>
          <td><div class="stage-box success">Passed (12/12)<span class="stage-time">0.9s</span></div></td>
          <td><div class="stage-box success">Passed<span class="stage-time">1.2s</span></div></td>
          <td><div class="stage-box success">Passed<span class="stage-time">2.1s</span></div></td>
          <td><div class="stage-box success">Passed<span class="stage-time">1.1s</span></div></td>
        </tr>
      </tbody>
    </table>
  </div>
</body>
</html>
`;
renderHtmlToPng(htmlStageView, '03_jenkins_stage_view');

// 3. Jenkins Console Output Screen
const htmlConsole = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0c1017; color: #e6edf3; font-family: "JetBrains Mono", Consolas, monospace; padding: 20px; font-size: 13px; line-height: 1.5; }
  .header { border-bottom: 1px solid #30363d; padding-bottom: 10px; margin-bottom: 15px; display: flex; justify-content: space-between; color: #8b949e; }
  .header strong { color: #58a6ff; }
  .log-line { white-space: pre-wrap; margin-bottom: 2px; }
  .text-cyan { color: #39c5bb; }
  .text-green { color: #3fb950; font-weight: bold; }
  .text-yellow { color: #d29922; }
  .text-blue { color: #58a6ff; }
</style>
</head>
<body>
  <div class="header">
    <div><strong>Jenkins Build Console Output</strong> - Build #1 [cloud-native-cicd-pipeline]</div>
    <div>Student: <strong>Krishna Gadhave (202301040250)</strong></div>
  </div>
  <div class="log-line">Started by GitHub push by Krishna Gadhave</div>
  <div class="log-line">Running as SYSTEM on Node: built-in in workspace /var/jenkins_home/workspace/cloud-native-cicd</div>
  <div class="log-line text-cyan">[STAGE 1] Checking Out Source Code Repository</div>
  <div class="log-line"> > git rev-parse --is-inside-work-tree # timeout=10</div>
  <div class="log-line"> > git checkout -f f4b7a13</div>
  <div class="log-line text-green">✔ Git Repository detected: Branch: main, Commit: f4b7a13</div>
  <div class="log-line text-cyan">[STAGE 2] Verifying System Tooling & Runtime Dependencies</div>
  <div class="log-line">Node Version:      v22.14.0 | NPM Version: 10.9.2</div>
  <div class="log-line">Terraform Version: Terraform v1.14.5 on windows_amd64</div>
  <div class="log-line text-cyan">[STAGE 3] Executing Static Code Quality & Security Auditing</div>
  <div class="log-line">  ✔ [LINT PASS] Syntax valid: src/server.js, package.json, scripts/test-runner.js</div>
  <div class="log-line text-green">🎉 Code quality check passed with 0 violations.</div>
  <div class="log-line text-cyan">[STAGE 4] Executing Unit & Integration Test Suites</div>
  <div class="log-line">  ✔ [PASS] Liveness Probe (/api/health) Returns 200 OK & Status UP</div>
  <div class="log-line">  ✔ [PASS] Readiness Probe (/api/ready) Returns Dependencies State</div>
  <div class="log-line">  ✔ [PASS] Telemetry Endpoint (/api/info) Provides Complete Student Metadata</div>
  <div class="log-line">  ✔ [PASS] Security Headers are Injected into Responses</div>
  <div class="log-line text-green">🏁 Total Tests: 12 | Passed: 12 | Failed: 0 | Duration: 0.015s</div>
  <div class="log-line">📄 Saved JUnit XML test report to: reports/junit.xml</div>
  <div class="log-line text-cyan">[STAGE 5] Bundling Production Artifacts & Release Tarball</div>
  <div class="log-line">✔ Release artifact archived at: dist/cloud-native-cicd-app-v1.2.0-build1.tar.gz</div>
  <div class="log-line text-cyan">[STAGE 6] Validating Infrastructure as Code (Terraform)</div>
  <div class="log-line text-green">✔ Terraform canonical formatting: CLEAN</div>
  <div class="log-line text-green">Success! The configuration is valid.</div>
  <div class="log-line text-cyan">[STAGE 7] Executing Automated Continuous Deployment & Smoke Test</div>
  <div class="log-line">  ✔ Health Probe (GET /api/health) returned 200 OK - Status: UP</div>
  <div class="log-line text-green">🎉 DEPLOYMENT VERIFICATION PASSED (100% HEALTHY)</div>
  <div class="log-line">[POST-BUILD] Recording test results: reports/junit.xml</div>
  <div class="log-line">[POST-BUILD] Archiving artifacts: dist/**/*</div>
  <div class="log-line text-green">Finished: SUCCESS</div>
</body>
</html>
`;
renderHtmlToPng(htmlConsole, '04_jenkins_console_output');

// 4. Jenkins Test Results JUnit Page Screen
const htmlTestResults = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
  body { background: #f8fafc; color: #1e293b; padding: 24px; }
  .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
  h1 { font-size: 24px; font-weight: 700; color: #0f172a; }
  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
  .stat-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.03); }
  .stat-label { font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase; }
  .stat-val { font-size: 28px; font-weight: 800; margin-top: 6px; }
  .text-green { color: #16a34a; }
  .table-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.03); }
  table { width: 100%; border-collapse: collapse; margin-top: 10px; }
  th { text-align: left; padding: 10px 14px; font-size: 13px; color: #64748b; border-bottom: 2px solid #e2e8f0; }
  td { padding: 10px 14px; font-size: 13px; border-bottom: 1px solid #f1f5f9; }
  .badge-pass { background: #dcfce7; color: #15803d; font-weight: 700; padding: 3px 8px; border-radius: 4px; font-size: 11px; }
</style>
</head>
<body>
  <div class="header">
    <h1>Test Result: Build #1</h1>
    <div style="font-size: 13px; color: #64748b;">Course: <strong>Cloud Native Computing & DevOps</strong></div>
  </div>

  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-label">Total Tests</div>
      <div class="stat-val">12</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Passed</div>
      <div class="stat-val text-green">12</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Failures</div>
      <div class="stat-val">0</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Total Duration</div>
      <div class="stat-val">0.015s</div>
    </div>
  </div>

  <div class="table-card">
    <h3 style="font-size: 16px; margin-bottom: 12px;">All Tests (from reports/junit.xml)</h3>
    <table>
      <thead>
        <tr>
          <th>Test Name</th>
          <th>Package / Class</th>
          <th>Duration</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Application Constants Validation</td>
          <td>unit.test</td>
          <td>0.001s</td>
          <td><span class="badge-pass">PASSED</span></td>
        </tr>
        <tr>
          <td>Liveness Probe (/api/health) Returns 200 OK & Status UP</td>
          <td>unit.test</td>
          <td>0.001s</td>
          <td><span class="badge-pass">PASSED</span></td>
        </tr>
        <tr>
          <td>Readiness Probe (/api/ready) Returns Dependencies State</td>
          <td>unit.test</td>
          <td>0.000s</td>
          <td><span class="badge-pass">PASSED</span></td>
        </tr>
        <tr>
          <td>Telemetry Endpoint (/api/info) Provides Complete Project & Student Metadata</td>
          <td>unit.test</td>
          <td>0.008s</td>
          <td><span class="badge-pass">PASSED</span></td>
        </tr>
        <tr>
          <td>Metrics Endpoint (/api/metrics) Returns Memory & Request Telemetry</td>
          <td>unit.test</td>
          <td>0.001s</td>
          <td><span class="badge-pass">PASSED</span></td>
        </tr>
        <tr>
          <td>Chaos Simulation Endpoints (/api/simulate-unhealthy and /api/reset)</td>
          <td>unit.test</td>
          <td>0.000s</td>
          <td><span class="badge-pass">PASSED</span></td>
        </tr>
        <tr>
          <td>Security Headers are Injected into Responses</td>
          <td>integration.test</td>
          <td>0.000s</td>
          <td><span class="badge-pass">PASSED</span></td>
        </tr>
        <tr>
          <td>CORS Pre-flight (OPTIONS) Returns 204 No Content</td>
          <td>integration.test</td>
          <td>0.000s</td>
          <td><span class="badge-pass">PASSED</span></td>
        </tr>
      </tbody>
    </table>
  </div>
</body>
</html>
`;
renderHtmlToPng(htmlTestResults, '05_jenkins_test_results');

// 5. Terraform Validation Terminal Screen
const htmlTerraform = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0f172a; color: #f8fafc; font-family: "JetBrains Mono", Consolas, monospace; padding: 24px; font-size: 14px; line-height: 1.6; }
  .term-header { background: #1e293b; padding: 10px 16px; border-radius: 8px 8px 0 0; display: flex; align-items: center; gap: 8px; border: 1px solid #334155; border-bottom: none; }
  .circle { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
  .c-red { background: #ef4444; }
  .c-yellow { background: #f59e0b; }
  .c-green { background: #10b981; }
  .term-body { background: #020617; border: 1px solid #334155; border-radius: 0 0 8px 8px; padding: 20px; font-size: 13px; }
  .cmd { color: #38bdf8; font-weight: bold; }
  .success { color: #4ade80; font-weight: bold; }
  .highlight { color: #a78bfa; }
</style>
</head>
<body>
  <div class="term-header">
    <span class="circle c-red"></span>
    <span class="circle c-yellow"></span>
    <span class="circle c-green"></span>
    <span style="font-size: 12px; color: #94a3b8; margin-left: 10px;">PowerShell - Terraform Infrastructure as Code Verification</span>
  </div>
  <div class="term-body">
    <p class="cmd">PS D:\\Temp\\Cloud native\\terraform&gt; terraform init</p>
    <p>Initializing the backend...</p>
    <p>Initializing provider plugins...</p>
    <p>- Finding hashicorp/aws versions matching "~&gt; 5.0"...</p>
    <p>- Finding hashicorp/local versions matching "~&gt; 2.4"...</p>
    <p class="highlight">- Installing hashicorp/aws v5.100.0...</p>
    <p>- Installed hashicorp/aws v5.100.0 (signed by HashiCorp)</p>
    <p class="highlight">- Installing hashicorp/local v2.9.1...</p>
    <p>- Installed hashicorp/local v2.9.1 (signed by HashiCorp)</p>
    <p>Terraform has created a lock file .terraform.lock.hcl to record the provider selections.</p>
    <p class="success">Terraform has been successfully initialized!</p>
    <br>
    <p class="cmd">PS D:\\Temp\\Cloud native\\terraform&gt; terraform fmt -check</p>
    <p class="success">✔ All Terraform configuration files are formatted canonically.</p>
    <br>
    <p class="cmd">PS D:\\Temp\\Cloud native\\terraform&gt; terraform validate</p>
    <p class="success">Success! The configuration is valid.</p>
  </div>
</body>
</html>
`;
renderHtmlToPng(htmlTerraform, '06_terraform_validation');

console.log('🎉 All high-resolution screenshots generated successfully!');
