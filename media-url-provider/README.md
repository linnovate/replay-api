## Description

This project is a microservice designed components which responsible to provide http requests of media source urls.

## Installation
Install sails globally
```
sudo npm -g install sails
```
On Windows (or Mac OS with Homebrew), you don't need sudo:
```
npm -g install sails
```

Clone the repo and install dependencies:
```
npm install
```

## Configurations
Set environment variables to config the app:

| Name                          | Description                                  | Default        |
|-------------------------------|----------------------------------------------|----------------|
| MONGO_HOST                    | Mongo host URI                               | localhost      |
| MONGO_PORT                    | Mongo port                                   | 27017          |
| MONGO_DATABASE                | Mongo database name                          | replay_dev     |

## Usage
Run with:
```
sails lift
```
Example of passing env variables specific to process:

```
MONGO_HOST=127.0.0.1 MONGO_PORT=27017 MONGO_DATABASE=replay_dev sails lift.
```

## Tests
Tests in this project use Mocha testing framework:
```
sudo npm install -g mocha
```

Run the tests with:
```
npm test
```

for code coverage run

```
npm run coverage
```

## Docker
```
docker build -t media-url-provider .
```
docker run -d -p 1339:1339 --link mongodb-server:mongodb-server --name media-url-provider media-url-provider