# 🎥 Video Demonstration Script & Presentation Guide

**Project:** Cloud Native Jenkins CI/CD + Terraform Mini Project  
**Student Name:** Krishna Gadhave  
**PRN / Roll Number:** 202301040250  
**Course:** Cloud Native Computing & DevOps  
**Target Grade:** 5 / 5 Marks (Rubric: Excellent demonstration and confidently explains Jenkins/Terraform concepts)  
**Target Duration:** 5 to 7 Minutes  

---

## 🎬 Video Recording Checklist Before You Start
- [ ] Open Jenkins Web UI (`http://localhost:8080`) on your browser.
- [ ] Open GitHub repository page in another browser tab.
- [ ] Open VS Code / Antigravity showing the project files (`Jenkinsfile`, `terraform/`, `src/server.js`).
- [ ] Open a clean PowerShell / Terminal window.
- [ ] Ensure microphone audio is crisp and screen resolution is set to 1080p (1920x1080).

---

## ⏱️ Detailed Timestamped Presentation Script

### 🕒 Section 1: Introduction & Project Overview (0:00 - 0:50)
**[Screen: Show Title Slide or GitHub Repository / Dashboard]**

> "Hello respected evaluator and professors. My name is **Krishna Gadhave**, PRN **202301040250**, and today I am presenting my mini project for **Cloud Native Computing & DevOps** titled: **Automated CI/CD Pipeline with Jenkins and Infrastructure as Code using Terraform**.
>
> In modern cloud-native engineering, delivering software rapidly and reliably requires two essential pillars:
> 1. First, **Continuous Integration and Continuous Deployment (CI/CD)** to automate testing, building, and deployment of application code.
> 2. Second, **Infrastructure as Code (IaC)** to provision and govern cloud infrastructure consistently, eliminating configuration drift and manual provisioning errors.
>
> In this project, I have built a production-grade cloud-native microservice, established a multi-stage Declarative Jenkins Pipeline that integrates SCM, automated linting, unit testing, packaging, and deployment, and authored a modular Terraform configuration to provision an AWS VPC and compute topology."

---

### 🕒 Section 2: Application Architecture & Code Structure (0:50 - 1:45)
**[Screen: Switch to VS Code / IDE displaying the repository structure]**

> "Let's first take a brief look at the project architecture.
>
> As you can see in the directory structure, the application is organized cleanly:
> - Under `src/`, we have `server.js`, a lightweight, production-ready Node.js microservice built with zero third-party runtime dependencies. It exposes health probes (`/api/health`), readiness probes (`/api/ready`), runtime metrics (`/api/metrics`), and an interactive web telemetry dashboard in `src/public/`.
> - Under `test/`, we have unit and integration test suites that validate endpoint responses, security headers like `X-Content-Type-Options` and `X-Frame-Options`, and simulated failure recovery.
> - Under `scripts/`, we have our automated test runner that outputs standard JUnit XML reports, as well as linting, packaging, and deployment verification scripts.
> - And at the root, we have our `Jenkinsfile` and our `terraform/` directory."

---

### 🕒 Section 3: Jenkins CI/CD Pipeline Deep-Dive (1:45 - 3:15)
**[Screen: Show the `Jenkinsfile` in the editor, then switch to Jenkins Stage View]**

> "Now, let's look at the CI/CD pipeline implementation.
>
> I chose a **Jenkins Declarative Pipeline** because declarative syntax provides strict structure, automatic stage-level error handling, and robust post-action notifications.
>
> The pipeline consists of seven automated stages:
> 1. **Stage 1: Checkout SCM** — Integrates directly with our Git repository, fetching the latest commit hash and branch metadata.
> 2. **Stage 2: Environment Check** — Verifies that Node.js, npm, and Terraform runtimes are present and compatible on the agent.
> 3. **Stage 3: Code Quality & Lint** — Executes static code analysis, ensuring zero syntax errors and guarding against security anti-patterns.
> 4. **Stage 4: Automated Tests** — Runs our unit and integration tests and outputs a JUnit XML report.
> 5. **Stage 5: Build & Package** — Bundles production assets into a `dist/` directory, injects build metadata into `build-manifest.json`, and archives a compressed release tarball.
> 6. **Stage 6: Terraform Validation** — Implements 'Shift-Left' infrastructure testing by executing `terraform fmt -check` and `terraform validate` directly within CI.
> 7. **Stage 7: Automated Deploy** — Executes continuous deployment and performs post-deployment smoke tests against the health endpoints.
>
> Finally, in the `post` block, Jenkins automatically archives the JUnit test results and build artifacts."

**[Screen Action: In Jenkins, click 'Build Now' or show Build #1 Stage View]**

> "Here in the Jenkins Web UI, you can see our pipeline build. Every single stage is illuminated in green. If we click into the **Test Result**, we see that all 12 tests passed with zero failures in just milliseconds. Furthermore, under **Build Artifacts**, our release bundle and manifest are securely fingerprinted and preserved."

---

### 🕒 Section 4: Terraform Infrastructure as Code (3:15 - 4:45)
**[Screen: Switch to IDE displaying `terraform/` folder]**

> "Next, let's examine the **Infrastructure as Code** component built with HashiCorp Terraform.
>
> Rather than manually clicking through the AWS console, this entire cloud infrastructure is defined declaratively across structured, reusable files:
> - In `versions.tf` and `providers.tf`, we pin the HashiCorp AWS provider (`~> 5.0`) and apply default organizational tags automatically to every resource.
> - In `variables.tf`, all infrastructure parameters—such as region, environment, VPC CIDR, subnet CIDR, and instance type—are strongly typed with validation constraints.
> - In `vpc.tf`, we provision a custom isolated Virtual Private Cloud with an Internet Gateway, a public subnet in `us-east-1a`, and route tables directing outbound internet traffic.
> - In `security_groups.tf`, we enforce defense-in-depth firewall rules: opening Port 80 for web traffic, Port 3000 for the Node.js application, Port 22 for administrative SSH, and full outbound access for OS updates.
> - In `compute.tf`, we provision an EC2 instance on Ubuntu 24.04 with an encrypted GP3 volume and a cloud-init `user_data` script that automatically bootstraps Node.js, registers a systemd service, and launches the application.
> - In `outputs.tf`, we expose the public IP, public DNS, and application healthcheck URL."

**[Screen Action: In the terminal, show `terraform fmt -check` and `terraform validate`]**

> "Running `terraform fmt -check` confirms canonical formatting, and `terraform validate` confirms that all resource syntax, relationships, and provider schemas are 100% valid."

---

### 🕒 Section 5: Live Application & Telemetry Verification (4:45 - 5:45)
**[Screen: Switch to browser at `http://localhost:3000`]**

> "Finally, let's verify the running application.
>
> Here is our live Web Dashboard. In the header, you can see my name, **Krishna Gadhave**, and PRN **202301040250**.
>
> The dashboard displays our visual pipeline stepper, confirming all stages have succeeded. Under real-time telemetry, both the liveness probe (`/api/health`) and readiness probe (`/api/ready`) report healthy 200 OK statuses.
>
> We also have interactive controls: clicking **Fetch /api/info** returns complete metadata about the running instance, Node version, memory usage, and the Terraform-provisioned infrastructure.
>
> We can even simulate cloud chaos: clicking **Simulate Service Unhealthy** immediately turns the liveness indicator red and flips the API to 503, and clicking **Reset** restores it to healthy. This demonstrates how modern orchestration tools and monitoring agents detect and self-heal services."

---

### 🕒 Section 6: Conclusion (5:45 - 6:15)
**[Screen: Switch back to camera or project summary slide]**

> "To conclude, this mini project successfully demonstrates:
> 1. Complete automated source-code integration, testing, packaging, and deployment through a robust Jenkins pipeline.
> 2. Structured, modular, and reusable Infrastructure as Code using Terraform.
> 3. Production observability, health checking, and cloud-native resilience.
>
> Thank you very much for your time and evaluation!"

---

## 💡 Top Oral Defense & Viva Questions with Answers

### Q1: What is the difference between Declarative and Scripted Jenkins Pipelines?
**Answer:**  
"A Declarative Pipeline uses a simplified, opinionated, and structured syntax (`pipeline { stage { steps { } } }`) with built-in post-actions, strict syntax validation before execution, and clean visualization in Jenkins Stage View. Scripted Pipeline uses Groovy procedural code (`node { }`), offering maximum programming flexibility but lacking declarative guardrails."

### Q2: Why is `terraform validate` important in a CI/CD pipeline?
**Answer:**  
"`terraform validate` checks whether the configuration is syntactically valid and internally consistent according to provider schemas, without needing cloud provider credentials or remote network access. Placing it in Stage 6 enforces the 'Shift-Left' principle, catching infrastructure syntax and reference errors before they reach testing or deployment."

### Q3: What is the purpose of the `.terraform.lock.hcl` file?
**Answer:**  
"The dependency lock file records the exact provider version selections and cryptographic hashes used in the configuration. Committing this file to Git ensures deterministic and reproducible builds across all developer workstations and CI/CD agents."

### Q4: How does Jenkins know when a developer pushes new code?
**Answer:**  
"Through a GitHub Webhook or SCM Polling. With webhooks, GitHub sends an HTTP POST payload to the Jenkins `/github-webhook/` endpoint immediately upon push, triggering a build instantaneously with zero delay."
