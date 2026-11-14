# 🏗️ System Architecture & Engineering Specifications

**Project:** Cloud Native Jenkins CI/CD + Terraform Mini Project  
**Author:** Krishna Gadhave (PRN: 202301040250)  
**Course:** Cloud Native Computing & DevOps  

---

## 1. End-to-End System Architecture

```mermaid
flowchart TD
    subgraph DeveloperWorkstation["Developer Environment"]
        Dev["Developer (Krishna Gadhave)"]
        GitRepo["Local Git Repository"]
        Dev -->|git commit & push| GitRepo
    end

    subgraph VersionControl["Remote Source Control (GitHub)"]
        GitHub["GitHub Repository\n(main branch)"]
        Webhook["GitHub Webhook\nPOST /github-webhook/"]
        GitRepo -->|git push| GitHub
        GitHub -->|Triggers on push| Webhook
    end

    subgraph CICDEngine["Jenkins CI/CD Automation Engine"]
        JenkinsMaster["Jenkins Controller"]
        Webhook -->|HTTP Payload| JenkinsMaster
        
        subgraph PipelineExecution["Declarative Pipeline Execution"]
            S1["1. SCM Checkout\n(git fetch & log)"]
            S2["2. Environment Check\n(Node, npm, terraform)"]
            S3["3. Code Quality & Lint\n(AST & security analysis)"]
            S4["4. Automated Tests\n(Unit, Integration, JUnit XML)"]
            S5["5. Build & Packaging\n(dist/ & release tarball)"]
            S6["6. Terraform Validation\n(fmt -check & validate)"]
            S7["7. Automated Deploy\n(Continuous delivery & smoke test)"]
            
            S1 --> S2 --> S3 --> S4 --> S5 --> S6 --> S7
        end
        
        JenkinsMaster --> PipelineExecution
        
        subgraph PostActions["Post-Build Artifacts & Reporting"]
            JUnitReport["JUnit XML Test Trend\n(12 passing tests)"]
            ArtifactsArchive["Fingerprinted Build Artifacts\n(dist/*.tar.gz & manifest)"]
        end
        
        PipelineExecution --> PostActions
    end

    subgraph CloudInfrastructure["AWS Cloud Infrastructure (Provisioned via Terraform)"]
        subgraph VPC["Custom VPC: 10.0.0.0/16"]
            IGW["Internet Gateway"]
            subgraph Subnet["Public Subnet: 10.0.1.0/24"]
                SG["Security Group (app-sg)\nPorts: 80, 3000, 22"]
                subgraph EC2["EC2 Instance (t3.micro)"]
                    AppService["Node.js Cloud-Native App\n(systemd managed service)"]
                end
            end
        end
        IGW --- Subnet
        SG --- EC2
    end

    S6 -.->|Validates HCL code| CloudInfrastructure
    S7 -.->|Deploys application bundle| AppService

    subgraph EndUsers["Clients & Observability"]
        BrowserUser["Web Browser\n(Dashboard UI)"]
        MonitoringAgent["Health Probe / Monitoring\n(GET /api/health)"]
        BrowserUser -->|HTTP :3000| AppService
        MonitoringAgent -->|HTTP :3000/api/health| AppService
    end
```

---

## 2. Jenkins Declarative Pipeline Lifecycle

```mermaid
stateDiagram-v2
    [*] --> CheckoutSCM: Git Push Trigger / Manual Build
    CheckoutSCM --> EnvironmentCheck: SCM Success
    EnvironmentCheck --> CodeQualityLint: Tooling Verified
    CodeQualityLint --> AutomatedTests: Lint 0 Violations
    AutomatedTests --> BuildAndPackage: 12/12 Tests Pass
    BuildAndPackage --> TerraformValidation: Artifacts Bundled
    TerraformValidation --> AutomatedDeploy: HCL Schema Valid
    AutomatedDeploy --> PostBuild: Health Check 200 OK
    
    PostBuild --> ArchiveReports: JUnit Test Results
    PostBuild --> ArchiveArtifacts: dist/ Tarball
    ArchiveReports --> BuildSuccess: Build Status = SUCCESS
    ArchiveArtifacts --> BuildSuccess
    
    CodeQualityLint --> BuildFailure: Syntax / Security Error
    AutomatedTests --> BuildFailure: Any Test Failure
    TerraformValidation --> BuildFailure: Syntax / Reference Error
    AutomatedDeploy --> BuildFailure: Health Check Timeout
    BuildFailure --> [*]
    BuildSuccess --> [*]
```

---

## 3. Terraform Cloud Infrastructure Topology

```mermaid
classDiagram
    class AWS_VPC {
        +String cidr_block = "10.0.0.0/16"
        +Boolean enable_dns_hostnames = true
        +Boolean enable_dns_support = true
    }

    class AWS_Internet_Gateway {
        +String vpc_id
    }

    class AWS_Public_Subnet {
        +String vpc_id
        +String cidr_block = "10.0.1.0/24"
        +String availability_zone = "us-east-1a"
        +Boolean map_public_ip_on_launch = true
    }

    class AWS_Route_Table {
        +String vpc_id
        +String destination_cidr = "0.0.0.0/0"
        +String gateway_id
    }

    class AWS_Security_Group {
        +String name = "cloud-native-cicd-dev-app-sg"
        +Rule ingress_http_80
        +Rule ingress_app_3000
        +Rule ingress_ssh_22
        +Rule egress_all_traffic
    }

    class AWS_EC2_Instance {
        +String ami = "Ubuntu 24.04 LTS"
        +String instance_type = "t3.micro"
        +String subnet_id
        +List security_groups
        +Boolean associate_public_ip = true
        +Script user_data
    }

    AWS_VPC "1" *-- "1" AWS_Internet_Gateway
    AWS_VPC "1" *-- "1" AWS_Public_Subnet
    AWS_VPC "1" *-- "1" AWS_Route_Table
    AWS_Public_Subnet "1" *-- "1" AWS_Security_Group
    AWS_Public_Subnet "1" *-- "1" AWS_EC2_Instance
    AWS_Security_Group "1" ..> "1" AWS_EC2_Instance : Attached
    AWS_Route_Table "1" ..> "1" AWS_Public_Subnet : Associated
```

---

## 4. Microservice Health Probe & State Transitions

```mermaid
stateDiagram-v2
    [*] --> Initializing: node src/server.js
    Initializing --> Healthy: Server listening on PORT
    
    state Healthy {
        [*] --> UP: /api/health -> 200 OK
        [*] --> READY: /api/ready -> 200 OK
    }
    
    Healthy --> SimulatedFailure: GET /api/simulate-unhealthy
    
    state SimulatedFailure {
        [*] --> DOWN: /api/health -> 503 Service Unavailable
    }
    
    SimulatedFailure --> Healthy: GET /api/reset
    Healthy --> Terminating: SIGTERM / SIGINT
    Terminating --> [*]: Graceful HTTP socket close
```
