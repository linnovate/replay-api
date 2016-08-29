## Description

This service is responsible to route user requests to the appropriate service.

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
| BASE_URL                      | API base url                                 | localhost      |
| PORT         		            | API port                                     | 1337           |
| GOOGLE_SECRET				    | Google authentication secret 			       | 			    |
| MEDIA_SERVICE_URL             | meida-url-provider url      			       |http://localhost|
| MEDIA_SERVICE_PORT  		    | meida-url-provider port      			       | 1339		    |
| QUERY_SERVICE_URL   		    | query service url 			               |http://localhost|
| QUERY_SERVICE_PORT  		    | query service port      			    	   | 1338		    |
| RABBITMQ_HOST				    | hostname of rabbit queues					   | localhost      |
| KALTURA_PARTNER_ID            | The partner ID in kaltura                    |                |
| KALTURA_URL                   | Kaltura URI                                  |                |

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

## Docker
```
docker build -t api-service .
docker run -d -p 1337:1337 --restart=always --link mongodb-server:mongodb-server --link query-service:query-service --link media-url-provider:media-url-provider api-service
```

