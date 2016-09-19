## Description

This service is responsible to authenticate user requests.

The service supports authentication with google and ADFS (saml).

In order to authenticate with google:
```
GET /auth/google
```

And with ADFS-SAML:
```
GET /auth/adfs-saml
```

In order to verify a request's JWT:
```
GET /auth
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
| BASE_URL                      | Service base url                      | https://localhost  |
| PORT         		            | Service listening port                | 1337               |
| FRONTEND_URL                  | Frontend url                          | http://localhost   |
| FRONTEND_PORT                 | Frontend port                         | 3000               |
| GOOGLE_SECRET				    | Google authentication secret 	        | some_random        |
| TOKEN_SECRET				    | Secret for creating JWT    	        | some_random        |

## Usage
Run with:
```
sails lift
```

## Swagger
go to http://localhost:1337/swagger/ui

## Some tips
For live-coding we recommend to use nodemon
```
sudo npm install -g nodemon
```
on Windows or Mac OS
```
npm install -g nodemon
```
Afterwards, you do not need to run `sails lift` but just `nodemon`

