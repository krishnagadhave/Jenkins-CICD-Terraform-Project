# EC2 Compute Infrastructure & Automated Cloud-Init Provisioning
# Project: Cloud Native Jenkins CI/CD + Terraform Mini Project
# Author: Krishna Gadhave (PRN: 202301040250)

# Dynamic AMI Lookup for Ubuntu 24.04 LTS Server (used when var.ami_id is empty)
data "aws_ami" "ubuntu" {
  count       = var.ami_id == "" ? 1 : 0
  most_recent = true
  owners      = ["099720109477"] # Canonical official owner ID

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# EC2 Instance Hosting the Application
resource "aws_instance" "app_server" {
  ami                         = var.ami_id != "" ? var.ami_id : data.aws_ami.ubuntu[0].id
  instance_type               = var.instance_type
  subnet_id                   = aws_subnet.public.id
  vpc_security_group_ids      = [aws_security_group.app_sg.id]
  associate_public_ip_address = true

  # Encrypted GP3 Root Volume
  root_block_device {
    volume_size           = 20
    volume_type           = "gp3"
    encrypted             = true
    delete_on_termination = true
  }

  # Cloud-Init User Data Script: Bootstraps Node.js, application service & monitoring
  user_data = <<-EOF
              #!/bin/bash
              set -ex

              echo "--- Initializing Cloud-Init Application Bootstrap ---"
              apt-get update -y
              apt-get install -y curl git tar ufw

              # Install Node.js LTS (v20)
              curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
              apt-get install -y nodejs

              # Create application user & runtime directory
              useradd -m -s /bin/bash appuser || true
              mkdir -p /opt/cloud-native-app
              chown -R appuser:appuser /opt/cloud-native-app

              # Setup systemd service definition
              cat << 'SERVICE' > /etc/systemd/system/cloud-native-app.service
              [Unit]
              Description=Cloud Native Microservice (Jenkins CI/CD & Terraform)
              After=network.target

              [Service]
              Type=simple
              User=appuser
              WorkingDirectory=/opt/cloud-native-app
              ExecStart=/usr/bin/node /opt/cloud-native-app/src/server.js
              Restart=always
              RestartSec=5
              Environment=PORT=${var.app_port}
              Environment=NODE_ENV=${var.environment}
              Environment=APP_NAME="Cloud-Native CI/CD Microservice"

              [Install]
              WantedBy=multi-user.target
              SERVICE

              systemctl daemon-reload
              echo "--- Bootstrap Completed Successfully ---"
              EOF

  tags = {
    Name = "${var.project_name}-${var.environment}-instance"
    Role = "ApplicationServer"
  }
}
