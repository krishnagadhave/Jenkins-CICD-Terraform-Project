# Output Definitions Exposing Infrastructure Telemetry & Endpoints
# Project: Cloud Native Jenkins CI/CD + Terraform Mini Project
# Author: Krishna Gadhave (PRN: 202301040250)

output "vpc_id" {
  description = "Identifier of the provisioned custom Virtual Private Cloud"
  value       = aws_vpc.main.id
}

output "subnet_id" {
  description = "Identifier of the public application subnet"
  value       = aws_subnet.public.id
}

output "security_group_id" {
  description = "Identifier of the application security group"
  value       = aws_security_group.app_sg.id
}

output "instance_id" {
  description = "EC2 Instance ID hosting the microservice"
  value       = aws_instance.app_server.id
}

output "instance_public_ip" {
  description = "Public IPv4 address of the deployed EC2 instance"
  value       = aws_instance.app_server.public_ip
}

output "instance_public_dns" {
  description = "Public DNS hostname of the deployed EC2 instance"
  value       = aws_instance.app_server.public_dns
}

output "application_url" {
  description = "Direct HTTP access URL for the application web dashboard"
  value       = "http://${aws_instance.app_server.public_ip}:${var.app_port}"
}

output "health_check_url" {
  description = "Health probe endpoint URL for CI/CD automated validation"
  value       = "http://${aws_instance.app_server.public_ip}:${var.app_port}/api/health"
}
