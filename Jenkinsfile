// =============================================================================
// Jenkins Declarative CI/CD Pipeline
// Project: Cloud-Native Microservice & Infrastructure Provisioning
// Author:  Krishna Gadhave (PRN: 202301040250)
// Course:  Cloud Native Computing & DevOps
// =============================================================================

pipeline {
    agent any

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
    }

    environment {
        APP_NAME        = 'cloud-native-cicd-app'
        APP_VERSION     = '1.2.0'
        NODE_ENV        = 'production'
        DEPLOY_PORT     = '3000'
        PROJECT_AUTHOR  = 'Krishna Gadhave'
        STUDENT_PRN     = '202301040250'
    }

    stages {
        // ---------------------------------------------------------------------
        // Stage 1: Checkout & SCM Integration
        // ---------------------------------------------------------------------
        stage('Checkout SCM') {
            steps {
                echo "=================================================================="
                echo "📥 [STAGE 1] Checking Out Source Code Repository"
                echo "Author:  ${env.PROJECT_AUTHOR} (PRN: ${env.STUDENT_PRN})"
                echo "Build:   #${env.BUILD_NUMBER} on Node: ${env.NODE_NAME}"
                echo "=================================================================="
                
                checkout scm
                
                script {
                    if (isUnix()) {
                        sh '''
                            echo "Branch: $(git rev-parse --abbrev-ref HEAD)"
                            echo "Commit: $(git rev-parse --short HEAD)"
                            echo "Author: $(git log -1 --pretty=format:'%an <%ae>')"
                        '''
                    } else {
                        bat '''
                            @echo off
                            git rev-parse --abbrev-ref HEAD
                            git rev-parse --short HEAD
                        '''
                    }
                }
            }
        }

        // ---------------------------------------------------------------------
        // Stage 2: Environment & Tooling Verification
        // ---------------------------------------------------------------------
        stage('Environment Check') {
            steps {
                echo "=================================================================="
                echo "⚙️  [STAGE 2] Verifying System Tooling & Runtime Dependencies"
                echo "=================================================================="
                script {
                    if (isUnix()) {
                        sh '''
                            echo "Node Version:      $(node -v)"
                            echo "NPM Version:       $(npm -v)"
                            echo "Terraform Version: $(terraform -version | head -n 1)"
                            echo "Workspace Path:    $WORKSPACE"
                        '''
                    } else {
                        bat '''
                            @echo off
                            node -v
                            npm -v
                            terraform -version
                        '''
                    }
                }
            }
        }

        // ---------------------------------------------------------------------
        // Stage 3: Static Code Analysis & Linting
        // ---------------------------------------------------------------------
        stage('Code Quality & Lint') {
            steps {
                echo "=================================================================="
                echo "🔍 [STAGE 3] Executing Static Code Quality & Security Auditing"
                echo "=================================================================="
                script {
                    if (isUnix()) {
                        sh 'npm run lint'
                    } else {
                        bat 'npm run lint'
                    }
                }
            }
        }

        // ---------------------------------------------------------------------
        // Stage 4: Automated Testing
        // ---------------------------------------------------------------------
        stage('Automated Tests') {
            steps {
                echo "=================================================================="
                echo "🧪 [STAGE 4] Executing Unit & Integration Test Suites"
                echo "=================================================================="
                script {
                    if (isUnix()) {
                        sh 'npm test'
                    } else {
                        bat 'npm test'
                    }
                }
            }
        }

        // ---------------------------------------------------------------------
        // Stage 5: Build & Packaging
        // ---------------------------------------------------------------------
        stage('Build & Package') {
            steps {
                echo "=================================================================="
                echo "📦 [STAGE 5] Bundling Production Artifacts & Release Tarball"
                echo "=================================================================="
                script {
                    if (isUnix()) {
                        sh 'npm run build'
                    } else {
                        bat 'npm run build'
                    }
                }
            }
        }

        // ---------------------------------------------------------------------
        // Stage 6: Terraform Infrastructure Validation (IaC)
        // ---------------------------------------------------------------------
        stage('Terraform Validation') {
            steps {
                echo "=================================================================="
                echo "🏗️  [STAGE 6] Validating Infrastructure as Code (Terraform)"
                echo "=================================================================="
                script {
                    if (isUnix()) {
                        sh '''
                            echo "Verifying Terraform canonical formatting..."
                            terraform -chdir=terraform fmt -check
                            echo "Validating Terraform configuration syntax..."
                            terraform -chdir=terraform validate
                        '''
                    } else {
                        bat '''
                            @echo off
                            echo Verifying Terraform canonical formatting...
                            terraform -chdir=terraform fmt -check
                            echo Validating Terraform configuration syntax...
                            terraform -chdir=terraform validate
                        '''
                    }
                }
            }
        }

        // ---------------------------------------------------------------------
        // Stage 7: Automated Deployment & Health Verification
        // ---------------------------------------------------------------------
        stage('Automated Deploy') {
            steps {
                echo "=================================================================="
                echo "🚀 [STAGE 7] Executing Automated Continuous Deployment & Smoke Test"
                echo "=================================================================="
                script {
                    if (isUnix()) {
                        sh 'node scripts/deploy-verify.js'
                    } else {
                        bat 'node scripts/deploy-verify.js'
                    }
                }
            }
        }
    }

    // -------------------------------------------------------------------------
    // Post-Build Notifications & Telemetry Archiving
    // -------------------------------------------------------------------------
    post {
        always {
            echo "=================================================================="
            echo "📊 [POST-BUILD] Archiving Test Reports and Build Artifacts"
            echo "=================================================================="
            
            // Ingest and visualize JUnit XML test results
            junit allowEmptyResults: true, testResults: 'reports/**/*.xml'
            
            // Archive build dist bundle and manifests
            archiveArtifacts allowEmptyArchive: true, artifacts: 'dist/**/*', fingerprint: true
        }

        success {
            echo """
            ====================================================================
            🎉 PIPELINE SUCCESSFUL!
            --------------------------------------------------------------------
            Application:  ${env.APP_NAME} (v${env.APP_VERSION})
            Build Number: #${env.BUILD_NUMBER}
            Status:       SUCCESS (All stages passed)
            Author:       ${env.PROJECT_AUTHOR} (PRN: ${env.STUDENT_PRN})
            Artifacts:    dist/ archived and ready for production deployment.
            ====================================================================
            """
        }

        failure {
            echo """
            ====================================================================
            ❌ PIPELINE FAILED!
            --------------------------------------------------------------------
            Build Number: #${env.BUILD_NUMBER}
            Check console logs above for stage failure diagnostic details.
            ====================================================================
            """
        }
    }
}
