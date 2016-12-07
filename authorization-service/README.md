## Description
This service is responsible to encapsulate the logic of an external 3rd party authorization service,  
whose authorization rules present in the authorizationXml, for the entire replay app.

All the other services should apply here in order to recieve the authenticated user's permissions:
```
GET /compartment?id=<userId>
```

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

| Name                          | Description                           | Default            |
|-------------------------------|---------------------------------------|--------------------|
| MONGO_HOST                    | Mongo host URI                        | localhost          |
| MONGO_PORT                    | Mongo port                            | 27017              |
| MONGO_DATABASE                | Mongo database name                   | replay_dev         |
| MONGO_USERNAME                | Mongo username                        | replay             |
| MONGO_PASSWORD                | Mongo password                        | replay             |
| PORT         		            | Service listening port                | 1340               |

## Usage
Run with:
```
sails lift
```
