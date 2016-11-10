FROM node:4.5.0
RUN git clone https://github.com/linnovate/replay-api.git
WORKDIR /replay-api/authentication-service

RUN git checkout develop
RUN npm -g install sails
RUN npm install grunt -g
RUN npm install

EXPOSE 1337:1337
ARG HOST_IP

# GOOGLE_SECRET,TOKEN_SECRET Provided by command

ENV MONGO_HOST=$HOST_IP MONGO_PORT=27017 MONGO_DATABASE=replay_dev PORT=1337 FRONTEND_PORT=3000 BASE_URL=dev.replay.linnovate.net FRONTEND_URL=dev.replay.linnovate.net
CMD ["sails", "lift"]
