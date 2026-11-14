/**
 * Automated Test Runner & JUnit XML Generator
 * Produces clean console logs and writes standard JUnit XML reports for Jenkins.
 */

const fs = require('fs');
const path = require('path');

const testFiles = ['unit.test.js', 'integration.test.js'];
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const testResults = [];

console.log('\n================================================================');
console.log('🧪 Starting Automated Test Suite (CI/CD Pipeline)');
console.log('================================================================');

const suiteStartTime = Date.now();

for (const file of testFiles) {
  const filePath = path.join(__dirname, '..', 'test', file);
  if (!fs.existsSync(filePath)) continue;

  const suiteName = path.basename(file, '.js');
  console.log(`\n📁 Running Test Suite: [${suiteName}]`);

  const tests = require(filePath);
  for (const test of tests) {
    totalTests++;
    const testStart = Date.now();
    try {
      test.fn();
      const duration = (Date.now() - testStart) / 1000;
      passedTests++;
      console.log(`  ✔ [PASS] ${test.name} (${duration}s)`);
      testResults.push({
        suite: suiteName,
        name: test.name,
        time: duration,
        status: 'passed'
      });
    } catch (err) {
      const duration = (Date.now() - testStart) / 1000;
      failedTests++;
      console.error(`  ✖ [FAIL] ${test.name} (${duration}s)`);
      console.error(`     Error: ${err.message}`);
      testResults.push({
        suite: suiteName,
        name: test.name,
        time: duration,
        status: 'failed',
        error: err.message,
        stack: err.stack
      });
    }
  }
}

const totalDuration = ((Date.now() - suiteStartTime) / 1000).toFixed(3);

console.log('\n----------------------------------------------------------------');
console.log(`🏁 Test Execution Summary:`);
console.log(`   Total Tests:  ${totalTests}`);
console.log(`   Passed:       ${passedTests}`);
console.log(`   Failed:       ${failedTests}`);
console.log(`   Duration:     ${totalDuration} seconds`);
console.log('----------------------------------------------------------------');

// Generate JUnit XML Report for Jenkins
const reportsDir = path.join(__dirname, '..', 'reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

let junitXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
junitXml += `<testsuites name="CloudNativeMicroservice" tests="${totalTests}" failures="${failedTests}" time="${totalDuration}">\n`;
junitXml += `  <testsuite name="UnitAndIntegrationTests" tests="${totalTests}" failures="${failedTests}" time="${totalDuration}" timestamp="${new Date().toISOString()}">\n`;

for (const r of testResults) {
  const cleanName = r.name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  junitXml += `    <testcase classname="${r.suite}" name="${cleanName}" time="${r.time}">\n`;
  if (r.status === 'failed') {
    const cleanError = (r.error || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    junitXml += `      <failure message="${cleanError}">${cleanError}</failure>\n`;
  }
  junitXml += `    </testcase>\n`;
}

junitXml += `  </testsuite>\n`;
junitXml += `</testsuites>\n`;

const junitPath = path.join(reportsDir, 'junit.xml');
fs.writeFileSync(junitPath, junitXml, 'utf8');
console.log(`📄 Saved JUnit XML test report to: ${junitPath}\n`);

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
