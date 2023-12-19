# Assignment Creation and Submission Portal

Cloud native application which allows professors/teaching assistants to create assignments, perform crud operations on assignments - and for students to submit their assignment projects. This RESTful Backend API service (coded on Node.JS) is designed for cloud computing architecture; which is composed of loosely connected cloud services. The project supports user authentication using basic HTTP authentication with email and password as well as validation checks, such as maximum number of attempts and submission deadlines. The application also handles assignment downloading and email notifications via [Google Cloud Storage](https://cloud.google.com/storage?hl=en) and [Mailgun](https://www.mailgun.com/).

# Tech stack

- **Debian 12** for Server OS
- **NodeJS** programming language
- **Pulumi typescript** for infrastructure code
- **Postgres** for RDMBS
- **Amazon Dynamo DB** for NoSQL database
- **Google Cloud Storage** for object storage
- **Sequelise** for ORM framework

# Packages and libraries

- **Express**: used as the web application framework for handling HTTP requests and responses.
- **Sequelize**: used as the ORM (Object-Relational Mapping) for interacting with the database.
- **bcrypt**: utilised for password hashing and verification in user authentication.
- **AWS SDK**: employed to interact with Amazon Simple Notification Service (SNS) for publishing messages.
- **Winston**: logging package for console and file-based logging.
- **CSV Parser**: processing CSV files for creation or updation in database.
- **Node-StatsD**: collecting custom application metrics.
- **Jest**: used to run the test-suite 

# Database

The application uses Sequelize as the ORM to interact with the underlying relational database Postgres. The database schema includes interconnected tables for assignments, users, and submissions

# Pre-requisites

To install and run the app locally, you need to have the following installed on your local system:

- git configured with ssh [[link]](https://git-scm.com/downloads)
- node v.18.0 and above [[link]](https://nodejs.org/en/download/)
- npm (package manager) 
- Postman to demo hit the APIs [[link]](https://www.postman.com/downloads/)

# Setup

> You need to have ssh configured on your local system to clone this project using ssh

- Clone the server side API service using the following command:
  
```
git clone git@github.com:GargavaSiddharthNEU/webapp.git

```

-  install the dependencies:

```
npm install
```

- configure the .env file, with details such as database connection details and AWS credentials

```
DB_HOST=127.0.0.1
DB_USER=**your-user**
DB_PASSWORD=**your-password**
DB_NAME=**your-dbname**
PORT=8080
CSVPATH= "path-to-your-csv"
accessKeyId=**your-aws-acess-key-id**
secretAccessKey=**your-secretAccessKey**
region=us-east-1
topicarn=**your-topic arn**
```
- Run the application on the default port 8080 with the command: `npm start`

# Development

## API Endpoints

**Health**

<details> 
<summary>Details</summary>

- **GET** */healthz* : Get the health of the API
  - **Response**: 200 OK
  - **Response**: 503 Service Unavailable

</details>

**Assignment endpoints for authorised users**

<details> 
<summary>Details</summary>

- **GET** */v1/assignments* : Get list of all assignments
  - **Response**: 200 OK
  ```
  [
    {
    "id": "d290f1ee-6c54-4b01-90e6-d701748f0851",
    "name": "Assignment 01",
    "points": 10,
    "num_of_attemps": 3,
    "deadline": "2016-08-29T09:12:33.001Z",
    "assignment_created": "2016-08-29T09:12:33.001Z",
    "assignment_updated": "2016-08-29T09:12:33.001Z"
        }
    ]
  ```
  - **Response**: 401 *Unauthorised*
  - **Response**: 403 *Forbidden*


- **POST** */v1/assignments* : Create Assignment
  - **Request Body**: Application/JSON (Required)
  ```
    {
  "name": "Assignment 01",
  "points": 10,
  "num_of_attemps": 3,
  "deadline": "2023-08-29T09:12:33.001Z"
    }
  ```

  - **Response**: 201 Assignment Created
  ```
    {
  "id": "d290f1ee-6c54-4b01-90e6-d701748f0851",
  "name": "Assignment 01",
  "points": 10,
  "num_of_attemps": 3,
  "deadline": "2016-08-29T09:12:33.001Z",
  "assignment_created": "2016-08-29T09:12:33.001Z",
  "assignment_updated": "2016-08-29T09:12:33.001Z"
    }
  ```
  - **Response**: 400 *Bad Request*
  - **Response**: 401 *Unauthorised*
  - **Response**: 403 *Forbidden*


- **GET** */v1/assignments/{id}* : Get assignment details
  - **id**: String(Required)
  
  - **Response**: 200 OK
  ```
  [
    {
    "id": "d290f1ee-6c54-4b01-90e6-d701748f0851",
    "name": "Assignment 01",
    "points": 10,
    "num_of_attemps": 3,
    "deadline": "2016-08-29T09:12:33.001Z",
    "assignment_created": "2016-08-29T09:12:33.001Z",
    "assignment_updated": "2016-08-29T09:12:33.001Z"
        }
    ]
  ```
  - **Response**: 401 *Unauthorised*
  - **Response**: 403 *Forbidden*

- **DELETE** */v1/assignments/{id}* : Delete the assignment
  - **id**: String(Required)
  
  - **Response**: 204 No content
  - **Response**: 401 *Unauthorised*
  - **Response**: 404 *Not Found*

- **PUT** */v1/assignments/{id}* : Update the assignment
  - **id**: String(Required)
  - **Request Body**: Application/JSON (Required)
  ```
    {
  "name": "Assignment 01",
  "points": 10,
  "num_of_attemps": 3,
  "deadline": "2016-08-29T09:12:33.001Z"
    }
  ```
  
  - **Response**: 204 No Content
  - **Response**: 401 *Unauthorised*
  - **Response**: 403 *Forbidden*
  - **Response**: 400 *Bad Request*

</details>

**Assignment submission endpoint**

<details> 
<summary>Details</summary>

- **POST** */v1/assignments/{id}/submission* : Submit Assignment
  - **id**: String(Required)
  - **Request Body**: Application/JSON (Required)
  ```
    {
  "submission_url": "https://github.com/tparikh/myrepo/archive/refs/tags/v1.0.0.zip"
    }
  ```

  - **Response**: 201 Submission Accepted
  ```
    {
  "id": "d290f1ee-6c54-4b01-90e6-d701748f0851",
  "assignment_id": "daca41f5-08e4-4845-860c-1d0164422f5d",
  "submission_url": "https://github.com/tparikh/myrepo/archive/refs/tags/v1.0.0.zip",
  "submission_date": "2016-08-29T09:12:33.001Z",
  "submission_updated": "2016-08-29T09:12:33.001Z"
    }
  ```
  - **Response**: 400 *Bad Request*
  - **Response**: 401 *Unauthorised*
  - **Response**: 403 *Forbidden*

</details>

## Schemas

`Account`

```
{
id:	string($uuid)
    example: d290f1ee-6c54-4b01-90e6-d701748f0851
    readOnly: true
first_name*: string
    example: Jane
last_name*:	string
    example: Doe
password*: string($password)
    example: somepassword
    writeOnly: true
email*:	string($email)
    example: jane.doe@example.com
account_created: string($date-time)
    example: 2016-08-29T09:12:33.001Z
    readOnly: true
account_updated: string($date-time)
    example: 2016-08-29T09:12:33.001Z
    readOnly: true
}
```

`Assignment`

```
{
id:	string($uuid)
    example: d290f1ee-6c54-4b01-90e6-d701748f0851
    readOnly: true
name*: string
    example: Assignment 01
points*: number
    example: 10
    minimum: 1
    maximum: 100
num_of_attemps*: number
    example: 3
    minimum: 1
    maximum: 100
deadline*: string($date-time)
    example: 2016-08-29T09:12:33.001Z
assignment_created:	string($date-time)
    example: 2016-08-29T09:12:33.001Z
    readOnly: true
assignment_updated: string($date-time)
    example: 2016-08-29T09:12:33.001Z
    readOnly: true
}
```

`Submission`

```
{
id:	string($uuid)
    example: d290f1ee-6c54-4b01-90e6-d701748f0851
    readOnly: true
assignment_id*:	string($uuid)
    example: daca41f5-08e4-4845-860c-1d0164422f5d
    readOnly: true
submission_url*: string($url)
    example: https://github.com/tparikh/myrepo/archive/refs/tags/v1.0.0.zip
submission_date: string($date-time)
    example: 2016-08-29T09:12:33.001Z
    readOnly: true
submission_updated: string($date-time)
    example: 2016-08-29T09:12:33.001Z
    readOnly: true
}
```

# Testing

The application includes integration tests coded with jest framework. You can run tests using: `npm test`

# Packer

Packer from HashiCorp is used to build custom AMI (Amazon Machine Images)

## Installing Packer
- Download the appropriate [package](https://developer.hashicorp.com/packer/install#Windows) for Windows
- Extract the contents of the downloaded ZIP file to a folder of your choice
- Add the path of the folder where you extracted Packer in the system variables section
- After installing Packer, verify the installation worked by opening a new command prompt, and type in `packer` to check the details

## Building Custom AMI using Packer

- Packer uses Hashicorp Configuration Language(HCL) to create a build template. We'll use the [Packer docs](https://developer.hashicorp.com/packer/docs/templates/hcl_templates) to create the build template file

### Create the `.pkr.hcl` template

The custom AMI should have the following features:

- **OS**: Debian 12
- **Build**: built on the default VPC
- **Device Name**: /dev/sda1/
- **Volume Size**: 50GiB
- **Volume Type**: gp2
- Have valid provisioners.
- Pre-installed dependencies using a shell script.
- Web application software pre-installed on the AMI.

### Shell Provisioners

This will automate the process of updating the OS packages and installing software on the AMI and will have our application in a running state whenever the custom AMI is used to launch an EC2 instance. It should also copy artifacts to the AMI in order to get the application running. It is important to bootstrap our application here, instead of manually SSH-ing into the AMI instance.

### AMI Creation

- To format the template, use:
  ```
  packer fmt .
  ```
- To validate the template, use:
  ```
  packer validate .
  ```
- To build the custom AMI using packer, use:
  ```
  packer build <filename>.pkr.hcl
  ```

### systemd

`systemd` is a suite of basic building blocks for a Linux system. It provides a system and service manager that runs as PID 1 and starts the rest of the system.. This will help us bootstrap our application and have it in a running state when we launch our custom AMI EC2 instance.

# CI/CD Pipelines

## Integration Tests

This CI pipeline must run before changes are merged via a PR to the upstream main branch. Once the integration tests pass, the CI pipeline should check the validity of the packer build configuration.

## Validate Template

This CI pipeline will validate the packer build template when a pull request is opened. The PR status checks should fail and block merge in case the template is invalid.

## Build AMI

This is the CD pipeline for our organization.

The AMI should be built when the PR is merged. The ami should be shared with the AWS prod account automatically. [This can be done by providing the AWS account ID in the packer template]

After the AMI is built, we will create a new version of the launch template and update the original launch template. Using this approach, we are just replacing the golden image in our application infrastructure where instances using an older golden image are drained, and new instances are launched using the latest golden image(AMI).

> [!NOTE]
> For security, request an SSL certificate from any SSL vendor, and import it into AWS Certificate Manager from your CLI 

# Author

[Siddharth Gargava](mailto:gargavasiddharth@gmail.com)