FROM node:4.5.0
RUN git clone https://github.com/linnovate/replay-api.git
WORKDIR /replay-api/media-url-provider
<<<<<<< HEAD
RUN git checkout develop
RUN npm -g install sails
RUN npm install

EXPOSE 1339:1339
ARG HOST_IP

ENV MONGO_HOST=$HOST_IP MONGO_PORT=27017 MONGO_DATABASE=replay_dev
CMD ["sails", "lift"]

=======
RUN git checkout master
RUN npm -g install sails
RUN npm install
ENV RABBITMQ_HOST=rabbitmq-server MONGO_HOST=mongodb-prod MONGO_PORT=27017 MONGO_DATABASE=replay_dev
CMD ["sails", "lift"]
>>>>>>> feature/docker
