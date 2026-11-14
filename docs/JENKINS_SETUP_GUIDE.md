# 🛠️ Jenkins CI/CD Setup & Configuration Guide

**Project:** Cloud Native Jenkins CI/CD + Terraform Mini Project  
**Author:** Krishna Gadhave (PRN: 202301040250)  
**Course:** Cloud Native Computing & DevOps  

---

## 📌 1. Overview
This guide provides complete instructions to set up, configure, and execute the automated Jenkins Declarative Pipeline for the **Cloud Native Microservice**.

---

## 🚀 2. Prerequisites & Installation

### Option A: Running Jenkins via Docker (Recommended)
```bash
docker run -d \
  --name jenkins-server \
  -p 8080:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkins/jenkins:lts-jdk21
```

### Option B: Running Jenkins Standalone (WAR file)
Ensure Java 17 or 21 LTS is installed:
```powershell
java -version
```
Download `jenkins.war` and run:
```powershell
java -jar jenkins.war --httpPort=8080
```
Access Jenkins at `http://localhost:8080`.

---

## 🔌 3. Required Jenkins Plugins
Navigate to **Manage Jenkins** ➔ **Plugins** ➔ **Available Plugins** and install:
1. **Pipeline** (Workflow Aggregator)
2. **Git Plugin**
3. **NodeJS Plugin**
4. **JUnit Plugin** (renders JUnit XML test graphs)
5. **Timestamper**
6. **Pipeline: Stage View Plugin**

---

## ⚙️ 4. Tool Configuration (Node.js & Terraform)

### Configure Node.js:
1. Go to **Manage Jenkins** ➔ **Tools**.
2. Scroll to **NodeJS**.
3. Click **Add NodeJS**:
   - **Name:** `NodeJS-20` or `SystemNode`
   - Select **Install automatically** (Version: NodeJS 20.x or 22.x) OR point to local Node binary.
4. Click **Save**.

### Configure Terraform:
1. Under **Tools**, click **Terraform Installations** (if using Terraform plugin) or ensure `terraform` is added to system `PATH`.
2. Verify by running `terraform -version` on the agent shell.

---

## 🏗️ 5. Creating the Jenkins Pipeline Job

1. On the Jenkins Dashboard, click **New Item**.
2. Enter Job Name: `cloud-native-cicd-pipeline`.
3. Select **Pipeline** and click **OK**.
4. In the Job Configuration page:
   - **Description:** `Automated CI/CD Pipeline for Cloud Native Microservice with Terraform IaC validation.`
   - Under **Build Triggers**, select:
     - `GitHub hook trigger for GITScm polling` (for automated webhook builds) OR
     - `Poll SCM` (Schedule: `H/5 * * * *` to check every 5 minutes).
5. Scroll down to **Pipeline**:
   - **Definition:** Select `Pipeline script from SCM`.
   - **SCM:** Select `Git`.
   - **Repository URL:** Enter your repository URL (e.g., `https://github.com/<your-username>/cloud-native-cicd-app.git`).
   - **Credentials:** Add your GitHub Personal Access Token (PAT) if private, or leave empty if public.
   - **Branches to build:** `*/main` or `*/master`.
   - **Script Path:** `Jenkinsfile`.
6. Click **Save**.

---

## ▶️ 6. Executing the Pipeline

1. Click **Build Now** on the left menu.
2. Observe the **Stage View**:
   - `Checkout SCM` ➔ Green (Checks out latest git commit)
   - `Environment Check` ➔ Green (Validates Node.js & Terraform)
   - `Code Quality & Lint` ➔ Green (Checks syntax & security)
   - `Automated Tests` ➔ Green (Runs 12 unit & integration tests)
   - `Build & Package` ➔ Green (Bundles dist/ & creates tarball)
   - `Terraform Validation` ➔ Green (Validates IaC syntax & schemas)
   - `Automated Deploy` ➔ Green (Deploys & verifies health probes)
3. Click on the Build Number (e.g. `#1`) ➔ **Test Result**:
   - Displays 12 Passed tests with 0 Failures.
4. Click **Console Output** to review full chronological execution logs.

---

## 🌐 7. Setting up GitHub Webhook (Automated Push Trigger)

1. Open your GitHub repository ➔ **Settings** ➔ **Webhooks** ➔ **Add webhook**.
2. **Payload URL:** `http://<your-jenkins-ip>:8080/github-webhook/`
3. **Content type:** `application/json`
4. **Which events would you like to trigger this webhook?** `Just the push event`.
5. Click **Add webhook**.
6. Make a commit to `main` (`git commit -am "test trigger" && git push`):
   - Jenkins will automatically detect the commit and trigger a new build within seconds!
