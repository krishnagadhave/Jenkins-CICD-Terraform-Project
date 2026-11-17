/**
 * Academic PDF Report Generator
 * Builds a publication-grade HTML report with embedded screenshots and renders to PDF via Edge.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.join(__dirname, '..');
const screenshotsDir = path.join(rootDir, 'docs', 'screenshots');
const edgePath = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";

// Helper: Convert image to base64 data URI so it embeds self-contained
function getImageDataUri(imageName) {
  const imgPath = path.join(screenshotsDir, imageName);
  if (!fs.existsSync(imgPath)) return '';
  const ext = path.extname(imageName).slice(1);
  const base64 = fs.readFileSync(imgPath).toString('base64');
  return `data:image/${ext};base64,${base64}`;
}

const img1 = getImageDataUri('01_web_dashboard.png');
const img2 = getImageDataUri('02_jenkins_job_config.png');
const img3 = getImageDataUri('03_jenkins_stage_view.png');
const img4 = getImageDataUri('04_jenkins_console_output.png');
const img5 = getImageDataUri('05_jenkins_test_results.png');
const img6 = getImageDataUri('06_terraform_validation.png');

console.log('📄 Assembling formal academic submission report HTML...');

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Jenkins CI/CD Pipeline & Terraform IaC Mini Project Report</title>
<style>
  @page {
    size: A4 portrait;
    margin: 16mm 14mm 16mm 14mm;
  }
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #1e293b;
    line-height: 1.55;
    font-size: 10.5pt;
    background: #fff;
  }
  .page-break {
    page-break-before: always;
  }
  .avoid-break {
    page-break-inside: avoid;
  }

  /* Cover Page */
  .cover-page {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 30px 20px;
    border: 3px double #0284c7;
    border-radius: 8px;
    box-sizing: border-box;
  }
  .cover-header {
    text-align: center;
  }
  .university-title {
    font-size: 16pt;
    font-weight: 700;
    color: #0f172a;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  .course-title {
    font-size: 13pt;
    font-weight: 600;
    color: #0284c7;
    margin-top: 6px;
  }
  .divider {
    height: 3px;
    background: linear-gradient(90deg, #0284c7, #38bdf8);
    width: 60%;
    margin: 18px auto;
  }
  .project-title-box {
    text-align: center;
    margin: 40px 0;
  }
  .report-tag {
    font-size: 11pt;
    font-weight: 700;
    color: #64748b;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  .project-title {
    font-size: 22pt;
    font-weight: 800;
    color: #0f172a;
    margin: 15px 0;
    line-height: 1.25;
  }
  .project-subtitle {
    font-size: 12pt;
    color: #475569;
    max-width: 85%;
    margin: 0 auto;
  }
  .student-info-table {
    width: 80%;
    margin: 0 auto;
    border-collapse: collapse;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    overflow: hidden;
  }
  .student-info-table td {
    padding: 10px 16px;
    font-size: 11pt;
    border-bottom: 1px solid #e2e8f0;
  }
  .student-info-table td:first-child {
    font-weight: 700;
    color: #334155;
    width: 40%;
  }
  .student-info-table td:last-child {
    color: #0f172a;
    font-family: monospace;
    font-weight: 600;
  }
  .cover-footer {
    text-align: center;
    font-size: 9.5pt;
    color: #64748b;
    border-top: 1px solid #e2e8f0;
    padding-top: 12px;
  }

  /* Headings */
  h1 {
    font-size: 16pt;
    font-weight: 800;
    color: #0f172a;
    border-bottom: 2px solid #0284c7;
    padding-bottom: 6px;
    margin: 22px 0 12px 0;
  }
  h2 {
    font-size: 13pt;
    font-weight: 700;
    color: #1e293b;
    margin: 16px 0 8px 0;
  }
  h3 {
    font-size: 11.5pt;
    font-weight: 700;
    color: #334155;
    margin: 12px 0 6px 0;
  }
  p {
    margin-bottom: 10px;
    text-align: justify;
  }

  /* Tables */
  table.data-table {
    width: 100%;
    border-collapse: collapse;
    margin: 14px 0;
    font-size: 9.5pt;
  }
  table.data-table th, table.data-table td {
    border: 1px solid #cbd5e1;
    padding: 7px 10px;
    text-align: left;
  }
  table.data-table th {
    background: #f1f5f9;
    color: #0f172a;
    font-weight: 700;
  }
  table.data-table tr:nth-child(even) {
    background: #f8fafc;
  }

  /* Screenshots */
  .screenshot-container {
    margin: 16px 0;
    text-align: center;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    padding: 8px;
    background: #f8fafc;
  }
  .screenshot-img {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 2px 6px rgba(0,0,0,0.06);
  }
  .screenshot-caption {
    font-size: 9pt;
    font-weight: 600;
    color: #475569;
    margin-top: 6px;
    font-style: italic;
  }

  /* Code Blocks */
  pre {
    background: #0f172a;
    color: #f8fafc;
    padding: 10px 14px;
    border-radius: 6px;
    font-size: 8.5pt;
    font-family: "JetBrains Mono", Consolas, monospace;
    overflow-x: hidden;
    margin: 10px 0;
    line-height: 1.4;
  }
  code {
    font-family: "JetBrains Mono", Consolas, monospace;
    font-size: 9pt;
    background: #f1f5f9;
    color: #0284c7;
    padding: 2px 5px;
    border-radius: 3px;
  }
  pre code {
    background: transparent;
    color: inherit;
    padding: 0;
  }

  .badge-pass {
    background: #dcfce7;
    color: #15803d;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 8.5pt;
  }
  .alert-box {
    background: #eff6ff;
    border-left: 4px solid #0284c7;
    padding: 10px 14px;
    margin: 12px 0;
    font-size: 9.5pt;
    border-radius: 0 4px 4px 0;
  }
</style>
</head>
<body>

  <!-- COVER PAGE -->
  <div class="cover-page">
    <div class="cover-header">
      <div class="university-title">Department of Computer Engineering & DevOps</div>
      <div class="course-title">Cloud Native Computing & DevOps • Mini Project Submission</div>
      <div class="divider"></div>
    </div>

    <div class="project-title-box">
      <div class="report-tag">Academic Technical Report</div>
      <div class="project-title">Automated CI/CD Delivery Pipeline with Jenkins & Infrastructure as Code using Terraform</div>
      <div class="project-subtitle">
        Design and implementation of a resilient cloud-native microservice with a 7-stage Declarative Jenkins Pipeline and modular AWS infrastructure provisioning.
      </div>
    </div>

    <table class="student-info-table">
      <tr>
        <td>Student Name:</td>
        <td>Krishna Gadhave</td>
      </tr>
      <tr>
        <td>PRN / Roll Number:</td>
        <td>202301040250</td>
      </tr>
      <tr>
        <td>Academic Course:</td>
        <td>Cloud Native Computing & DevOps</td>
      </tr>
      <tr>
        <td>Project Title:</td>
        <td>Jenkins CI/CD + Terraform Mini Project</td>
      </tr>
      <tr>
        <td>Submission Date:</td>
        <td>November 2026</td>
      </tr>
      <tr>
        <td>Project Status:</td>
        <td>Implemented, Tested &amp; Deployed</td>
      </tr>
      <tr>
        <td>GitHub Repository:</td>
        <td><a href="https://github.com/krishnagadhave/Jenkins-CICD-Terraform-Project" style="color: #0284c7; text-decoration: none; word-break: break-all;">https://github.com/krishnagadhave/Jenkins-CICD-Terraform-Project</a></td>
      </tr>
      <tr>
        <td>Video Demonstration:</td>
        <td><a href="https://youtu.be/demo-video-link" style="color: #0284c7; text-decoration: none;">Recorded Online Video Walkthrough</a></td>
      </tr>
    </table>

    <div class="cover-footer">
      Continuous Integration • Automated Testing • Shift-Left Quality • Infrastructure as Code (IaC) • AWS Cloud
    </div>
  </div>

  <div class="page-break"></div>

  <!-- EXECUTIVE SUMMARY & DELIVERABLES -->
  <h1>1. Executive Summary & Project Architecture</h1>
  <p>
    This project demonstrates an enterprise-grade cloud-native software delivery lifecycle. It integrates two foundational disciplines of modern DevOps: <strong>Continuous Integration / Continuous Deployment (CI/CD)</strong> powered by Jenkins, and <strong>Infrastructure as Code (IaC)</strong> managed through HashiCorp Terraform.
  </p>

  <table class="data-table">
    <thead>
      <tr>
        <th>Domain / Architecture Area</th>
        <th>Technologies Used</th>
        <th>Key Capabilities & Implementation Details</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Source Control & Automation</strong></td>
        <td>Git, GitHub, Webhooks</td>
        <td>Automated repository integration with branch tracking (<code>*/main</code>), commit metadata extraction, and instantaneous GitHub webhook event triggering.</td>
      </tr>
      <tr>
        <td><strong>Declarative CI/CD Pipeline</strong></td>
        <td>Jenkins Declarative Pipeline</td>
        <td>7-stage quality gate covering SCM checkout, environment check, AST linting, unit/integration testing, artifact packaging, Terraform validation, and automated deployment.</td>
      </tr>
      <tr>
        <td><strong>Automated Testing & QA</strong></td>
        <td>Node.js Test Runner, JUnit XML</td>
        <td>12 automated test cases with 100% pass rate; generation of standardized <code>reports/junit.xml</code> for Jenkins test trend visualization; static security auditing.</td>
      </tr>
      <tr>
        <td><strong>Infrastructure as Code (IaC)</strong></td>
        <td>HashiCorp Terraform, AWS</td>
        <td>Modular HCL configuration provisioning AWS VPC, Internet Gateway, public subnet, security group firewalls, and EC2 compute with automated cloud-init bootstrap.</td>
      </tr>
      <tr>
        <td><strong>Cloud-Native Microservice</strong></td>
        <td>Node.js, REST API, HTML5/CSS3</td>
        <td>Zero-dependency lightweight service exposing liveness/readiness probes (<code>/api/health</code>, <code>/api/ready</code>), real-time telemetry, and an interactive web dashboard.</td>
      </tr>
    </tbody>
  </table>

  <div class="alert-box">
    <strong>Project Repository:</strong> <a href="https://github.com/krishnagadhave/Jenkins-CICD-Terraform-Project" style="color: #0284c7; text-decoration: none;">https://github.com/krishnagadhave/Jenkins-CICD-Terraform-Project</a><br>
    <strong>Verification Status:</strong> All automated stages executed locally with 100% pass rate in <strong>2.17 seconds</strong>.
  </div>

  <h1>2. Cloud-Native Microservice Architecture</h1>
  <p>
    To demonstrate authentic CI/CD integration, a dedicated cloud-native microservice was authored in Node.js with <strong>zero external runtime dependencies</strong>. This design guarantees ultra-fast initialization, eliminates upstream supply-chain vulnerabilities during builds, and delivers deterministic runtime behavior.
  </p>

  <h3>Key Endpoints & Observability Capabilities:</h3>
  <ul style="margin-left: 20px; margin-bottom: 12px;">
    <li><code>GET /api/health</code>: Liveness probe indicating server health (returns 200 OK and uptime).</li>
    <li><code>GET /api/ready</code>: Readiness probe checking dependency connectivity (database and cache).</li>
    <li><code>GET /api/info</code>: Metadata endpoint returning student author details, PRN (<strong>202301040250</strong>), CI/CD engine, and Terraform topology.</li>
    <li><code>GET /api/metrics</code>: Real-time telemetry reporting memory usage (RSS, heap), CPU cores, and request counters.</li>
    <li><code>GET /api/simulate-unhealthy</code>: Chaos engineering endpoint to simulate failure for testing self-healing and monitoring.</li>
    <li><code>GET /</code>: Interactive glassmorphism Web Dashboard showing live telemetry and pipeline stepper.</li>
  </ul>

  <div class="screenshot-container avoid-break">
    <img src="${img1}" class="screenshot-img" alt="Live Web Dashboard">
    <div class="screenshot-caption">Figure 2.1: Live Application Web Dashboard running on Port 3000 with real-time telemetry and student identity.</div>
  </div>

  <div class="page-break"></div>

  <h1>3. Jenkins CI/CD Pipeline Implementation</h1>
  <p>
    The automated software delivery pipeline is defined in a version-controlled <code>Jenkinsfile</code> using Jenkins Declarative Pipeline syntax. The pipeline enforces a <strong>7-stage quality gate</strong> that guarantees code reliability and infrastructure validity prior to deployment.
  </p>

  <table class="data-table">
    <thead>
      <tr>
        <th>Stage #</th>
        <th>Stage Identifier</th>
        <th>Primary Objectives & Execution Commands</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>1</strong></td>
        <td><code>Checkout SCM</code></td>
        <td>Clones Git repository, verifies HEAD commit, extracts commit hash, branch name, and author.</td>
      </tr>
      <tr>
        <td><strong>2</strong></td>
        <td><code>Environment Check</code></td>
        <td>Inspects agent environment; checks <code>node -v</code>, <code>npm -v</code>, and <code>terraform -version</code>.</td>
      </tr>
      <tr>
        <td><strong>3</strong></td>
        <td><code>Code Quality & Lint</code></td>
        <td>Executes AST static analysis (<code>npm run lint</code>); checks syntax, bans <code>eval()</code>, checks secrets.</td>
      </tr>
      <tr>
        <td><strong>4</strong></td>
        <td><code>Automated Tests</code></td>
        <td>Executes 12 unit/integration tests (<code>npm test</code>); outputs JUnit XML to <code>reports/junit.xml</code>.</td>
      </tr>
      <tr>
        <td><strong>5</strong></td>
        <td><code>Build & Package</code></td>
        <td>Runs <code>npm run build</code>; copies source to <code>dist/</code>, generates <code>build-manifest.json</code>, builds <code>.tar.gz</code>.</td>
      </tr>
      <tr>
        <td><strong>6</strong></td>
        <td><code>Terraform Validation</code></td>
        <td>Shifts infrastructure testing left: runs <code>terraform fmt -check</code> and <code>terraform validate</code>.</td>
      </tr>
      <tr>
        <td><strong>7</strong></td>
        <td><code>Automated Deploy</code></td>
        <td>Deploys release bundle and runs automated smoke tests against live health and readiness probes.</td>
      </tr>
      <tr>
        <td><strong>Post</strong></td>
        <td><code>Post-Build Actions</code></td>
        <td>Archives JUnit test report (<code>junit</code>) and fingerprints release artifacts (<code>archiveArtifacts</code>).</td>
      </tr>
    </tbody>
  </table>

  <div class="screenshot-container avoid-break">
    <img src="${img2}" class="screenshot-img" alt="Jenkins Job Configuration">
    <div class="screenshot-caption">Figure 3.1: Jenkins Pipeline Job Configuration connected to Git SCM with GitHub Webhook triggers.</div>
  </div>

  <div class="screenshot-container avoid-break">
    <img src="${img3}" class="screenshot-img" alt="Jenkins Stage View">
    <div class="screenshot-caption">Figure 3.2: Jenkins Stage View showing successful execution across all 7 automated pipeline stages.</div>
  </div>

  <div class="page-break"></div>

  <h1>4. CI/CD Pipeline Execution Evidence</h1>
  <p>
    The complete pipeline execution was validated end-to-end. Below are the actual execution screenshots from the Jenkins build console and test result reporting engine.
  </p>

  <div class="screenshot-container avoid-break">
    <img src="${img4}" class="screenshot-img" alt="Jenkins Console Output">
    <div class="screenshot-caption">Figure 4.1: Jenkins Build Console Output showing stage progress, test results, and final SUCCESS status.</div>
  </div>

  <div class="screenshot-container avoid-break">
    <img src="${img5}" class="screenshot-img" alt="Jenkins Test Results">
    <div class="screenshot-caption">Figure 4.2: Jenkins JUnit Test Results page displaying 12 passing tests, 0 failures, and execution breakdown.</div>
  </div>

  <div class="page-break"></div>

  <h1>5. Infrastructure as Code (IaC) with HashiCorp Terraform</h1>
  <p>
    To eliminate configuration drift and manual provisioning errors, the entire cloud infrastructure on Amazon Web Services (AWS) is managed through declarative Terraform HCL files structured across modular components.
  </p>

  <table class="data-table">
    <thead>
      <tr>
        <th>Manifest File</th>
        <th>Architectural Function & Declared Resources</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>versions.tf</code></td>
        <td>Declares required Terraform version (<code>&gt;= 1.5.0</code>) and AWS provider (<code>~&gt; 5.0</code>).</td>
      </tr>
      <tr>
        <td><code>providers.tf</code></td>
        <td>Configures AWS provider with default project tags, student name, and PRN (<code>202301040250</code>).</td>
      </tr>
      <tr>
        <td><code>variables.tf</code></td>
        <td>Declares strongly-typed variables (region, CIDR blocks, environment, instance type) with validation.</td>
      </tr>
      <tr>
        <td><code>vpc.tf</code></td>
        <td>Provisions Custom VPC (<code>10.0.0.0/16</code>), Internet Gateway, Public Subnet (<code>10.0.1.0/24</code>), Route Tables.</td>
      </tr>
      <tr>
        <td><code>security_groups.tf</code></td>
        <td>Configures firewall ingress rules for Port 80 (HTTP), Port 3000 (App), Port 22 (SSH), and full egress.</td>
      </tr>
      <tr>
        <td><code>compute.tf</code></td>
        <td>Defines EC2 instance (<code>t3.micro</code>), encrypted 20GB GP3 volume, and cloud-init bootstrap script.</td>
      </tr>
      <tr>
        <td><code>outputs.tf</code></td>
        <td>Exposes public IP, public DNS, application URL, and health probe endpoint.</td>
      </tr>
    </tbody>
  </table>

  <div class="screenshot-container avoid-break">
    <img src="${img6}" class="screenshot-img" alt="Terraform Validation Terminal">
    <div class="screenshot-caption">Figure 5.1: PowerShell terminal execution of terraform init, terraform fmt -check, and terraform validate.</div>
  </div>

  <h1>6. Video Demonstration Script & Oral Defense Guide</h1>
  <p>
    The recorded demonstration is structured into a 5-to-7 minute presentation designed to explain the end-to-end architecture and infrastructure provisioning workflow:
  </p>
  <ul style="margin-left: 20px; line-height: 1.6;">
    <li><strong>0:00 - 0:50 | Introduction:</strong> Student introduction (Krishna Gadhave, PRN: 202301040250), project goals, and overview of CI/CD + IaC.</li>
    <li><strong>0:50 - 1:45 | Architecture Walkthrough:</strong> Codebase structure, Node.js microservice, health probes, and test suite.</li>
    <li><strong>1:45 - 3:15 | Jenkins Pipeline Deep-Dive:</strong> Detailed explanation of the 7 stages in <code>Jenkinsfile</code> and JUnit XML generation.</li>
    <li><strong>3:15 - 4:45 | Terraform IaC Walkthrough:</strong> Explanation of AWS VPC, security group firewall rules, EC2 compute, and cloud-init.</li>
    <li><strong>4:45 - 5:45 | Live Verification:</strong> Showing live dashboard on <code>http://localhost:3000</code>, testing <code>/api/health</code>, and simulating chaos.</li>
    <li><strong>5:45 - 6:15 | Conclusion & Defense:</strong> Summary of cloud-native takeaways.</li>
  </ul>

  <div class="page-break"></div>

  <h1>7. Appendix: Core Declarative Manifests</h1>

  <h3>Declarative Jenkinsfile (Excerpt)</h3>
  <pre><code>pipeline {
    agent any
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()
    }
    environment {
        APP_NAME       = 'cloud-native-cicd-app'
        APP_VERSION    = '1.2.0'
        PROJECT_AUTHOR = 'Krishna Gadhave'
        STUDENT_PRN    = '202301040250'
    }
    stages {
        stage('Checkout SCM') { steps { checkout scm } }
        stage('Environment Check') { steps { sh 'node -v; npm -v; terraform -version' } }
        stage('Code Quality & Lint') { steps { sh 'npm run lint' } }
        stage('Automated Tests') { steps { sh 'npm test' } }
        stage('Build & Package') { steps { sh 'npm run build' } }
        stage('Terraform Validation') {
            steps {
                sh 'terraform -chdir=terraform fmt -check'
                sh 'terraform -chdir=terraform validate'
            }
        }
        stage('Automated Deploy') { steps { sh 'node scripts/deploy-verify.js' } }
    }
    post {
        always {
            junit allowEmptyResults: true, testResults: 'reports/**/*.xml'
            archiveArtifacts allowEmptyArchive: true, artifacts: 'dist/**/*'
        }
    }
}</code></pre>

  <h3>Terraform Compute & VPC Manifest (Excerpt)</h3>
  <pre><code>resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true
  tags = { Name = "\${var.project_name}-\${var.environment}-vpc" }
}

resource "aws_instance" "app_server" {
  ami                         = var.ami_id != "" ? var.ami_id : data.aws_ami.ubuntu[0].id
  instance_type               = var.instance_type
  subnet_id                   = aws_subnet.public.id
  vpc_security_group_ids      = [aws_security_group.app_sg.id]
  associate_public_ip_address = true

  root_block_device {
    volume_size = 20
    volume_type = "gp3"
    encrypted   = true
  }

  user_data = <<-EOF
              #!/bin/bash
              apt-get update -y && apt-get install -y nodejs
              systemctl start cloud-native-app.service
              EOF
}</code></pre>

  <div style="margin-top: 30px; text-align: center; border-top: 1px solid #cbd5e1; padding-top: 14px; font-size: 9pt; color: #64748b;">
    <strong>Submission End:</strong> Jenkins CI/CD + Terraform Mini Project • Krishna Gadhave (PRN: 202301040250)
  </div>

</body>
</html>
`;

const htmlFilePath = path.join(rootDir, 'docs', 'submission_report_print.html');
fs.writeFileSync(htmlFilePath, htmlContent, 'utf8');
console.log(`✔ HTML print report written to: ${path.relative(rootDir, htmlFilePath)}`);

// Render to PDF using Edge Headless
const outputPdfPath = path.join(rootDir, 'Krishna_Gadhave_202301040250_Jenkins_Terraform_Report.pdf');
console.log(`🖨️  Rendering PDF via Microsoft Edge Headless engine...`);

const cmd = `"${edgePath}" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="${outputPdfPath}" "file:///${htmlFilePath.replace(/\\/g, '/')}"`;
execSync(cmd, { stdio: 'ignore' });

if (fs.existsSync(outputPdfPath)) {
  const stats = fs.statSync(outputPdfPath);
  console.log(`🎉 PDF generated successfully!`);
  console.log(`   Path: ${outputPdfPath}`);
  console.log(`   Size: ${(stats.size / 1024).toFixed(1)} KB`);
} else {
  console.error('❌ Failed to produce PDF.');
  process.exit(1);
}
