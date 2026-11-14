# Input Variable Definitions
# Project: Cloud Native Jenkins CI/CD + Terraform Mini Project
# Author: Krishna Gadhave (PRN: 202301040250)

variable "aws_region" {
  description = "AWS Target Region for Infrastructure Deployment"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Target deployment environment tier (dev, staging, prod)"
  type        = string
  default     = "dev"

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "The environment variable must be one of: 'dev', 'staging', 'prod'."
  }
}

variable "project_name" {
  description = "Base identifier prefix for all tagged resources"
  type        = string
  default     = "cloud-native-cicd"
}

variable "vpc_cidr" {
  description = "CIDR block for the custom Virtual Private Cloud (VPC)"
  type        = string
  default     = "10.0.0.0/16"
}

variable "subnet_cidr" {
  description = "CIDR block for the public application subnet"
  type        = string
  default     = "10.0.1.0/24"
}

variable "availability_zone" {
  description = "AWS Availability Zone for the public subnet"
  type        = string
  default     = "us-east-1a"
}

variable "instance_type" {
  description = "EC2 compute instance type for running the application"
  type        = string
  default     = "t3.micro"
}

variable "ami_id" {
  description = "Explicit AMI ID override (Ubuntu 24.04 LTS). If empty, dynamic lookup is performed."
  type        = string
  default     = "ami-0c7217cdde317cfec"
}

variable "app_port" {
  description = "TCP port exposed by the Node.js application service"
  type        = number
  default     = 3000
}

variable "ssh_allowed_cidr" {
  description = "Allowed CIDR ranges for administrative SSH ingress"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}
