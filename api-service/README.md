# Replay

A backend app for the Replay project

## Features
* Customer model
    + List all customers
    + Create a new customer
    + Show certain customer
* User model
* Authentication
    + Google Oauth 2.0

## Installation
Install sails globally
```
sudo npm -g install sails
```
On Windows (or Mac OS with Homebrew), you don't need sudo:
```
npm -g install sails
```
Clone the repository
```
git clone git@github.com:linnovate/replay.git
```
Go to app dir
```
cd replay
```
Do regular installation
```
npm install
```

## Configuration
* No configuration needed

## Usage
Run the app
```
sails lift
```

Set environment variables to config the app:

| Name                          | Description                                  | Default        |
|-------------------------------|----------------------------------------------|----------------|
| MONGO_HOST                    | Mongo host URI                               | localhost      |
| MONGO_PORT                    | Mongo port                                   | 27017          |
| MONGO_DATABASE                | Mongo database name                          | replay_dev     |
| BASE_URL                      | API base url                                 | localhost      |
| PORT         		            | API port                                     | 1337           |
| GOOGLE_SECRET				    | Google authentication secret 			       | 			    |
| MEDIA_SERVICE_URL             | meida-url-provider url      			       |http://localhost|
| MEDIA_SERVICE_PORT  		    | meida-url-provider port      			       | 1339		    |
| QUERY_SERVICE_URL   		    | query service url 			               |http://localhost|
| QUERY_SERVICE_PORTT  		    | query service port      			    	   | 1338		    |
| RABBITMQ_HOST				    | hostname of rabbit queues					   | localhost      |
| KALTURA_PARTNER_ID            | The partner ID in kaltura                    |                |
| KALTURA_URL                   | Kaltura URI                                  |                |

## Swagger
go to http://localhost:1337/swagger/ui


## Authentication

### Google Oauth 2.0
Google Oauth credentials and some logic stored in `config/passport.js'

#### Login
Go to
```
/auth/login
```
Walk over the auth process
Go to see that you are logged-in:
```
/user/me
```
####  Logout
```
/auth/logout
```

Note! Policies are not implemented

## Some tips
For live-coding we recommend to use nodemon
```
sudo npm install -g nodemon
```
on Windows or Mac OS
```
npm install -g nodemon
```
Afterwords, you do not need to run `sails lift` but just `nodemon`
