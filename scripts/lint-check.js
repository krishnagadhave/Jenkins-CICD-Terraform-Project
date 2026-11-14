/**
 * Code Quality & Static Analysis Checker (CI/CD Pipeline Lint Stage)
 * Verifies syntax, security anti-patterns, and file structure without external tools.
 */

const fs = require('fs');
const path = require('path');

console.log('\n================================================================');
console.log('🔍 Executing Static Code Quality & Security Analysis');
console.log('================================================================');

let errors = 0;
let warnings = 0;
let checkedFiles = 0;

function lintFile(filePath) {
  checkedFiles++;
  const content = fs.readFileSync(filePath, 'utf8');
  const relative = path.relative(path.join(__dirname, '..'), filePath);

  // Check 1: No eval or unsafe execution (exclude lint script itself)
  if (!filePath.endsWith('lint-check.js') && (content.includes('eval(') || content.includes('new Function('))) {
    console.error(`  ✖ [SECURITY ERROR] Disallowed dynamic code execution found in: ${relative}`);
    errors++;
  }

  // Check 2: No hardcoded AWS secret keys
  if (content.match(/AKIA[0-9A-Z]{16}/)) {
    console.error(`  ✖ [SECURITY ERROR] Potential hardcoded AWS Access Key in: ${relative}`);
    errors++;
  }

  // Check 3: Basic JS Syntax Validation via Function constructor
  if (filePath.endsWith('.js')) {
    try {
      new Function(content);
      console.log(`  ✔ [LINT PASS] Syntax valid: ${relative}`);
    } catch (syntaxErr) {
      console.error(`  ✖ [SYNTAX ERROR] ${relative}: ${syntaxErr.message}`);
      errors++;
    }
  }

  // Check 4: JSON Validation
  if (filePath.endsWith('.json')) {
    try {
      JSON.parse(content);
      console.log(`  ✔ [JSON PASS] Format valid: ${relative}`);
    } catch (jsonErr) {
      console.error(`  ✖ [JSON ERROR] Invalid JSON in ${relative}: ${jsonErr.message}`);
      errors++;
    }
  }
}

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== 'dist') {
        walkDir(fullPath);
      }
    } else if (entry.isFile() && (entry.name.endsWith('.js') || entry.name.endsWith('.json'))) {
      lintFile(fullPath);
    }
  }
}

const rootDir = path.join(__dirname, '..');
walkDir(path.join(rootDir, 'src'));
walkDir(path.join(rootDir, 'test'));
walkDir(path.join(rootDir, 'scripts'));
lintFile(path.join(rootDir, 'package.json'));

console.log('----------------------------------------------------------------');
console.log(`📊 Lint & Static Analysis Summary:`);
console.log(`   Checked Files: ${checkedFiles}`);
console.log(`   Violations:    ${errors}`);
console.log(`   Warnings:      ${warnings}`);
console.log('----------------------------------------------------------------\n');

if (errors > 0) {
  process.exit(1);
} else {
  console.log('🎉 Code quality check passed with 0 violations.\n');
  process.exit(0);
}
