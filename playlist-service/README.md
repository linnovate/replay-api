## Description
This service purpose is to manage playlist queries.  
This service also interacts with authorization-service, in order to retrieve the authorization of the user's request to the videos.  
Therefore, authorization-service must be up and running beforehand.

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

| Name                          | Description                                  | Default          |
|-------------------------------|----------------------------------------------|------------------|
| MONGO_HOST                    | Mongo host URI                               | localhost        |
| MONGO_PORT                    | Mongo port                                   | 27017            |
| MONGO_DATABASE                | Mongo database name                          | replay_dev       |
| PORT                          | The port which the service will listen to    | 1338             |
| TOKEN_SECRET				    | Secret for creating JWT    	               | some_random      |
| AUTHORIZATION_SERVICE_HOST    | Authorization service host name              | http://localhost |
| AUTHORIZATION_SERVICE_PORT    |  Authorization service host port             | 1340             |

## Usage
Run with:
```
sails lift
```

Querying examples:
```
GET /playlist
PUT /playlist/:id/mission/:id // adds mission to playlist
DELETE /playlist/:id/mission/:id // removes mission from playlist
DELETE /playlist/:id
```

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
