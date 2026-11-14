# 📸 Assignment Screenshots Checklist & Submission Evidence

**Project:** Cloud Native Jenkins CI/CD + Terraform Mini Project  
**Author:** Krishna Gadhave (PRN: 202301040250)  
**Course:** Cloud Native Computing & DevOps  

---

## 📋 Required Screenshots Summary Table

| # | Screenshot Title | Requirement Proven | Rubric Marks |
| :-: | :--- | :--- | :--- |
| **01** | Jenkins Job Configuration & Git SCM Integration | Correct repository wiring & pipeline job creation | Jenkins Configuration (5/5) |
| **02** | Jenkins Declarative Pipeline Stage View | All 7 stages executed green (Checkout to Deploy) | Jenkinsfile / CI-CD Pipeline (5/5) |
| **03** | Jenkins Pipeline Console Output | Successful build execution log with zero errors | CI/CD Execution (5/5) |
| **04** | Jenkins Automated Test Results & JUnit Trend | 12/12 passing unit & integration tests | CI/CD Execution (5/5) |
| **05** | Jenkins Archived Build Artifacts (`dist/`) | Release bundle & build manifest generated | CI/CD Execution (5/5) |
| **06** | Terraform Initialization (`terraform init`) | Provider plugins downloaded and locked | Terraform Configuration (5/5) |
| **07** | Terraform Formatting & Validation (`fmt` & `validate`) | Valid HCL syntax, provider schemas & zero errors | Terraform Configuration (5/5) |
| **08** | Application Web Dashboard Running Live | Real-time telemetry, author metadata & probes | Overall Integration (5/5) |
| **09** | Live API Probes (`/api/health` & `/api/info`) | Healthy response payloads & system info | Overall Integration (5/5) |
| **10** | GitHub Repository Overview | Clean directory structure, Jenkinsfile, Terraform code | Repository Submission |

---

## 🔍 Detailed Instructions for Capturing Each Screenshot

### Screenshot 01: Jenkins Job Configuration & Git SCM Integration
- **Screen:** Jenkins Web UI ➔ `cloud-native-cicd-pipeline` ➔ **Configure** ➔ **Pipeline** section.
- **What to show:**
  - Definition: `Pipeline script from SCM`
  - SCM: `Git`
  - Repository URL: Your GitHub repository URL
  - Branch Specifier: `*/main`
  - Script Path: `Jenkinsfile`
- **Rubric Link:** Proves correct Jenkins job and pipeline configuration with repository integration.

---

### Screenshot 02: Jenkins Declarative Pipeline Stage View
- **Screen:** Jenkins Job Main Page ➔ **Stage View**.
- **What to show:**
  - Build `#1` (or latest build) displaying clean green boxes for all 7 stages:
    1. `Checkout SCM`
    2. `Environment Check`
    3. `Code Quality & Lint`
    4. `Automated Tests`
    5. `Build & Package`
    6. `Terraform Validation`
    7. `Automated Deploy`
- **Rubric Link:** Proves a well-designed pipeline covering source integration, build, test, infrastructure validation, and deployment stages.

---

### Screenshot 03: Jenkins Pipeline Console Output
- **Screen:** Jenkins Web UI ➔ Build `#1` ➔ **Console Output**.
- **What to show:**
  - Scroll to the bottom of the console log showing:
    ```text
    🎉 PIPELINE SUCCESSFUL!
    --------------------------------------------------------------------
    Application:  cloud-native-cicd-app (v1.2.0)
    Status:       SUCCESS (All stages passed)
    Author:       Krishna Gadhave (PRN: 202301040250)
    Finished: SUCCESS
    ```
- **Rubric Link:** Demonstrates automated CI/CD workflow with clear build/deployment results.

---

### Screenshot 04: Jenkins Automated Test Results & JUnit Trend
- **Screen:** Jenkins Web UI ➔ Build `#1` ➔ **Test Result**.
- **What to show:**
  - Test Result table showing `12 tests, 0 failures, 0 skipped`.
  - Expanding `unit.test` and `integration.test` suites showing passed test cases:
    - `Liveness Probe (/api/health) Returns 200 OK & Status UP`
    - `Telemetry Endpoint (/api/info) Provides Complete Project & Student Metadata`
    - `Security Headers are Injected into Responses`
- **Rubric Link:** Proves automated test execution and transparent reporting.

---

### Screenshot 05: Jenkins Archived Build Artifacts
- **Screen:** Jenkins Web UI ➔ Build `#1` status page.
- **What to show:**
  - Under **Build Artifacts**:
    - `dist/build-manifest.json`
    - `dist/cloud-native-cicd-app-v1.2.0-build1.tar.gz`
    - `dist/package.json`
- **Rubric Link:** Proves automated build packaging and artifact archiving.

---

### Screenshot 06: Terraform Initialization (`terraform init`)
- **Command to run in terminal:**
  ```powershell
  cd "d:\Temp\Cloud native\terraform"
  terraform init
  ```
- **What to show in screenshot:**
  - Terminal output showing:
    - `Initializing provider plugins...`
    - `Installed hashicorp/aws v5.x.x`
    - `Installed hashicorp/local v2.x.x`
    - `Terraform has been successfully initialized!`
- **Rubric Link:** Proves correct provider configuration and working directory initialization.

---

### Screenshot 07: Terraform Formatting & Validation (`fmt` & `validate`)
- **Command to run in terminal:**
  ```powershell
  cd "d:\Temp\Cloud native\terraform"
  terraform fmt -check
  terraform validate
  ```
- **What to show in screenshot:**
  - Clean execution of `terraform fmt -check` (zero style errors).
  - Terminal output: `Success! The configuration is valid.`
- **Rubric Link:** Proves structured, reusable, and syntactically flawless Infrastructure as Code.

---

### Screenshot 08: Application Web Dashboard Running Live
- **Command to start application:**
  ```powershell
  npm start
  ```
- **Screen:** Browser opened at `http://localhost:3000`.
- **What to show:**
  - Dark-mode dashboard showing:
    - Header: **Cloud-Native CI/CD Pipeline** • Student: **Krishna Gadhave (PRN: 202301040250)**
    - Pipeline Stage Stepper displaying all 7 stages completed.
    - Health Probe: `UP (200 OK)`.
    - Readiness Probe: `READY`.
    - Terraform Infrastructure Topology card (AWS VPC, Subnet, Security Group, EC2).
- **Rubric Link:** Demonstrates deployed end-to-end cloud-native microservice.

---

### Screenshot 09: Live API Endpoints (`/api/health` & `/api/info`)
- **Screen:** Browser or Postman/curl displaying:
  - `http://localhost:3000/api/health`
  - `http://localhost:3000/api/info`
- **What to show:**
  - Clean JSON payload with `healthy: true`, author metadata `Krishna Gadhave`, PRN `202301040250`, and CI/CD engine details.

---

### Screenshot 10: GitHub Repository Overview
- **Screen:** GitHub repository root page in web browser.
- **What to show:**
  - Repository name (e.g., `cloud-native-jenkins-terraform-project`).
  - Directory tree containing `Jenkinsfile`, `package.json`, `terraform/`, `src/`, `test/`, `scripts/`, `docs/`, `README.md`.
  - Latest commit message showing pipeline or initial project commit.
