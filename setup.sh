#!/bin/bash

sleep 30

# Update and upgrade packages
sudo apt update
sudo apt upgrade -y

# Install PostgreSQL and related packages
sudo apt install -y postgresql postgresql-contrib

# Start and enable PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql
sudo -u postgres psql
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'root';"
echo "postgres setup successful"

# Install Node.js and npm
sudo apt install -y nodejs
sudo apt install -y npm

# Check Node.js version
nodejs -v

# Configure PostgreSQL: set password, create database, and create user
#sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'your_password';"
#sudo -u postgres createdb your_database
#sudo -u postgres createuser --interactive --pwprompt your_user

echo "Installing unzip"
sudo yum install unzip -y
unzip /home/admin/webApp.zip -d /home/admin/webApp
cd /home/admin/webApp
echo "unzipped successfully"

npm install 

echo "shell file successfully"