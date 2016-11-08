FROM node:4.5.0
RUN git clone https://github.com/linnovate/replay-api.git
WORKDIR /replay-api/authentication-service
RUN git checkout develop
RUN npm -g install sails
RUN npm install grunt -g
RUN npm install

ARG HOST_IP

ENV RABBITMQ_HOST=$HOST_IP MONGO_HOST=$HOST_IP MONGO_PORT=27017 MONGO_DATABASE=replay_dev
CMD ["sails", "lift"]
