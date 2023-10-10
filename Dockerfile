FROM node:18-slim

ARG AGRSGROUP=1004

RUN groupadd --force -g $AGRSGROUP assistest
RUN useradd -ms /bin/bash --no-user-group -g $AGRSGROUP -u 1337 assistest

RUN mkdir /home/assistest/student-app && chown -R assistest:assistest /home/assistest/student-app
RUN mkdir /home/assistest/report && chown -R assistest:assistest /home/assistest/report

VOLUME ["/home/assistest/student-app"]

WORKDIR /home/assistest/app
RUN chown -R assistest:assistest /home/assistest/app

USER assistest

COPY --chown=assistest:assistest . .
RUN npm config set package-lock false
RUN yarn install --production=true

ENTRYPOINT ["/bin/bash", "entrypoint.sh"]
