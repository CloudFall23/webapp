packer {
  required_plugins {
    amazon = {
      source  = "github.com/hashicorp/amazon"
      version = ">= 1.0.0"
    }
  }
}

variable "aws_region" {
  description = "The AWS region where the AMI will be created."
  type        = string
  default     = "us-east-1" # Default region
}

locals {
  timestamp = regex_replace(timestamp(), "[- TZ:]", "")
}

source "amazon-ebs" "webApp" {
  ami_users = ["388344348771", "075160867462"]
  ami_name  = "webApp-${local.timestamp}"
  profile   = "develop"

  source_ami_filter {
    filters = {
      name                = "debian-12-amd64-*"
      root-device-type    = "ebs"
      virtualization-type = "hvm"
    }
    most_recent = true
    owners      = ["amazon"]
  }


  instance_type = "t2.micro"
  region        = var.aws_region # Use the variable for region
  ssh_username  = "admin"
}

build {
  sources = [
    "source.amazon-ebs.webApp"
  ]

  provisioner "file" {
    source      = "./webApp.zip"
    destination = "/tmp/webApp.zip"
  }

  provisioner "file" {
    source      = "./webApp.service"
    destination = "/tmp/webApp.service"
  }

  provisioner "shell" {
    script = "./setup.sh"
  }

  post-processor "manifest" {
    output     = "manifest.json"
    strip_path = true
  }

}