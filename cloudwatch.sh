#!/bin/bash

sudo apt install -y amazon-cloudwatch-agent

# Download CloudWatch agent installer
sudo curl https://s3.amazonaws.com/amazoncloudwatch-agent/amazon_linux/amd64/latest/amazon-cloudwatch-agent.rpm -O

# Install CloudWatch agent
sudo rpm -U ./amazon-cloudwatch-agent.rpm

# Start CloudWatch agent
sudo systemctl daemon-reload

sudo systemctl enable amazon-cloudwatch-agent

sudo systemctl start amazon-cloudwatch-agent