FROM node:18-slim

RUN mkdir /student-app && chown -R node:node /student-app
RUN mkdir /report && chown -R node:node /report
RUN usermod -aG root node

WORKDIR /app
RUN chown -R node:node /app

ARG AGRSGROUP=1001

RUN groupadd --force -g $AGRSGROUP agrs
RUN usermod -a -G $AGRSGROUP node

USER node

COPY --chown=node:node . .
RUN npm config set package-lock false
RUN yarn install --production=true

ENTRYPOINT ["sh", "entrypoint.sh"]
