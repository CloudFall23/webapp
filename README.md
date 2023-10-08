# WebApp

## APIs

GetAll Assignments: Get API - http://178.128.150.95:8080/v1/assignments/ 
Get Assignments by ID: Get API - http://178.128.150.95:8080/v1/assignments/40030eca-3498-44f1-9f22-4b0e39076d8b
Create Assignment: POST API - http://178.128.150.95:8080/v1/assignments/919bd6d2-9f49-463f-82bc-049c51815962
Update Assignment: PUT API - http://178.128.150.95:8080/v1/assignments/40030eca-3498-44f1-9f22-4b0e39076d8b
Delete Assignment: DELETE API - http://178.128.150.95:8080/v1/assignments/40030eca-3498-44f1-9f22-4b0e39076d8b

## Git steps
> git checkout main
> git pull
> git checkout -b name
> git add .
> git commit -m "Changes"
> git push origin name
> Pull request to org main
> Merge
> Sync with forked main

## Debian
> After shell script running
> sudo -u postgres psql
> \password postgres
> Enter password
> \q
> npm install
> Node server.js

## Droplet settings
> Create Debian droplet
> In /root(siddh) cmd - ssh -i .\.ssh\digitalocean root@192.241.145.56(your ip)
> Open a new terminal
> csv copy - scp -i C:\Users\siddh\.ssh\digitalocean C:\Users\siddh\Downloads\users.csv root@178.128.150.95:/opt
> folder copy: scp -r -i C:\Users\siddh\.ssh\digitalocean .\your_folder_in_siddh\ root@178.128.150.95:/demo
> cd to setup.sh level
> chmod +x setup.sh
> ./setup.sh

## Show Debian Postgres Database
psql -h hostname -U postgres -d postgres
select * from users
\q