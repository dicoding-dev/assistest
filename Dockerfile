FROM node:18-slim

ARG AGRSGROUP=1004

RUN groupadd --force -g $AGRSGROUP assistest
RUN useradd -ms /bin/bash --no-user-group -g $AGRSGROUP -u 1337 assistest

WORKDIR /home/assistest

RUN mkdir /student-app && chown -R assistest:assistest /student-app
RUN mkdir /report && chown -R assistest:assistest /report

RUN mkdir /app && chown -R assistest:assistest /app
COPY --chown=assistest:assistest . .

WORKDIR /home/assistest/app

USER assistest
RUN npm config set package-lock false
RUN yarn install --production=true

ENTRYPOINT ["sh", "entrypoint.sh"]
