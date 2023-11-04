#!/bin/bash

sleep 30

# Update and upgrade packages
sudo apt update
sudo apt upgrade -y

# Install PostgreSQL and related packages
# sudo apt install -y postgresql postgresql-contrib

# Start and enable PostgreSQL service
# sudo systemctl start postgresql
# sudo systemctl enable postgresql
# sudo -u postgres psql
# sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'root'";
# echo "postgres setup successful"


# Install Node.js and npm
sudo apt install -y nodejs
sudo apt install -y npm

# Check Node.js version
nodejs -v

# Configure PostgreSQL: set password, create database, and create user
#sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'your_password';"
#sudo -u postgres createdb your_database
#sudo -u postgres createuser --interactive --pwprompt your_user

# Use this line with the -y flag to automatically answer "yes":
sudo apt-get remove -y git

echo "Installing unzip"
sudo apt-get install unzip

#cp in tmp
sudo cp /tmp/webApp.zip /opt/webApp.zip
sudo unzip /opt/webApp.zip -d /opt/webApp

#sudo apt install -y amazon-cloudwatch-agent
sudo wget https://s3.amazonaws.com/amazoncloudwatch-agent/debian/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i -E ./amazon-cloudwatch-agent.deb
rm ./amazon-cloudwatch-agent.deb

cd /opt/webApp
echo "unzipped successfully"

sudo npm install 

echo "shell file successfully"

# User adding group
sudo groupadd csye6225
sudo useradd -s /bin/false -g csye6225 -d /opt/csye6225 -m csye6225

sudo chown -R csye6225:csye6225 /opt/webApp/
sudo chmod -R 750  /opt/webApp/

sudo cp /tmp/webApp.service /etc/systemd/system/webApp.service
sudo systemctl enable webApp.service
sudo systemctl start webApp.service

echo "systemd file started"