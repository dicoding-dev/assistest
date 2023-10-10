FROM node:18-slim

ARG AGRSGROUP=1004

RUN groupadd --force -g $AGRSGROUP assistest
RUN useradd -ms /bin/bash --no-user-group -g $AGRSGROUP -u 1337 assistest

RUN mkdir /student-app && chown -R assistest:assistest /student-app
RUN mkdir /report && chown -R assistest:assistest /report
RUN usermod -aG root assistest

WORKDIR /app
RUN chown -R assistest:assistest /app

USER assistest

COPY --chown=assistest:assistest . .
RUN npm config set package-lock false
RUN yarn install --production=true

ENTRYPOINT ["sh", "entrypoint.sh"]
