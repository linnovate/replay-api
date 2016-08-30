FROM node:4.5.0
RUN git clone https://github.com/linnovate/replay-api.git
WORKDIR /replay-api/api-service
RUN git checkout master
RUN npm -g install sails
RUN npm install
ENV RABBITMQ_HOST=rabbitmq-server MONGO_HOST=mongodb-prod MONGO_PORT=27017 MONGO_DATABASE=replay_dev
ENV MEDIA_=http://media-url-provider MEDIA_SERVICE_PORT=1339 QUERY_SERVICE_URL=http://query-service QUERY_SERVICE_PORT=1338
CMD ["sails", "lift"]