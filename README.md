## Description
This repository is intented to store all the replay-api related microservices.  
Please refer to each service README regarding running and configuration options.  

## General Instructions
Apart from running the microservices in this repo, the UI can be found [here](https://github.com/linnovate/replay).  

In order to be able to run replay-infra, which consists the app backend for capturing videos and processing them, refer to [replay-infra repo](https://github.com/linnovate/replay-infra).

<<<<<<< HEAD
## Nginx
In order to fully run the frontend and the microservices in this repo, one must have a working nginx which will route the requests from frontend to their appropriate microservice.  
Please refer [here](https://github.com/linnovate/replay-infra/tree/develop/ops/nginx) to instructions regarding nginx. 
>
=======
## Docker

Requirements:

```
docker run --name mongodb-prod -d mongo:3.2
```
Mongo data initialisation needs to be confirmed

Elastic instructions: https://github.com/linnovate/replay-infra/blob/feature/docker/ops/elastic/README.md

Then:
https://github.com/linnovate/replay-api/blob/feature/docker/query-service/README.md
https://github.com/linnovate/replay-api/blob/feature/docker/media-url-provider/README.md
https://github.com/linnovate/replay-api/blob/feature/docker/api-service/README.md

Then build UI:
https://github.com/linnovate/replay

Then copy dist folder from above and nginx folder from https://github.com/linnovate/replay-infra/tree/feature/docker/ops
Move dist into nginx folder and follow these instructions:
https://github.com/linnovate/replay-infra/blob/feature/docker/ops/README.md

>>>>>>> feature/docker
