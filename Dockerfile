FROM node:14.17.6
WORKDIR /app

COPY . .
RUN yarn

ENTRYPOINT ["yarn", "assistest"]