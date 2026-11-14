# Security Group Definitions for Application Network Ingress/Egress
# Project: Cloud Native Jenkins CI/CD + Terraform Mini Project
# Author: Krishna Gadhave (PRN: 202301040250)

resource "aws_security_group" "app_sg" {
  name        = "${var.project_name}-${var.environment}-app-sg"
  description = "Security group managing HTTP, application port and SSH access"
  vpc_id      = aws_vpc.main.id

  # Ingress Rule: HTTP Standard Port (80)
  ingress {
    description = "Allow inbound HTTP web traffic"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Ingress Rule: Microservice Application Port (3000)
  ingress {
    description = "Allow direct access to microservice application endpoint"
    from_port   = var.app_port
    to_port     = var.app_port
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Ingress Rule: SSH Administrative Port (22)
  ingress {
    description = "Allow administrative SSH access"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = var.ssh_allowed_cidr
  }

  # Egress Rule: Full Outbound Internet Access for Packages & Updates
  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-sg"
  }
}
