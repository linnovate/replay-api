## Description

1. This service combines all swagger-supporting micro-services which
serves their swagger json in /swagger/doc.
2. This service also serves swagger UI on /swagger/ui.

Note the UI will not work if one of the referenced services is not up or responding.

# Installation
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

| Name                        | Description                                  | Default               |
|-----------------------------|----------------------------------------------|-----------------------|
| BASE_HOST                   | Base host of the app                         | http://localhost      | 
| PORT                        | The port which the service will listen to    | 1335                  |
| QUERY_SERVICE_URL           | Url of query service                         | http://localhost:1339 |
| MEDIA_PROVIDER_URL          | Url of media url provider service            | http://localhost:1338 |
| SWAGGER_DOCS_PORT           | Internal port for swagger-combined module    | 1111                  |

# Usage
Run with:
```
sails lift
```

View swagger UI:
```
GET <your_address>/swagger/ui
```
