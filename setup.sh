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
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'root'";
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

# Use this line with the -y flag to automatically answer "yes":
sudo apt-get remove -y git

echo "Installing unzip"
sudo apt-get install unzip
unzip /home/admin/webApp.zip -d /home/admin/webApp
cd /home/admin/webApp
echo "unzipped successfully"

npm install 

# Create a non-admin user
sudo useradd -m webappuser
sudo groupadd webappgroup
 
# Add webappuser and admin to the webappgroup
sudo usermod -aG webappgroup webappuser
sudo usermod -aG webappgroup admin
 
# Set ownership and permissions for webappuser's home directory
sudo chown -R webappuser:webappgroup /home/webappuser
sudo chmod -R 750 /home/webappuser
 
# Set ownership and permissions for the app.js file in admin's directory
sudo chown webappuser:webappgroup /home/admin/webApp/server.js
sudo chmod 750 /home/admin/webApp/server.js
 
# Add webappuser to the systemd-journal group
sudo usermod -aG systemd-journal webappuser
 
# Set the .env file in admin's directory
sudo chmod 644 /home/admin/webApp/.env
 
# Create the log file and set ownership and permissions
sudo touch /var/log/webapp.log
sudo chown webappuser:webappgroup /var/log/webapp.log
sudo chmod 644 /var/log/webapp.log
 
# Set the .env file in admin's directory
sudo chmod 600 /home/admin/webApp/.env

echo "shell file successfully"

sudo mv /tmp/webApp.service /etc/systemd/system/webApp.service
sudo systemctl enable webApp.service
sudo systemctl start webApp.service

echo "systemd file started"