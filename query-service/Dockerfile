FROM node:4.5.0
RUN git clone https://github.com/linnovate/replay-api.git
WORKDIR /replay-api/query-service
<<<<<<< HEAD
RUN git checkout develop
=======
RUN git checkout master
>>>>>>> feature/docker
RUN npm -g install sails
RUN npm install
ENV RABBITMQ_HOST=rabbitmq-server MONGO_HOST=mongodb-prod MONGO_PORT=27017 MONGO_DATABASE=replay_dev
ENV ELASTIC_HOST=elastic-prod
<<<<<<< HEAD
CMD ["sails", "lift"]
=======
CMD ["sails", "lift"]
>>>>>>> feature/docker
