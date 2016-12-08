FROM node:4.5.0
RUN git clone https://github.com/linnovate/replay-api.git
WORKDIR /replay-api/query-service
RUN git checkout develop
RUN npm install -g yarn
RUN yarn global add sails
RUN yarn
ENV RABBITMQ_HOST=rabbitmq-server MONGO_HOST=mongodb-prod MONGO_PORT=27017 MONGO_DATABASE=replay_dev AUTHORIZATION_SERVICE_HOST=http://172.17.0.1
RUN npm test || true

EXPOSE 1338:1338
ARG HOST_IP

ENV MONGO_HOST=$HOST_IP MONGO_PORT=27017 MONGO_DATABASE=replay_dev PORT=1338
CMD ["sails", "lift"]
