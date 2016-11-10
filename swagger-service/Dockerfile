FROM node:4.5.0
RUN git clone https://github.com/linnovate/replay-api.git
WORKDIR /replay-api/swagger-service
RUN git checkout develop
RUN npm -g install sails
RUN npm install

EXPOSE 1335:1335
ARG HOST_IP

#TODO: ADD QUERY_SERVICE_URL,MEDIA_PROVIDER_URL(,SWAGGER_DOCS_PORT)
ENV MONGO_HOST=$HOST_IP MONGO_PORT=27017 MONGO_DATABASE=replay_dev BASE_HOST=dev.replay.linnovate.net PORT=1335
CMD ["sails", "lift"]
